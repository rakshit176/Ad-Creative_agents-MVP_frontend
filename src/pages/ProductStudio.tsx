import Header from "../components/Header"
import ProductSideBar from "../components/ProductSideBar"
import ToolsBar from "../components/ToolsBar"
import CanvasSection from "../components/Canvas/CanvasSection"
import { useSelector } from "react-redux";
import { ReduxStateType } from "../types/reduxTypes";
import GeneratorCanvas from "../components/Canvas/GeneratorCanvas";
import UpscalarCanvas from "../components/Canvas/UpscalarCanvas";
import SamCanvas from "../components/Canvas/SamCanvas";
import OutpaintCanvas from "../components/Canvas/OutpaintCanvas";
import BackgroundRemover from "../components/Canvas/BackgroundRemoverCanvas";
import { productStudio } from "../assets/defaultStrings";

function ProductStudio() {
    const { activeTool } = useSelector((state: ReduxStateType) => state.canvas);

    return (
        <>
            <Header location={productStudio} />

            <div className="flex">

                {/* Tool section */}
                <ToolsBar location={productStudio} />

                {//side bar for all tools except for SAM : See tools.jon to see the index number of tools
                    (parseInt(activeTool) != 6) && <ProductSideBar activeTool={activeTool} />}

                {/* Canvas Sections */}
                {(parseInt(activeTool) < 4) && <CanvasSection />}

                {(parseInt(activeTool) === 4) && <GeneratorCanvas />}
                {(parseInt(activeTool) === 5) && <UpscalarCanvas />}
                {(parseInt(activeTool) === 6) && <SamCanvas />}
                {(parseInt(activeTool) === 7) && <OutpaintCanvas />}
                {(parseInt(activeTool) === 8) && <BackgroundRemover />}

            </div>
        </>
    )
}

export default ProductStudio