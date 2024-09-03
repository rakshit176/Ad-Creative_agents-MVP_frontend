// @ts-ignore
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateType } from "../../types/reduxTypes";
import { setAdCreativeImport, setGeneratedImageSrc, setGeneratedImagesList } from "../../features/canvas/canvasSlice";
import { useNavigate } from "react-router-dom";

// const generatedSampleImages = [
//     "https://media.ed.edmunds-media.com/gmc/terrain/2022/oem/2022_gmc_terrain_4dr-suv_at4_fq_oem_1_1280.jpg",
//     "https://storage.googleapis.com/pod_public/1300/176344.jpg",
//     "https://lp-auto-assets.s3.amazonaws.com/24/gmc/terrain/m3/header.jpg",
//     "https://di-uploads-pod35.dealerinspire.com/toddwenzelbuickgmcofwestland/uploads/2022/05/Terrain-Hero.jpg",
// ]

function GeneratorCanvas() {
    const { generatedImageList, uploadedImage, activeToolName } = useSelector((state: ReduxStateType) => state?.canvas);
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [displayImage, setDisplayImage] = useState(uploadedImage ? uploadedImage : "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg");
    const [generatedImages, setgeneratedImages] = useState<string[] | null>(null);
    // const [displayImage, setDisplayImage] = useState(generatedSampleImages[0]); //test
    // const [generatedImages, setgeneratedImages] = useState<string[] | null>(generatedSampleImages);  //test
    const [selectedImage, setselectedImage] = useState(generatedImages?.length ? generatedImages[0] : null);

    useEffect(() => {
        if (generatedImageList) {
            setgeneratedImages(generatedImageList);
            setselectedImage(generatedImageList?.[0]);
        }
    }, [generatedImageList])


    function scroll(scrollOffset: number) {
        const container = document.querySelector('.overflow-x-scroll');
        if (container) { container.scrollLeft += scrollOffset }
    }

    useEffect(() => {
        if (uploadedImage && activeToolName === "Generate") {
            setDisplayImage(uploadedImage);   //if there is an uploaded Image display it on the canvas
            dispatch(setGeneratedImagesList(null));
        }
    }, [uploadedImage])

    function handleSelectedGeneratedImage(image: string): void {
        setselectedImage(image);
        dispatch(setGeneratedImageSrc(image));
    }

    return (
        <>
            <div className={`container-fluid w-[78vw] bg-canvasBg overflow-y-auto`}>
                <div className={`  ${generatedImages?.length ? "h-[86vh]" : "h-[94vh]"} flex justify-evenly items-center py-10`}>


                    {/* Raw image  */}
                    <div className={`max-w-[45%] mb-10`}>
                        <img src={displayImage} alt="raw image" className={`rounded-xl shadow-md border border-gray-300
                        ${generatedImages?.length ? "max-h-[50vh]" : "max-h-[80vh]"}`} />
                        <div className="text-transparent h-[10px] mb-10">
                            -
                        </div>
                    </div>


                    {/* generated image */}
                    {generatedImages && <div className={`max-w-[45%] mb-10`}>

                        {/* Move to ad creative button  */}
                        <div className="w-full flex justify-end">
                            <button className="relative -mt-10 mb-3 bg-violetBg px-5 py-2.5 font-bold text-white rounded-xl border cursor-pointer"
                                onClick={() => {
                                    dispatch(setAdCreativeImport(selectedImage));
                                    Navigate('/adCreative');
                                }}>
                                Move to Ad creative
                            </button>
                        </div>

                        <img src={selectedImage!} alt="Generated Image Preview" className={`rounded-xl shadow-md border-gray-300 mx-auto
                         ${generatedImages?.length ? "max-h-[50vh]" : "max-h-[80vh]"}`} />


                        <div className="h-[10px]">
                            {/* Generated Images List */}
                            {generatedImages &&
                                <div className="flex justify-center items-center mx-[5%] mt-10">
                                    <div className={`w-[100%] relative`}>
                                        {/* previous button */}
                                        {generatedImages?.length > 3 && <div className="absolute top-[50%] -left-[10%] -translate-y-1/2 px-2">
                                            <button className="bg-violetBg opacity-50 hover:opacity-100 p-1 rounded-full flex items-center" onClick={() => scroll(-400)}>
                                                <span className="material-symbols-outlined text-white rotate-180"> navigate_next </span>
                                            </button>
                                        </div>}

                                        {/* generated images list */}
                                        <div className="flex overflow-x-scroll space-x-4 mt-5 h-[150px]">
                                            {generatedImages && generatedImages.map((image, index) => (
                                                <div key={index} className="image-container">
                                                    <img src={image} alt={`Generated Image ${index + 1}`} className=" border rounded-xl shadow-md border-gray-300 cursor-pointer"
                                                        onClick={() => handleSelectedGeneratedImage(image)} />
                                                </div>
                                            ))}

                                        </div>

                                        {/* next button */}
                                        {generatedImages?.length > 3 && <div className="absolute top-[50%] -right-[10%] -translate-y-1/2 px-2">
                                            <button className="bg-violetBg opacity-50 hover:opacity-100 p-1 rounded-full flex items-center" onClick={() => scroll(400)}>
                                                <span className="material-symbols-outlined text-white"> navigate_next </span>
                                            </button>
                                        </div>}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>}

                </div>



            </div>
        </>
    )
}

export default GeneratorCanvas