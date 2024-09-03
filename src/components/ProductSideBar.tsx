import { useEffect, useState } from "react"
import { productStudioTools } from "../assets/tools"
import AdLayout from "./SidebarSections/AdLayout";
import Visuals from "./SidebarSections/Visuals";
import GenerateSection from "./SidebarSections/ProductGenerateSection";
import Upscaler from "./SidebarSections/Upscaler";
import Assets from "./SidebarSections/Assets";
import OutPaint from "./SidebarSections/OutPaint";
import BgRemover from "./SidebarSections/BgRemover";
import { productStudio } from "../assets/defaultStrings";

function ProductSideBar({ activeTool }: { activeTool: string }) {
    const [toolData, setToolData] = useState<toolData>(); //temp

    useEffect(() => {
        const selectedTool = productStudioTools.filter((tool) => tool.id === activeTool);
        if (selectedTool) setToolData(selectedTool[0])
    }, [activeTool])


    return (
        <>
            <section className="start-0 w-[335px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center bg-toolPalette py-[24px] px-[16px] overflow-y-auto">
                <h4 className="my-1 font-bold text-base">{toolData?.sideBarTitle}</h4>

                {toolData?.toolName === productStudioTools[0].toolName && <AdLayout />}
                {toolData?.toolName === productStudioTools[1].toolName && <Assets location={productStudio}/>}
                {toolData?.toolName === productStudioTools[2].toolName && <Visuals />}
                {toolData?.toolName === productStudioTools[3].toolName && <GenerateSection />}
                {toolData?.toolName === productStudioTools[4].toolName && <Upscaler />}
                {/* {toolData?.toolName === productStudioTools[5].toolName && <MagicTool />} */}
                {toolData?.toolName === productStudioTools[6].toolName && <OutPaint />}
                {toolData?.toolName === productStudioTools[7].toolName && <BgRemover />}

            </section>

        </>
    )
}

export default ProductSideBar