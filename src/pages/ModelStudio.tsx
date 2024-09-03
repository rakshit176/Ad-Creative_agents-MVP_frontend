// @ts-ignore
import Header from "../components/Header"
import ToolsBar from "../components/ToolsBar"
import CanvasSection from "../components/Canvas/CanvasSection"
import { useSelector } from "react-redux";
import { ReduxStateType } from "../types/reduxTypes";
import ModelSideBar from "../components/ModelSideBar";
import { modelStudio } from "../assets/defaultStrings";
import UpscalarCanvas from "../components/Canvas/UpscalarCanvas";
import BackgroundRemoverCanvas from "../components/Canvas/BackgroundRemoverCanvas";
import OutpaintCanvas from "../components/Canvas/OutpaintCanvas";
import ModelGenerateCanvas from "../components/Canvas/ModelGenerateCanvas";

function ModelStudio() {
    const { activeTool, isModelGenerate } = useSelector((state: ReduxStateType) => state.canvas);

    return (
        <>
            <Header location={modelStudio} />

            <div className="flex bg-canvasBg">

                {/* Tool section */}
                <ToolsBar location={modelStudio} />

                {/* Side bar section */}
                     <ModelSideBar activeTool={activeTool} />

                {/* Canvas Sections */}
                {(parseInt(activeTool) < 3) &&
                    // sections requiring same canvas (except for model generate)
                    <>
                        {isModelGenerate && <ModelGenerateCanvas />}
                        <CanvasSection />
                    </>
                }

                {/* other canvas */}
                {(parseInt(activeTool) === 3) && <UpscalarCanvas />}
                {(parseInt(activeTool) === 4) && <OutpaintCanvas />}
                {(parseInt(activeTool) === 5) && <BackgroundRemoverCanvas />}

            </div>
        </>
    )
}

export default ModelStudio