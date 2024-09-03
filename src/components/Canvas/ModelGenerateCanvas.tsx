import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReduxStateType } from "../../types/reduxTypes";
import { loaded } from "../../assets/defaultStrings";
import { addBackground } from "../../services/canvasMethods";
import { setGeneratedImageSrc } from "../../features/canvas/canvasSlice";
import KrutLoaderModal from "../KrutLoaderModal";

function ModelGenerateCanvas() {
    const [modelFacePreview, setModelFace] = useState<null | string>(null);
    const [modelPosePreview, setModelPose] = useState<null | string>(null);
    const [generatedModels, setGeneratedModels] = useState<null | string[]>(null); //test
    const [loadingStatus, setLoadingStatus] = useState<null | string>(null);
    const [showGeneratedOutputs, setShowGeneratedOutputs] = useState<boolean>(false); // State to toggle between showing generated outputs and model face/pose
    const dispatch = useDispatch();

    const { modelPose, modelFace, editor, generatedModelsList, isLoadingState } = useSelector((state: ReduxStateType) => state.canvas);

    useEffect(() => {
        setLoadingStatus(null);
        setGeneratedModels(null);
        setShowGeneratedOutputs(false);
        setModelPose(modelPose);
    }, [modelPose]);

    useEffect(() => {
        setLoadingStatus(null);
        setGeneratedModels(null);
        setModelFace(modelFace);
        setShowGeneratedOutputs(false);
    }, [modelFace]);

    useEffect(() => {
        if (generatedModelsList?.length) setGeneratedModels(generatedModelsList);
    }, [generatedModelsList]);

    useEffect(() => {
        setLoadingStatus(isLoadingState);
        if (isLoadingState === loaded) {
            setShowGeneratedOutputs(true);
        } else {
            setShowGeneratedOutputs(false);
        }
    }, [isLoadingState]);

    const handleToggleChange = (showGenerated: boolean) => {
        setShowGeneratedOutputs(showGenerated);
    };

    return (
        <>
            <div className={`container-fluid w-[20vw] bg-canvasBg`}>
                <div className="h-[90vh] flex justify-evenly items-center overflow-y-auto">
                    <div className="flex-col md:flex-row p-10 space-y-10 max-h-full overflow-y-auto">
                        {/* Selector */}

                        {generatedModels && <div className="my-4 flex justify-evenly min-w-[270px]">
                            <button className={`py-1.5 w-1/2 ${!showGeneratedOutputs ? "border-2 border-t-0 border-x-0 border-violetBg" : "cursor-pointer"}`} onClick={() => handleToggleChange(false)}>
                                <h5 className="text-[#344054] font-medium">Input Images</h5>
                            </button>
                            <button className={`py-1.5 w-1/2 ${showGeneratedOutputs ? "border-2 border-t-0 border-x-0 border-violetBg" : "cursor-pointer"}`} onClick={() => handleToggleChange(true)}>
                                <h5 className="text-[#344054] font-medium">Generated Output</h5>
                            </button>
                        </div>}

                        {/* Model Face or Generated Outputs */}
                        {showGeneratedOutputs ? (
                            <div className="">
                                {generatedModels && generatedModels.length > 0 ? (
                                    generatedModels.map((image, index) => (
                                        <div className="max-w-[400px] my-6" key={index}>
                                            <img src={image} alt={`Model ${index + 1}`}
                                                className="w-full bg-white border rounded-xl shadow-md border-gray-300 mx-2"
                                                onClick={() => {
                                                    editor.canvas.clear(); // clear previous images
                                                    addBackground(image, editor);
                                                    dispatch(setGeneratedImageSrc(image));
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        ) : (
                            <>
                                {/* Model Face */}
                                {modelFacePreview ? (
                                    <div className={`max-w-[400px]`}>
                                        <img src={modelFacePreview} alt="Model face" className="w-full bg-white border rounded-xl shadow-md border-gray-300 mx-2" />
                                        <p className="w-full relative -mt-5 text-center text-slate-100">Model face</p>
                                    </div>
                                ) : (
                                    <div className="h-[30vh] w-full rounded-xl flex items-center justify-center mx-2 my-10 border border-dashed border-gray-300 text-xs text-gray-400 bg-white px-5">
                                        Please choose a model face
                                    </div>
                                )}
                                {/* Model Pose */}
                                {modelPosePreview ? (
                                    <div className={`max-w-[400px]`}>
                                        <img src={modelPosePreview} alt="Model pose" className="w-full bg-white border rounded-xl shadow-md border-gray-300 mx-2" />
                                        <p className="w-full relative -mt-5 text-center text-slate-100">Model Pose</p>
                                    </div>
                                ) : (
                                    <div className="h-[30vh] w-full rounded-xl flex items-center justify-center mx-2 my-10 border border-dashed border-gray-300 text-xs text-gray-400 bg-white px-5">
                                        Please choose a model pose
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading spinner */}
            <KrutLoaderModal isLoading={loadingStatus} />
        </>
    );
}

export default ModelGenerateCanvas;
