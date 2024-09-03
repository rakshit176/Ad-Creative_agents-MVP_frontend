// @ts-ignore
// @ts-nocheck
import { useDispatch, useSelector } from "react-redux";
// import adCreatorBanner from "/images/Ad-creator-banner.jpg"
import { setOutpaintedImage, setRatio } from "../../features/canvas/canvasSlice";
import { addImage, handleDragStart, uploadImage } from "../../services/canvasMethods";
import { ReduxStateType } from "../../types/reduxTypes";
import CustomSize from "./CustomSize";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { outpaintImageAPI } from "../../services/APIservice";
import { loading, modelStudio, productStudio } from "../../assets/defaultStrings";
import KrutLoaderModal from "../KrutLoaderModal";

// const uploadedImages = ["https://images.squarespace-cdn.com/content/v1/5b55b377b27e39707a59aed1/1596958731525-24MN2DIF8K5E034DX31W/shampoo-product-photography",
//     "https://media.licdn.com/dms/image/D5612AQFK6yhDh1BDQw/article-cover_image-shrink_720_1280/0/1696425254880?e=2147483647&v=beta&t=Aq90yI21shSomcdeobwyrWvTDgp9ivjMhOS7xebPIJw",
//     "https://cdn.domestika.org/c_fit,dpr_auto,f_auto,q_80,t_base_params,w_820/v1630482027/content-items/008/978/435/HerbalEssences-original.jpg?1630482027",
// ]

function OutPaint() {
    const dispatch = useDispatch()
    const { editor } = useSelector((state: ReduxStateType) => state.canvas)
    const generatedImagesList = useSelector((state: ReduxStateType) => state.canvas.generatedImageList);
    const { aspect_ratio, generatedModelsList } = useSelector((state: ReduxStateType) => state.canvas);
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null); //test
    const [prompt, setPrompt] = useState<string>("");
    const [searchStatus, setSearchStatus] = useState<null | string>(null);

    useEffect(() => {
        dispatch(setRatio("1024:1024")); //reset to 1:1 aspect ratio
        return () => {
            dispatch(setRatio("1024:1024")); //reset to 1:1 aspect ratio
        }
    }, [])


    useEffect(() => {
        if (window.location.href.includes(modelStudio) && generatedModelsList?.length) {
            setGeneratedImages(generatedModelsList)
        } else if (window.location.href.includes(productStudio) && generatedImagesList?.length) {
            setGeneratedImages(generatedImagesList)
        }
    }, [generatedImagesList, generatedModelsList]);


    function handleFileUpload(): void {
        uploadImage(editor);
    }

    function outPaintHelper(aspect_ratio: string) {
        //outpaint API call, set redux uploadedImage
        dispatch(setRatio(aspect_ratio));
    }

    async function outpaintImageHelper() {
        const layers = editor?.canvas?.getObjects();
        if (layers.length > 1) return toast.error("Please select only one image");
        if (editor?.canvas) {

            const dimensionsString = aspect_ratio;
            const dimensionsArray = dimensionsString.split(":");
            const width = parseInt(dimensionsArray[0]);
            const height = parseInt(dimensionsArray[1]);

            const init_image: string = editor.canvas.toDataURL(); // Ensure init_image is of type string
            const image_width: number = (layers[0]?.aCoords?.br?.x - layers[0]?.aCoords?.bl?.x) || 0; // Ensure image_width is of type number
            const image_height: number = (layers[0]?.aCoords?.bl?.y - layers[0]?.aCoords?.tl?.y) || 0; // Ensure image_height is of type number
            const canvas_width: number = editor.canvas.width || 0 // Ensure canvas_width is of type number
            const canvas_height: number = editor.canvas.height || 0 // Ensure canvas_height is of type number
            const leftIndex: number = parseInt(layers[0]?.aCoords?.tl?.x || "0") * (-1); // Ensure leftIndex is of type number
            const topIndex: number = parseInt(layers[0]?.aCoords?.tl?.y || "0") * (-1); // Ensure topIndex is of type number
            const rightIndex: number = (canvas_width ?? 0) - (layers[0]?.aCoords?.tr?.x || 0); // Ensure rightIndex is of type number
            const bottomIndex: number = (canvas_height ?? 0) - (layers[0]?.aCoords?.br?.y || 0); // Ensure bottomIndex is of type number

            setSearchStatus(loading);
            try {
                const response = await outpaintImageAPI({
                    init_image,
                    prompt,
                    image_width: image_width.toString(),
                    image_height: image_height.toString(),
                    image_x_l: leftIndex.toString(),
                    image_y_t: topIndex.toString(),
                    image_x_r: rightIndex.toString(),
                    image_y_b: bottomIndex.toString(),
                    canvas_width: width,
                    canvas_height: height,
                });

                setSearchStatus(null);
                if (response?.data?.images) {
                    dispatch(setOutpaintedImage(response.data.images));
                }
            } catch (error) {
                console.error("Error:", error);
                setSearchStatus(null);
            }
        }
    }


    return (
        <div className="text-start gap-[24px]">

            <div className="my-8">

                <p className="text-sm my-1 text-[#475467]">Select the frame</p>

                <div className="flex justify-between my-4 gap-[9px] mb-8">

                    <div className="flex flex-col text-center" onClick={() => { outPaintHelper("1024:1024") }}>
                        <button className="py-1.5 bg-white mt-1 rounded border hover:border-violetBg hover:shadow-lg cursor-pointer w-[53px] h-[53px] flex justify-center items-center">
                            <div className="w-[21px] h-[21px] border border-dashed bg-highLightBg border-violetTxt"></div>
                        </button>
                        <p className="text-xs mt-2">1:1</p>
                    </div>

                    <div className="flex flex-col text-center" onClick={() => { outPaintHelper("1024:768") }}>
                        <button className="py-1.5 bg-white mt-1 rounded border hover:border-violetBg hover:shadow-lg cursor-pointer w-[53px] h-[53px] flex justify-center items-center">
                            <div className="w-[24px] h-[17px] border border-dashed bg-highLightBg border-violetTxt"></div>
                        </button>
                        <p className="text-xs mt-2">4:3</p>
                    </div>

                    <div className="flex flex-col text-center" onClick={() => { outPaintHelper("768:1024") }}>
                        <button className="py-1.5 bg-white mt-1 rounded border hover:border-violetBg hover:shadow-lg cursor-pointer w-[53px] h-[53px] flex justify-center items-center">
                            <div className="w-[17px] h-[23px] border border-dashed bg-highLightBg border-violetTxt"></div>
                        </button>
                        <p className="text-xs mt-2">3:4</p>
                    </div>

                    <div className="flex flex-col text-center" onClick={() => { outPaintHelper("1280:720") }}>
                        <button className="py-1.5 bg-white mt-1 rounded border hover:border-violetBg hover:shadow-lg cursor-pointer w-[53px] h-[53px] flex justify-center items-center">
                            <div className="w-[32px] h-[18px] border border-dashed bg-highLightBg border-violetTxt"></div>
                        </button>
                        <p className="text-xs mt-2">16:9</p>
                    </div>

                    <div className="flex flex-col text-center" onClick={() => { outPaintHelper("720:1280") }}>
                        <button className="py-1.5 bg-white mt-1 rounded border hover:border-violetBg hover:shadow-lg cursor-pointer w-[53px] h-[53px] flex justify-center items-center">
                            <div className="w-[18px] h-[32px] border border-dashed bg-highLightBg border-violetTxt"></div>
                        </button>
                        <p className="text-xs mt-2">9:16</p>
                    </div>

                </div>

                {/* custom size section */}
                <CustomSize />
                <br />

                {/* <button type="submit" className="w-full py-1.5 mb-4 bg-violetBg my-2 text-white rounded-lg hover:bg-violetTxt" onClick={handleFileUpload}>Upload Image
                    <span className="text-white font-bold"> +</span></button> */}

                <br />
                {/* upload image section */}
                <div className="h-[100px] bg-white flex items-center justify-center rounded-md border border-dashed border-gray-300">
                    <div className="flex-col">
                        <h5 className="text-[#475467]">Upload files here</h5>
                        <button className="w-full py-1.5  bg-violetBg my-2 text-white rounded-lg hover:bg-violetTxt"
                            onClick={handleFileUpload}
                        >Upload file <span className="text-white font-bold"> +</span></button>
                    </div>
                </div>

                <br />

                {generatedImages && <>
                    <h5 className="text-start font-medium my-3" >Generated Images</h5>
                    <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mt-4 mb-2">
                        {generatedImages?.length && generatedImages.map((image, index) => (

                            <div key={index} className="mx-auto mb-1 hover:shadow-lg">
                                <img src={image} alt={`Generated Image ${index + 1}`} className="w-[92px] h-[92px] rounded"
                                    onClick={() => {
                                        if (editor?.canvas) {
                                            editor?.canvas.clear(); // Remove all objects from the canvas
                                            editor?.canvas.requestRenderAll(); // Render the canvas after clearing
                                        }
                                        addImage(image, editor);
                                    }}
                                // draggable="true" onDragStart={(event) => handleDragStart(event)}
                                />
                            </div>

                        ))}
                    </div>
                </>}

                {/* <div className="my-4 mt-10">
                    <p className="text-sm font-medium my-1 text-[#475467]">Write a prompt for outpaint</p>

                    <textarea name="Prompt" id="Prompt" placeholder="Lorem ipsum dolor sit amet....."
                        className="block w-full ps-2 rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset
                     ring-gray-300 placeholder:text-gray-400 placeholder:text-xs focus:ring-2 focus:ring-inset sm:leading-6 my-2"
                        value={prompt} onChange={(e) => {
                            setPrompt(e.target.value)
                        }}
                        onClick={() => {
                            if (editor?.canvas?.getActiveObjects()?.length) {
                                editor?.canvas?.discardActiveObject();
                                editor?.canvas?.requestRenderAll();
                            }
                        }} />
                </div> */}

                <button className="w-full py-2 bg-violetBg my-3 text-white rounded-lg zoomEffect hover:bg-violetTxt"
                    onClick={() => outpaintImageHelper()}>Auto Fill</button>

            </div>

            {/* loading spinner */}
            {searchStatus === loading && <KrutLoaderModal isLoading={searchStatus} />}
        </div>
    )
}

export default OutPaint