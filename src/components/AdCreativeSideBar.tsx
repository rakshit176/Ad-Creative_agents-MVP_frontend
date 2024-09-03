import { useEffect, useState } from "react";
import { adCreativeTools } from "../assets/tools";
import Templates from "./SidebarSections/Templates";
import ShapesAndIcons from "./SidebarSections/ShapesAndIcons";

function AdCreativeSideBar({ activeTool }: { activeTool: string }) {
    const [toolData, setToolData] = useState<toolData>(); //temp

    useEffect(() => {
        const selectedTool = adCreativeTools.filter((tool) => tool.id === activeTool);
        if (selectedTool) setToolData(selectedTool[0])
    }, [activeTool])


    return (
        <>
            <section className="start-0 w-[335px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center bg-toolPalette py-[24px] px-[16px] overflow-y-auto">
                <h4 className="my-1 ">{toolData?.sideBarTitle}</h4>

                {toolData?.toolName === adCreativeTools[0].toolName && <Templates />}
                {toolData?.toolName === adCreativeTools[2].toolName && <ShapesAndIcons />}
                {/* {toolData?.toolName === adCreativeTools[3].toolName && <GenerateSection />}
                {toolData?.toolName === adCreativeTools[4].toolName && <Upscaler />} */}

            </section>

        </>
    )
}

export default AdCreativeSideBar