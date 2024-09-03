// @ts-nocheck
import { useEffect, useState } from "react"
import { modelStudioTools } from "../assets/tools"
import AdLayout from "./SidebarSections/AdLayout";
import Upscaler from "./SidebarSections/Upscaler";
import OutPaint from "./SidebarSections/OutPaint";
import ModelGenerateSection from "./SidebarSections/ModelGenerateSection";
import BgRemover from "./SidebarSections/BgRemover";

function ModelSideBar({ activeTool }: { activeTool: string }) {
    const [toolData, setToolData] = useState<toolData>(null); //temp

    useEffect(() => {
        const selectedTool = modelStudioTools.filter((tool) => tool.id === activeTool);
        if (selectedTool) setToolData(selectedTool[0])
    }, [activeTool])

    return (
        <>
            <section className="start-0 w-[335px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center bg-toolPalette py-[24px] px-[16px] overflow-y-auto">
                <h4 className="my-1 font-bold text-base">{toolData?.sideBarTitle}</h4>

                {/* Tool index available in tools.json file */}
                {/* {toolData?.toolName === modelStudioTools[0].toolName && <AdLayout />} */}
                {toolData?.toolName === modelStudioTools[0].toolName && <ModelGenerateSection />}
                {toolData?.toolName === modelStudioTools[1].toolName && <Upscaler />}
                {toolData?.toolName === modelStudioTools[2].toolName && <OutPaint />}
                {toolData?.toolName === modelStudioTools[3].toolName && <BgRemover />}

            </section>
        </>
    )
}

export default ModelSideBar