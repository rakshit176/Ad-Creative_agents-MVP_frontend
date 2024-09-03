import { useEffect, useRef, useState } from "react";
import generateTool from "/icons/generate_tool_white.svg";
// import adCreatorBanner from "/images/Ad-creator-banner.png"
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateType } from "../../types/reduxTypes";
import { addBackground, addImage, handleDragStart, imgToBase64, uploadBackgroundImage } from "../../services/canvasMethods";
import { generateModelPromptAPI, getImagesbyUnsplash, modelStudioAPI, modelStudioHarmonizeAPI } from "../../services/APIservice";
import { Background, Men, Model, Product, Women, loaded, loading, modelStudio, productStudio } from "../../assets/defaultStrings";
import { setGeneratedImageSrc, setGeneratedImagesList, setGeneratedModelsList, setLoading, setModelFace, setModelGenerate, setModelGeneratePrompt, setModelPose, setRatio } from "../../features/canvas/canvasSlice";
import RemoveProductBgModal from "../RemoveProductBgModal";
// import { modelStyles } from "../../assets/modelStyles";
import toast from "react-hot-toast";
import "../../assets/stylesheets/spinnerLoader.css";
import { demoBackgrounds, fullBackgrounds, sampleProducts } from "../../assets/assetSamples";
import { demoModelPoses, modelPoses, modelSamples } from "../../assets/modelSamples";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import KrutLoader from "../KrutLoader";

function Assets({ location }: { location: string }) {
    const [assetChoice, setAssetChoice] = useState(location === modelStudio ? Model : Product);
    const [searchKeyword, setsearchKeyword] = useState("");
    const [Prompt, setPrompt] = useState("");
    const [imageNumbers, setImageNumbers] = useState("1");
    const [modelGender, setModelGender] = useState(Women);
    const [modelStyle, setModelStyle] = useState("");
    const [searchStatus, setSearchStatus] = useState<null | string>(null);
    const [searchResults, setSearchResults] = useState<null | [{ thumb: string, regular: string }]>(null);
    const [sampleModels, setSampleModels] = useState<null | string[]>(null);
    const [sampleModelPose, setSampleModelPose] = useState(null);
    const [expandedModelType, setExpandedModelType] = useState(null);
    const [isBgExpandedView, setIsBgExpandedView] = useState(null);
    const { editor, modelPose, modelFace } = useSelector((state: ReduxStateType) => state.canvas);
    const [backgroundsListPreview, setBackgroundsListPreview] = useState(demoBackgrounds);
    const formRef = useRef<HTMLFormElement>(null);
    const dispatch = useDispatch();


    useEffect(() => {
        // to enable and disable canvas for model generation
        if (assetChoice === Model) {
            dispatch(setModelGenerate(true));
            dispatch(setRatio("1023:1023")); //reset to 1:1 aspect ratio
        } else {
            dispatch(setModelGenerate(false));
        }
    }, [assetChoice])

    useEffect(() => {
        return () => {
            dispatch(setModelGenerate(false));
        }
    }, [])

    useEffect(() => {
        dispatch(setModelFace(null));
        dispatch(setModelPose(null));
    }, [modelGender])



    //--------------- Model Pose and Face Samples --------------

    useEffect(() => {
        const demoModelPosesList = demoModelPoses.filter((item) => item.gender === (modelGender === Women ? "female" : "male"))
        setSampleModelPose(demoModelPosesList)
    }, [modelGender])


    function showDemoModelData() {  //limit to 6 data for each
        const sampleModelsList: string[] = []
        for (let i = 1; i <= 3; i++) {
            sampleModelsList.push(`/images/model_faces/${modelGender === Women ? "female" : "male"}_faces/thumbnails/${modelGender === Women ? "female" : "male"}_${i}.png`);
        }
        setSampleModels(sampleModelsList);

        // const sampleModelPoseList: string[] = modelPoses.filter((item) => item.gender === (modelGender === Women ? "female" : "male")).map((item) => item.thumbnail);
        // setSampleModelPose(sampleModelPoseList);
    }

    useEffect(() => {
        showDemoModelData()
    }, [modelGender])


    // ---------------------------------------------------------------

    const sampleUploadedProducts = [
        {
            src: "https://media.licdn.com/dms/image/D5612AQFK6yhDh1BDQw/article-cover_image-shrink_720_1280/0/1696425254880?e=2147483647&v=beta&t=Aq90yI21shSomcdeobwyrWvTDgp9ivjMhOS7xebPIJw",
            alt: "red flower"
        },
        {
            src: "https://images.squarespace-cdn.com/content/v1/5b55b377b27e39707a59aed1/1596958731525-24MN2DIF8K5E034DX31W/shampoo-product-photography",
            alt: "yellow flower"
        },
        {
            src: "https://cdn.domestika.org/c_fit,dpr_auto,f_auto,q_80,t_base_params,w_820/v1630482027/content-items/008/978/435/HerbalEssences-original.jpg?1630482027",
            alt: "mixed flower"
        },
    ]

    useEffect(() => {
        localStorage.setItem("assetChoice", Model);
        setPrompt(localStorage.getItem("modelGeneratePrompt") || "");
        return (
            localStorage.setItem("assetChoice", Product)
        )
    }, [])

    //--------------- Search by Unsplash -----------------

    async function handleSearch(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setsearchKeyword(searchKeyword.trimEnd());
        if (!searchKeyword?.length) return toast.error("Please type any keyword to search")
        setSearchStatus(loading);

        try {
            //search by unsplash API
            const response = await getImagesbyUnsplash(searchKeyword + " " + `${assetChoice === Model ? modelGender + " " : ""}` + `${assetChoice}`);
            if (response) {
                const results = response.map((item: { urls: {}; }) => item.urls)
                setSearchResults(results);
                setSearchStatus(loaded);
            }

        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    //--------------- File Upload -----------------

    function handleModelFileUpload(type: string): void {

        Swal.fire({
            // title: "Gender",
            text: "Please select the gender of model",
            // icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#097CAD",
            cancelButtonColor: "#097CAD",
            confirmButtonText: "Men",
            cancelButtonText: "Woman",
        }).then((result: { isConfirmed: any; }) => {
            if (result.isConfirmed) {
                setModelGender(Men);
            } else {
                setModelGender(Women)
            }
        }).then(() => {

            const inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.accept = 'image/*';

            inputElement.addEventListener('change', (e: Event) => {
                const target = e.target as HTMLInputElement;
                const file = target.files?.[0];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const image = new Image();
                        image.src = e.target?.result?.toString()!;
                        image.onload = function () {
                            const maxRes = 3000;
                            if (image.width > maxRes || image.height > maxRes) {
                                toast.error("Upload a smaller image. Maximum resolution is 3000x3000.");
                            } else {
                                if (type === 'pose') dispatch(setModelPose(image?.src))
                                else dispatch(setModelFace(image?.src))
                            }
                        };
                    }
                    reader.readAsDataURL(file); // Read the file as a data URL
                }
            });
            inputElement.click(); // Trigger the click to open file dialog
        })
    }


    // -------------- Handle Generate Model Prompt API  -------------------------
    useEffect(() => {
        if (modelPose && modelStyle) handleGeneratePrompt();
    }, [modelPose, modelStyle])

    async function handleGeneratePrompt() {
        if (!modelPose) return
        if (!modelStyle?.length) return
        setSearchStatus(loading);  // set loading status spinner

        const response = await generateModelPromptAPI({
            init_image: modelPose!,
            style_selections: modelStyle,
        })
        // console.log("response =>", response) //test
        if (response?.data?.prompt) {
            setPrompt(response.data.prompt);
            dispatch(setModelGeneratePrompt(response.data.prompt));
            localStorage.setItem("modelGeneratePrompt", response.data.prompt);
        }
        setSearchStatus(null);  // Stop Loading spinner
    }

    //---------------- Harmonize API ----------------------------------------------------------------------------------------------

    async function handleGenerateModelWithProduct() {

        const layers = editor?.canvas?.getObjects();
        if (layers.length < 1) return toast.error("Please add atleast one product ");


        setSearchStatus(loading);  // set loading status spinner

        const init_image = editor?.canvas.toDataURL(); //exported canvas
        let mask_image: string;

        //----- Get Masked Image ---------
        const objects = editor?.canvas?.getObjects();
        if (objects && objects.length > 0) {
            const objectToHide = objects[0];
            objectToHide.visible = false;
            editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes (hide Bg)

            const dataUrl = editor?.canvas.toDataURL();
            mask_image = dataUrl;
            //Mask Image
            // console.log(dataUrl) //test

            objectToHide.visible = true;
            editor?.canvas?.requestRenderAll(); // Render the canvas to reflect the changes
        }

        const response = await modelStudioHarmonizeAPI({
            init_image,
            mask_image: mask_image,
        })
        // console.log("response =>", response) //test
        if (response?.data?.images) {
            editor.canvas.clear();  // clear previous images
            const image = response.data.images
            addBackground(image, editor);
            dispatch(setGeneratedImageSrc(image));
            dispatch(setGeneratedImagesList([image]))
        }
        setSearchStatus(null);  // Stop Loading spinner

    }

    //---------------------- Generate Model ----------------------------------------

    async function handleGenerateModel() {
        if (!modelFace) return toast.error("Please select any model face");
        if (!modelPose) return toast.error("Please select any model pose");
        if (!Prompt) return toast.error("Please generate or write a prompt");

        localStorage.setItem("modelGeneratePrompt", Prompt);
        dispatch(setLoading(loading));  // set loading status spinner

        const response = await modelStudioAPI({
            face_image: modelFace,
            pose_image: modelPose,
            prompt: Prompt,
            num_images: imageNumbers,
            refine: false,
        })
        // console.log("response =>", response) //test
        if (response?.data?.images) dispatch(setGeneratedModelsList(response.data.images));
        dispatch(setLoading(loaded));  // Stop Loading spinner
    }

    //---------------------- Expanded View Helper ----------------------------------------


    function viewMoreHelper(type: string): void {
        setExpandedModelType(type);
        if (type === "model_faces") {
            const viewMore = modelSamples.filter((item) => item.gender === (modelGender === Women ? "female" : "male") && item.type === "model_faces");
            const data = viewMore.map((item) => item.thumbnail);
            setSampleModels(data);
        }
        else if (!type) {
            const demoModelPosesList = demoModelPoses.filter((item) => item.gender === (modelGender === Women ? "female" : "male"))
            setSampleModelPose(demoModelPosesList)
        } else {
            const fullModelPosesList = modelPoses.filter((item) => item.gender === (modelGender === Women ? "female" : "male") && item.title === type)
            setSampleModelPose(fullModelPosesList)
        }
    }

    function viewMoreBackgroundsHelper(title: string): void {
        if (title !== "all") {
            const viewMore = fullBackgrounds.filter((bg) => bg.title === title);
            setIsBgExpandedView(title);
            setBackgroundsListPreview(viewMore);
        } else {
            setIsBgExpandedView(null);
            setBackgroundsListPreview(demoBackgrounds);
        }
    }

    //=========================================================================================================================================

    return (
        <div className="text-start">

            <div className="my-4 mt-6">

                {/* ========== Asset Choice =========== */}
                <div className="my-4 flex justify-evenly">
                    {location === modelStudio && <button className={assetChoice === Model ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 w-1/2 cursor-pointer"} onClick={() => { setAssetChoice(Model); localStorage.setItem("assetChoice", Model) }}>
                        <h5 className="text-[#344054] font-medium">{Model}</h5>
                    </button>}

                    <button className={assetChoice === Product ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 w-1/2 cursor-pointer"} onClick={() => { setAssetChoice(Product); localStorage.setItem("assetChoice", Product) }}>
                        <h5 className="text-[#344054] font-medium">{Product}</h5>
                    </button>

                    {location === productStudio && <button className={assetChoice === Background ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 w-1/2 cursor-pointer"} onClick={() => { setAssetChoice(Background); localStorage.setItem("assetChoice", Background) }}>
                        <h5 className="text-[#344054] font-medium">{Background}</h5>
                    </button>}
                </div>


                {/*=================== Search Bar ================= */}
                {assetChoice !== Model && <div className="my-5 flex items-center rounded-xl border border-gray-300 bg-white">
                    <span className="px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"  >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <form ref={formRef} onSubmit={handleSearch} className="w-full">
                        <input type="text" name="search" id="search" placeholder="Search by Unsplash"
                            className="py-1.5 px-2 rounded-xl focus:outline-none focus:bg-transparent w-full"
                            value={searchKeyword} onChange={(e) => setsearchKeyword(e.target.value)} />
                    </form>
                </div>}

                {/* loading spinner */}
                {searchStatus === loading &&
                    <div className="container-fluid">
                        <div className="flex w-full h-full items-center justify-center">
                            <div className="w-36">
                                <KrutLoader />
                            </div>
                        </div>
                    </div>
                }

                {/* ====== Search Results ========== */}
                {searchStatus === loaded &&
                    <>
                        <div className="flex justify-end mb-2">
                            <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer" onClick={() => { setSearchStatus(null); setsearchKeyword("") }} >clear</h5>
                        </div>

                        <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mb-10 overflow-y-scroll" style={{ maxHeight: "530px" }}>
                            {searchResults?.length && searchResults.map((image, index) => (
                                <div key={index} className="mx-auto mb-1 hover:shadow-lg image-container" onClick={() => {
                                    if (assetChoice === Product) addImage(image.regular, editor);
                                    else if (assetChoice === Background) addBackground(image.regular, editor)
                                }}>
                                    <img src={image?.thumb} alt={`${searchKeyword}-${index + 1}`} className="w-[92px] h-[92px]" loading="lazy" />
                                </div>
                            ))}
                        </div>

                    </>
                }

                {/* // ============ Upload Option ================== */}

                {!searchStatus &&
                    <>
                        {/* direct upload for background */}
                        {(assetChoice === Background) &&
                            <div className="h-[100px] bg-white flex items-center justify-center rounded-md border border-dashed border-gray-300">
                                {/* upload image section */}
                                <div className="flex-col">
                                    <h5 className="text-[#475467]">Upload files here</h5>
                                    <button className="w-full py-1.5  bg-violetBg my-2 text-white rounded-lg hover:bg-violetTxt cursor-pointer"
                                        onClick={() => uploadBackgroundImage(editor)}
                                    >Upload file <span className="text-white font-bold"> +</span></button>
                                </div>
                            </div>}

                        {/* if product upload image, show modal and give remove background option */}
                        {assetChoice === Product && <RemoveProductBgModal />}



                        {/* ------------------------ Product Assets section ------------------------------- */}
                        {assetChoice === Product &&
                            <>
                                <br />
                                <div className="h-[520px] overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mb-10">
                                        {sampleProducts?.length && sampleProducts.map((image, index) => (

                                            <div key={index} className="mx-auto mb-1 border hover:shadow-xl rounded-md" onClick={() => addImage(image.src, editor)}>
                                                <img src={image.thumbnail} alt={image.alt} className="rounded-md zoomEffect" loading="lazy"
                                                // draggable="true" onDragStart={(event) => handleDragStart(event)} 
                                                />
                                            </div>

                                        ))}
                                    </div>
                                </div>
                                <br />
                                {/* <h5 className="text-start font-medium my-3" >Uploaded Files</h5>
                                <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mt-4 mb-2">
                                    {sampleUploadedProducts?.length && sampleUploadedProducts.map((image, index) => (

                                        <div key={index} className="mx-auto mb-1 hover:shadow-lg">
                                            <img src={image.src} alt={image.alt} className="w-[92px] h-[92px] rounded" loading="lazy" />
                                        </div>

                                    ))}
                                </div> */}


                                {location === modelStudio && <>
                                    {/*Button visible if product asset selection in model studio */}
                                    <button className="w-full py-2 bg-violetBg my-10 rounded-lg zoomEffect hover:bg-violetTxt cursor-pointer"
                                        onClick={handleGenerateModelWithProduct}>
                                        <div className="text-white flex items-center justify-center">
                                            Harmonize
                                            <span className="ps-1">
                                                <img src={generateTool} alt="generate" />
                                            </span>
                                        </div>
                                    </button>

                                </>}

                                {/* {location === productStudio && <img src={adCreatorBanner} alt="Ad creator banner" className="rounded" loading="lazy" />} */}
                            </>
                        }

                        {/* ------------------------- Product Background section -------------------------- */}
                        {assetChoice === Background &&
                            <>
                                <br />
                                {backgroundsListPreview.map((item, index) => (
                                    <div key={index} >
                                        <div className="flex justify-between mb-0">
                                            <h5 className="text-start font-medium my-3" >{item.title}</h5>
                                            {isBgExpandedView !== item.title ? <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer"
                                                onClick={() => viewMoreBackgroundsHelper(item.title)} >View All</h5> :
                                                <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer"
                                                    onClick={() => {
                                                        viewMoreBackgroundsHelper("all");
                                                    }} >Back</h5>
                                            }
                                        </div>

                                        {isBgExpandedView === item.title ? <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 mb-4">
                                            {item?.images?.length && item.images.map((image, index) => (

                                                <div key={index} className="mx-auto mb-1 border hover:shadow-xl rounded-md image-container" onClick={() => addBackground(image.path, editor)}>
                                                    <img src={image.thumbnail} alt={image.name} className="zoomEffect rounded-md" loading="lazy"
                                                    // draggable="true" onDragStart={(event) => handleDragStart(event)} 
                                                    />
                                                </div>

                                            ))}
                                        </div> :

                                            <div className="flex overflow-x-auto ">
                                                {item?.images?.length && item.images.map((image, index) => (
                                                    <div key={index} className="mx-auto mb-1 me-[16px] rounded-md"
                                                        onClick={() => addBackground(image.path, editor)}>
                                                        <div className="h-24 w-24 overflow-hidden">
                                                            <img src={image.thumbnail} alt={image.name}
                                                                className="zoomEffect border hover:shadow-xl rounded-md w-full h-full object-cover object-top" loading="lazy" />
                                                        </div>
                                                    </div>

                                                ))}
                                                <div className="mx-auto mb-1 me-[16px] cursor-pointer" onClick={() => viewMoreBackgroundsHelper(item.title)} >
                                                    <div className="h-24 w-24 flex justify-center items-center border border-gray-300 rounded-md text-gray-500">View All</div>
                                                </div>

                                            </div>
                                        }
                                    </div>
                                ))}


                                {/* {!searchStatus && <>
                                    <div className="text-start">
                                        <div className="my-4 mt-2">
                                            <label htmlFor="Background" className="mb-2 text-[#475467]">Generate Background</label>
                                            <textarea name="Background" id="Background" placeholder="Write a prompt here"
                                                className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                                            // value={Background} onChange={(e) => setBackground(e.target.value.trimEnd())} 
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full py-2 bg-violetBg mt-3 rounded-lg zoomEffect hover:bg-violetTxt cursor-pointer">
                                        <div className="text-white flex items-center justify-center">
                                            Generate
                                            <span className="ps-1">
                                                <img src={generateTool} alt="generate" />
                                            </span>
                                        </div>
                                    </button>
                                </>} */}

                            </>
                        }

                        {/* ------------------------- Model section -------------------------- */}
                        {assetChoice === Model && <>

                            <div className="w-full">
                                <div className="flex justify-end">
                                    <button className={`border rounded rounded-r-none text-xs px-2 py-1.5 my-2 ${modelGender === Women ? "bg-highLightBg border-violetTxt text-violetTxt" : "bg-white cursor-pointer"}`}
                                        onClick={() => { setModelGender(Women); setExpandedModelType(null) }}>
                                        Women
                                    </button>

                                    <button className={`border rounded rounded-l-none text-xs px-2 py-1.5 my-2 ${modelGender === Men ? "bg-highLightBg border-violetTxt text-violetTxt" : "bg-white cursor-pointer"}`}
                                        onClick={() => { setModelGender(Men); setExpandedModelType(null) }}>
                                        Men
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between my-2">
                                <h5 className="text-start font-medium mt-3"> Model Face </h5>
                                {expandedModelType === "model_faces" ? <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer"
                                    onClick={() => {
                                        showDemoModelData();
                                        setExpandedModelType(null);
                                    }} >Back</h5> :
                                    <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer"
                                        onClick={() => viewMoreHelper("model_faces")} >View All</h5>
                                }
                            </div>

                            {/* ---------Model Face ----------- */}

                            {expandedModelType === "model_faces" ? <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mb-1">
                                {sampleModels?.length && sampleModels.map((image, index) => (

                                    <div key={index} className="mx-auto mb-1 hover:shadow-lg cursor-pointer image-container"
                                        onClick={async () => {
                                            try {
                                                const originalImage = image.split("/thumbnails");
                                                const data: string = await imgToBase64(originalImage[0] + originalImage[1]);
                                                dispatch(setModelFace(data));
                                            } catch (error) { console.error('Error occurred:', error); }
                                        }} >
                                        <img src={image} alt={`model ${index + 1}`} className="w-[92px] h-[92px] rounded zoomEffect" loading="lazy" />
                                    </div>

                                ))}
                            </div> :

                                <div className="flex overflow-x-auto ">
                                    {sampleModels?.length && sampleModels.map((image, index) => (
                                        <div key={index} className="mx-auto mb-1 me-[16px] rounded-md"
                                            onClick={async () => {
                                                try {
                                                    const originalImage = image.split("/thumbnails");
                                                    const data: string = await imgToBase64(originalImage[0] + originalImage[1]);
                                                    dispatch(setModelFace(data));
                                                } catch (error) { console.error('Error occurred:', error); }
                                            }} >
                                            <div className="h-24 w-24 overflow-hidden">
                                                <img src={image} alt={`model ${index + 1}`}
                                                    className="zoomEffect border hover:shadow-xl rounded-md w-full h-full object-cover object-top" loading="lazy" />
                                            </div>
                                        </div>

                                    ))}
                                    <div className="mx-auto mb-1 me-[16px] cursor-pointer" onClick={() => viewMoreHelper("model_faces")}>
                                        <div className="h-24 w-24 flex justify-center items-center border border-gray-300 rounded-md text-gray-500">View All</div>
                                    </div>

                                </div>
                            }

                            <div className="h-[50px]">
                                <button className="w-full px-2.5 py-1.5  bg-violetBg mb-2 text-white rounded-lg hover:bg-violetTxt cursor-pointer"
                                    onClick={() => handleModelFileUpload("face")}
                                > Upload Model Face<span className="text-white font-bold"> +</span></button>
                            </div>

                            <br /><hr />
                            {/* ---------Model Pose ----------- */}

                            <div className="flex justify-between my-2">
                                <h5 className="text-start font-medium my-3"> Model Pose </h5>
                            </div>


                            {sampleModelPose?.length && sampleModelPose.map((item, index) => (
                                <div key={index} >
                                    <div className="flex justify-between mb-2">
                                        <h5 className="text-start font-medium" >{item.title}</h5>
                                        {expandedModelType !== item.title ? <h5 className="text-start font-medium text-violetTxt cursor-pointer"
                                            onClick={() => viewMoreHelper(item.title)} >View All</h5> :
                                            <h5 className="text-start font-medium mb-3 text-violetTxt cursor-pointer"
                                                onClick={() => {
                                                    viewMoreHelper(null);
                                                }} >Back</h5>
                                        }
                                    </div>

                                    {expandedModelType === item.title ? <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 mb-4">
                                        {item?.images?.length && item.images.map((image, index) => (

                                            <div key={index} className="mx-auto mb-1 border hover:shadow-xl rounded-md image-container"
                                                onClick={async () => {
                                                    try {
                                                        const data: string = await imgToBase64(image.path);
                                                        dispatch(setModelPose(data));
                                                    } catch (error) { console.error('Error occurred:', error); }
                                                    setPrompt(image.prompt)
                                                }} >

                                                <img src={image.thumbnail} alt={image.name} className="zoomEffect rounded-md" loading="lazy"
                                                // draggable="true" onDragStart={(event) => handleDragStart(event)} 
                                                />
                                            </div>

                                        ))}
                                    </div> :

                                        <div className="flex overflow-x-auto ">
                                            {item?.images?.length && item.images.map((image, index) => (
                                                <div key={index} className="mx-auto mb-1 me-[16px] rounded-md"
                                                    onClick={async () => {
                                                        try {
                                                            const data: string = await imgToBase64(image.path);
                                                            dispatch(setModelPose(data));
                                                        } catch (error) { console.error('Error occurred:', error); }
                                                        setPrompt(image.prompt)
                                                    }} >
                                                    <div className="h-24 w-24 overflow-hidden">
                                                        <img src={image.thumbnail} alt={image.name}
                                                            className="zoomEffect border hover:shadow-xl rounded-md w-full h-full object-cover object-top" loading="lazy" />
                                                    </div>
                                                </div>

                                            ))}
                                            <div className="mx-auto mb-1 me-[16px] cursor-pointer" onClick={() => viewMoreHelper(item.title)}>
                                                <div className="h-24 w-24 flex justify-center items-center border border-gray-300 rounded-md text-gray-500">View All</div>
                                            </div>

                                        </div>
                                    }
                                </div>
                            ))
                            }

                            {/* <div className="h-[50px]">
                                <button className="w-full px-2.5 py-1.5  bg-violetBg mb-2 text-white rounded-lg hover:bg-violetTxt cursor-pointer"
                                    onClick={() => {
                                        handleModelFileUpload("pose");
                                    }}
                                > Upload Model Pose<span className="text-white font-bold"> +</span></button>
                            </div> */}

                            <br /><hr />

                            {/* <div className="my-4">
                                <label htmlFor="modelStyles" className="mb-1 text-[#475467]">Style</label>
                                <select id="modelStyles" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset
                                 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                                    onChange={(e) => setModelStyle(e.target.value)} value={modelStyle}>
                                    <option value="">Select any style</option>
                                    {modelStyles && modelStyles.length > 0 && modelStyles.map((item, index) => (
                                        <option key={index} value={item.name}>{item.style ? item.style : ""}</option>
                                    ))}
                                </select>

                            </div> */}


                            {/* prompt section */}

                            <div className="my-4">
                                <label htmlFor="Prompt" className="mb-1 text-[#475467]">Prompt</label>
                                <textarea name="Prompt" id="Prompt" placeholder="Prompt" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                                    value={Prompt} onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>


                            {/* slider */}
                            {/* <div className="my-6">
                                <div className="flex justify-between">
                                    <label htmlFor="imageNumbers" className="mb-1 text-[#475467]">Number of images</label>
                                    <h5 className="text-start font-medium mb-1 text-violetTxt"> {imageNumbers} </h5>
                                </div>
                                <input type="range" id="imageNumbers" name="imageNumbers" list="markers" min="1" max="2" className="w-full accent-violetBg border-gray-300 cursor-ew-resize"
                                    value={imageNumbers} onChange={(e) => setImageNumbers(e.target.value)} />
                            </div> */}


                            <button className="w-full py-2 bg-violetBg mt-5 rounded-lg zoomEffect hover:bg-violetTxt cursor-pointer"
                                onClick={handleGenerateModel}>
                                <div className="text-white flex items-center justify-center">
                                    Generate Model
                                    <span className="ps-1">
                                        <img src={generateTool} alt="generate" />
                                    </span>
                                </div>
                            </button>


                        </>}

                    </>}
            </div>
        </div>
    )
}

export default Assets;

//=========================================================================================================================================
