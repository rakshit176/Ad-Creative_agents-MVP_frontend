// @ts-ignore
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from '../../types/reduxTypes';
import { useEffect, useState } from 'react';
import { setLoading } from '../../features/canvas/canvasSlice';
import "../../assets/stylesheets/spinnerLoader.css"
import { idle, loaded } from '../../assets/defaultStrings';
import ComparisonSlider from '../ComparisonSlider';
import KrutLoaderModal from '../KrutLoaderModal';

function BackgroundRemoverCanvas() {
    const loaderStatus = useSelector((state: ReduxStateType) => state?.canvas?.isLoadingState);
    const { bgRemovedImage } = useSelector((state: ReduxStateType) => state?.canvas);
    const [displayImage, setDisplayImage] = useState("https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg");
    const [isLoading, setIsLoading] = useState(loaderStatus);
    const [inputImage, setInputImage] = useState<null | string>(null);
    const [processedImage, setProcessedImage] = useState<null | string>(null);
    const uploadedImageData = useSelector((state: ReduxStateType) => state.canvas)  //get image data from Redux
    const dispatch = useDispatch();

    useEffect(() => {
        const uploadedImage = uploadedImageData?.uploadedImage
            setDisplayImage(uploadedImage);    //if there is an uploaded Image display it on the canvas
            setInputImage(uploadedImage);      // for loader
            setProcessedImage(null);           // reset processed image
    }, [uploadedImageData])


    useEffect(() => {
        setProcessedImage(bgRemovedImage);
    }, [bgRemovedImage])


    useEffect(() => {
        return () => {
            dispatch(setLoading(idle)); // set loading status back to idle;
        }
    }, []);

    useEffect(() => {
        setIsLoading(loaderStatus);
    }, [loaderStatus]);

    //================================================================================================================================================

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
                            {(isLoading === loaded && processedImage) &&
                                <ComparisonSlider beforeImage={inputImage!} afterImage={processedImage!} />
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default BackgroundRemoverCanvas;

//================================================================================================================================================
