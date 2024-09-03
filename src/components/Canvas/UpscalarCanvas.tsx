import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from '../../types/reduxTypes';
import { useEffect, useState } from 'react';
import { setLoading } from '../../features/canvas/canvasSlice';
import "../../assets/stylesheets/spinnerLoader.css"
import { idle, loaded } from '../../assets/defaultStrings';
import ComparisonSlider from '../ComparisonSlider';
import KrutLoaderModal from '../KrutLoaderModal';

function UpscalarCanvas() {
    const loaderStatus = useSelector((state: ReduxStateType) => state?.canvas?.isLoadingState);
    const [displayImage, setDisplayImage] = useState("https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg");
    const [isLoading, setIsLoading] = useState(loaderStatus);
    const [inputImage, setInputImage] = useState<null | string>(null);
    const [upscaledImage, setUpscaledImage] = useState<null | string>(null);
    const dispatch = useDispatch();
    const generatedUpscaledImage = useSelector((state: ReduxStateType) => state?.canvas?.upscaledImage)
    const { uploadedImage } = useSelector((state: ReduxStateType) => state.canvas)  //get image data from Redux

    useEffect(() => {
            setDisplayImage(uploadedImage);   //if there is an uploaded Image display it on the canvas
            setInputImage(uploadedImage);
            setUpscaledImage(null);
    }, [uploadedImage])

    useEffect(() => {
        if (generatedUpscaledImage) {
            setUpscaledImage(generatedUpscaledImage);
        }
    }, [generatedUpscaledImage])

    useEffect(() => {
        return () => {
            dispatch(setLoading(idle)); // set loading status back to idle;
        }
    }, []);

    useEffect(() => {
        setIsLoading(loaderStatus);
    }, [loaderStatus])

    return (

        <div className={`container-fluid w-[78vw] bg-canvasBg`}>
            <div className="">
                <div className="h-[90vh] flex justify-center items-center">


                    {(isLoading === idle && inputImage) &&
                        <div className={`max-w-[50%] max-h-[85vh] m-4 container-fluid`}>
                            <img src={displayImage} alt="raw image" className="border shadow-md border-gray-300 rounded-xl max-h-[85vh]" />
                        </div>
                    }

                    {/* loading spinner */}
                    <KrutLoaderModal isLoading={isLoading} />

                    <div className={`max-w-[80%]`}>
                        <div className='max-h-[85vh]' style={{ flexGrow: 1 }}>
                            {isLoading === loaded &&
                                <ComparisonSlider beforeImage={inputImage!} afterImage={upscaledImage!} />
                            }

                        </div>
                    </div>



                </div>
            </div>
        </div>

    );
}

export default UpscalarCanvas;
