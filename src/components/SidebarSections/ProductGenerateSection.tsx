// @ts-ignore
import generateTool from "/icons/generate_tool_white.svg";
// import enhancePromptTool from "/icons/enhance_prompt_Tool.svg";
import { useEffect, useRef, useState } from "react";
import "../../assets/stylesheets/sidebar.css"
import { productStyles } from "../../assets/productStyles";
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateType } from "../../types/reduxTypes";
import { generateProductAPI } from "../../services/APIservice";
import toast from "react-hot-toast";
import { idle, loading } from "../../assets/defaultStrings";
import { setGeneratedImageSrc, setGeneratedImagesList } from "../../features/canvas/canvasSlice";
import KrutLoaderModal from "../KrutLoaderModal";

function GenerateSection() {
    const { uploadedImage, maskImage } = useSelector((state: ReduxStateType) => state?.canvas);
    const [imageNumbers, setImageNumbers] = useState(1);
    const [isStyleExpanded, setIsStyleExpanded] = useState(false);
    const [product, setProduct] = useState("");
    const [placement, setPlacement] = useState("");
    const [surrounding, setSurrounding] = useState("");
    const [background, setBackground] = useState("");
    const [prompt, setPrompt] = useState("");
    const [searchStatus, setSearchStatus] = useState(idle);
    const [harmonizer, setHarmonizer] = useState(true);
    const dispatch = useDispatch()
    const styleContainer = useRef<HTMLDivElement | null>(null);

    // ----------- Expand / Collapse Styles Images List  ---------------
    function collapseStyleList(): void {
        if (styleContainer.current) {
            styleContainer.current.scrollTop = 0;
        }
        setIsStyleExpanded(false);
    }

    // ---------------- Validate inputs ---------------------------
    function validateInputs() {
        setProduct(product.trim());
        setPlacement(placement.trim());
        setSurrounding(surrounding.trim());
        setBackground(background.trim());
        setPrompt(prompt.trim());
    }

    // -------------- Generate Prompt from Styles  -------------------------
    async function generatePromptHandler(style: string) {
        if (!product) return toast.error("Please add product details");
        if (!placement) return toast.error("Please add placement details");
        if (!background) return toast.error("Please add background details");

        // if (!uploadedImage) return toast.error("Please add image first");
        // if (!product || !placement || !surrounding || !background) return toast.error("Please fill all the fields");
        // setIsStyleExpanded(false);
        // setSearchStatus(loading);
        // const response = await generateProductPromptAPI({
        //     init_image: uploadedImage,
        //     product, placement, surrounding, background,
        //     style_selections: style
        // })
        // // console.log("response =>", response) //test
        // setSearchStatus(idle);
        // if (response?.data?.prompt) setPrompt(response.data.prompt);

        const promptData = productStyles.filter((item) => item.style === style);
        const promptSplitData = promptData[0].prompt.split("${prompt}"); //replace with ${prompt}
        const backgroundString = background.toLowerCase().includes("background") ? background : `${background} background` //check if user given background already
        const prompt = `${promptSplitData[0] ? promptSplitData[0] : ""}a ${product} placed on ${placement}${surrounding ? `, surrounded by ${surrounding}` : ""}, ${backgroundString} ${promptSplitData[1] ? promptSplitData[1] : ""}`;
        setPrompt(prompt.toLowerCase());
    }

    useEffect(() => {
        if (!product || !placement || !background) {
            setPrompt("");
            return
        };
        localStorage.setItem("productGenerateFormData", JSON.stringify({ product, placement, surrounding, background, prompt }));
        generatePromptHandler("Sharp Photograph");
    }, [product, placement, surrounding, background])


    // -------------- Generate Product Models  -------------------------
    async function generateProductImagesHelper() {
        if (!uploadedImage) return toast.error("Please add image first");
        validateInputs();
        if (!prompt) return toast.error("Please enter prompt or select any style");
        if (!maskImage) return toast.error("Please add atleast 2 layers to continue");
        //save the formData to local Storage
        localStorage.setItem("productGenerateFormData", JSON.stringify({ product, placement, surrounding, background, prompt }));

        setSearchStatus(loading);
        dispatch(setGeneratedImagesList(null));
        const response = await generateProductAPI({
            init_image: uploadedImage,
            mask_image: maskImage,
            prompt,
            num_images: imageNumbers,
            image_harmonizer: harmonizer
        })
        console.log("response =>", response) //test
        if (response?.data?.images){ 
            dispatch(setGeneratedImagesList(response.data.images));
            dispatch(setGeneratedImageSrc(response.data.images[0]));
        }
        setSearchStatus(idle);
    }

    useEffect(() => {
        const formData = JSON.parse(localStorage.getItem("productGenerateFormData"));
        setProduct(formData?.product || "");
        setPlacement(formData?.placement || "");
        setSurrounding(formData?.surrounding || "");
        setBackground(formData?.background || "");
        setPrompt(formData?.prompt || "");
    }, []);


    //================================================================================================================================================
    return (
        <div className="text-start">

            <div className="my-4 mt-8">
                <label htmlFor="product" className="mb-1 text-[#475467]">Product</label>
                <input name="product" id="product" type="text" placeholder="Write product type" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                    value={product} onChange={(e) => setProduct(e.target.value)}
                />
            </div>

            <div className="my-4 mt-2">
                <label htmlFor="placement" className="mb-1 text-[#475467]">Placement</label>
                <input name="placement" id="placement" type="text" placeholder="Write the product position" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                    value={placement} onChange={(e) => setPlacement(e.target.value)}
                />
            </div>

            {/* <div className="my-4 mt-2">
                <label htmlFor="surrounding" className="mb-1 text-[#475467]">Surrounding</label>
                <input name="surrounding" id="surrounding" type="text" placeholder="Write the product surrounded by" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                    value={surrounding} onChange={(e) => setSurrounding(e.target.value)}
                />
            </div> */}

            <div className="my-4 mt-2">
                <label htmlFor="Background" className="mb-1 text-[#475467]">Background</label>
                <input name="Background" id="Background" type="text" placeholder="Describe background" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                    value={background} onChange={(e) => setBackground(e.target.value)}
                />
            </div>

            {/* Styles sample images list */}
            {/* <div className="flex justify-between mb-2">
                <h5 className="text-start font-medium my-3" >Styles</h5>
                <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer" onClick={() => isStyleExpanded ? collapseStyleList() : setIsStyleExpanded(true)}>
                    {isStyleExpanded ? "Collapse" : "View All"}
                </h5>
            </div>

            <div ref={styleContainer} className={`grid grid-cols-2 gap-[3%] md:grid-cols-3 mb-6 mt-3 ${isStyleExpanded ? "overflow-y-scroll" : "overflow-hidden"}`} style={{ maxHeight: isStyleExpanded ? "530px" : "285px" }}>
                {productStyles?.length && productStyles.map((image, index) => (
                    <div key={index} className=" mx-auto mb-1 hover:shadow-lg bg-white rounded" onClick={() => { generatePromptHandler(image?.style); toast.success("new style applied") }}>
                        <div className="image-container rounded rounded-b-none">
                            <img src={image?.path} alt={image?.style} className="cursor-pointer zoomEffect" loading="lazy" />
                        </div>
                        <div className=" w-[92px] h-[40px] px-2 py-1 bottom-0 text-center overflow-hidden">
                            {image?.style}
                        </div>
                    </div>
                ))}
            </div> */}



            {/* loading spinner */}
            {searchStatus === loading && <KrutLoaderModal isLoading={searchStatus} />}

            {searchStatus === idle &&
                <div className="my-4 mt-2">
                    <label htmlFor="Prompt" className="mb-1 text-[#475467]">Edit Prompt</label>
                    <textarea name="Prompt" id="Prompt" placeholder="Prompt" className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
                        value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    />
                </div>}

            {/* <button className="w-full py-1.5 bg-gray-300 mt-1 rounded-lg hover:bg-slate-300 cursor-pointer">
                <div className="text-[#344054] flex items-center justify-center">
                    <h5 className="font-normal">Enhance prompt</h5>
                    <span className="ps-2">
                        <img src={enhancePromptTool} alt="enhance prompt" />
                    </span>
                </div>
            </button> */}

            <div className="my-6">
                <div className="flex justify-between">
                    <label htmlFor="imageNumbers" className="mb-1 text-[#475467]">Number of images</label>
                    <h5 className="text-start font-medium mb-1 text-violetTxt"> {imageNumbers} </h5>
                </div>
                {/* slider */}
                <input type="range" id="imageNumbers" name="imageNumbers" list="markers" min="1" max="2" className="w-full accent-violetBg border-gray-300 cursor-ew-resize"
                    value={imageNumbers} onChange={(e) => setImageNumbers(parseInt(e.target.value))} />
                {/* <datalist id="markers">
                    <option value="1"></option>
                    <option value="2"></option>
                    <option value="3"></option>
                    <option value="4"></option>
                    <option value="5"></option>
                </datalist> */}
                {/* <div className={`bg-white clippedPath border ms-[${71 * (imageNumbers - 1)}px]`} >
                    {imageNumbers}
                </div> */}
            </div>

            <div className="my-4 mt-2 flex items-center">
                <input type="checkbox" id="harmonizer" name="harmonizer" className="form-checkbox h-5 w-5 border-gray-300 rounded accent-violetBg"
                    checked={harmonizer} onChange={(e) => setHarmonizer(e.target.checked)} />
                <label htmlFor="harmonizer" className="ml-2 text-[#475467]">Enable Harmonizer</label>
            </div>


            <button className="w-full py-2 bg-violetBg mt-3 mb-10 rounded-lg zoomEffect hover:bg-violetTxt cursor-pointer"
                onClick={() => generateProductImagesHelper()} >
                <div className="text-white flex items-center justify-center">
                    Generate
                    <span className="ps-1">
                        <img src={generateTool} alt="generate" />
                    </span>
                </div>
            </button>

        </div>
    )
}

export default GenerateSection

//================================================================================================================================================
