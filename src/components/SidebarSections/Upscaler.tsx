import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUploadImageSrc, setUpscaledImage } from "../../features/canvas/canvasSlice";
import { detailed, idle, loaded, loading, modelStudio, productStudio, smooth } from "../../assets/defaultStrings";
import { ReduxStateType } from "../../types/reduxTypes";
import { upscaleImageAPI } from "../../services/APIservice";

// const uploadedImages = ["https://images.squarespace-cdn.com/content/v1/5b55b377b27e39707a59aed1/1596958731525-24MN2DIF8K5E034DX31W/shampoo-product-photography",
//     "https://media.licdn.com/dms/image/D5612AQFK6yhDh1BDQw/article-cover_image-shrink_720_1280/0/1696425254880?e=2147483647&v=beta&t=Aq90yI21shSomcdeobwyrWvTDgp9ivjMhOS7xebPIJw",
//     "https://cdn.domestika.org/c_fit,dpr_auto,f_auto,q_80,t_base_params,w_820/v1630482027/content-items/008/978/435/HerbalEssences-original.jpg?1630482027",
// ]

function Upscaler() {
    const [upscaleType, setUpscaleType] = useState(detailed);
    const [upscaleRatio, setUpscaleRatio] = useState("2");
    const dispatch = useDispatch();
    const { uploadedImage } = useSelector((state: ReduxStateType) => state.canvas);
    // const generatedImagesList = useSelector((state: ReduxStateType) => state.canvas.generatedImageList);
    // const [generatedImages, setGeneratedImages] = useState<string[] | null>(null); //test


    //-------------- Reset loading status in redux --------------

    useEffect(() => {
        dispatch(setLoading(idle));
        // dispatch(setUploadImageSrc(null)); //test
        return () => {
            dispatch(setLoading(idle));
        }
    }, []);

    // useEffect(() => {
    //     if (window.location.href.includes(modelStudio) && generatedModelsList?.length) {
    //         setGeneratedImages(generatedModelsList)
    //     } else if (window.location.href.includes(productStudio) && generatedImagesList?.length) {
    //         setGeneratedImages(generatedImagesList)
    //     }
    // }, [generatedImagesList, generatedModelsList]);

    // -------------- Handle Upscale API  -------------------------
    async function handleUpscale() {
        if (!upscaleType) return toast.error("Please select an upscle type");
        if (!uploadedImage) return toast.error("Please upload an image");

        dispatch(setLoading(loading));  // set loading status in redux
        const response = await upscaleImageAPI({
            init_image: uploadedImage,
            upscale_type: upscaleType,
            scale: upscaleRatio,
        })
        // console.log("response =>", response) //test
        if (response?.data?.images) {
            dispatch(setUpscaledImage(response.data.images));
            dispatch(setLoading(loaded));  // set loading status in redux
        } else {
            dispatch(setLoading(idle));  // set loading status in redux
        }
    }

    // -------------- Upload Files by User  -------------------------
    function handleFileUpload(): void {
        dispatch(setLoading(idle))
        const inputElement = document.createElement('input');
        inputElement.type = 'file';
        inputElement.accept = 'image/*';

        inputElement.addEventListener('change', (e: any) => {
            const file = e?.target?.files[0];
            if (!file) return;

            const reader = new FileReader();

            reader.onload = (event: any) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = function () {
                    const maxRes = 3000;
                    if (img.width > maxRes || img.height > maxRes) {
                        toast.error("Upload a smaller image. Maximum resolution is 3000x3000.");
                    } else {
                        const imageUrl = event.target.result;
                        dispatch(setUploadImageSrc(imageUrl)); // Dispatch action to update Redux store
                    }
                };
            };
            reader.readAsDataURL(file);
        });
        inputElement.click();
    }

    //================================================================================================================================================

    return (
        <div className="text-start">

            <div className="my-4 mt-6">
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

                <p className="text-sm my-1 text-[#475467]">Select the Quality</p>

                <div className="flex justify-between my-4">
                    <button className={`border rounded py-1.5 mt-1 w-1/2 mx-1 ${upscaleType === detailed ? "bg-highLightBg border-violetTxt" :
                        "bg-white cursor-pointer hover:border-gray-400 hover:shadow-lg"}`} >
                        <p className="text-xs mb-0" onClick={() => setUpscaleType(detailed)}>Detailed</p>
                    </button>

                    <button className={`border rounded py-1.5 mt-1 w-1/2 mx-1 ${upscaleType === smooth ? "bg-highLightBg border-violetTxt" :
                        "bg-white cursor-pointer hover:border-gray-400 hover:shadow-lg"}`}>
                        <p className="text-xs mb-0" onClick={() => setUpscaleType(smooth)}>Smooth</p>
                    </button>
                </div>

                <div className="flex justify-between my-4">
                    <button className={`border rounded py-1.5 mt-1 w-1/2 mx-1 ${upscaleRatio === "2" ? "bg-highLightBg border-violetTxt" :
                        "bg-white cursor-pointer hover:border-gray-400 hover:shadow-lg"}`}>
                        <p className="text-xs mb-0" onClick={() => setUpscaleRatio("2")}>2X</p>
                    </button>

                    <button className={`border rounded py-1.5 mt-1 w-1/2 mx-1 ${upscaleRatio === "4" ? "bg-highLightBg border-violetTxt" :
                        "bg-white cursor-pointer hover:border-gray-400 hover:shadow-lg"}`}>
                        <p className="text-xs mb-0" onClick={() => setUpscaleRatio("4")}>4X</p>
                    </button>
                </div>

                {/* {generatedImages && <>
                <br />
                    <h5 className="text-start font-medium my-3" >Generated Images</h5>
                    <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mt-4 mb-2">
                        {generatedImages?.length && generatedImages.map((image, index) => (

                            <div key={index} className="mx-auto mb-1 hover:shadow-lg">
                                <img src={image} alt={`Generated Image ${index + 1}`} className="w-[92px] h-[92px] rounded"
                                    onClick={() => dispatch(setUploadImageSrc(image))}
                                />
                            </div>

                        ))}
                    </div>
                </>} */}

                <button className="w-full py-2 bg-violetBg my-3 text-white rounded-lg zoomEffect hover:bg-violetTxt"
                    onClick={handleUpscale}>Upscale</button>

            </div>
        </div>
    )
}

export default Upscaler

//================================================================================================================================================
