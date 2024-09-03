import { useDispatch, useSelector } from "react-redux"
import { adCreativeTools, modelStudioTools, productStudioTools } from "../assets/tools"
import { setTool, setToolName } from "../features/canvas/canvasSlice"
import { ReduxStateType } from "../types/reduxTypes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { adStudio, modelStudio, productStudio } from "../assets/defaultStrings";

function ToolsBar({ location }: { location: string }) {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const { activeTool } = useSelector((state: ReduxStateType) => state.canvas);

    useEffect(() => {
        //extract existing tool ID from query and set active tool
        const query = window?.location?.search
        if (query?.length && query.indexOf('=') !== -1) {
            let toolID = query.split("=")[1];
            dispatch(setTool(toolID[0]))
        }
        const toolName = new URLSearchParams(window?.location?.search).get("tool");
        if (toolName) {
            dispatch(setToolName(toolName));
        }
    }, [])


    return (
        <>
            {/* Product Studio Tool Bar */}
            {location === productStudio && <section className="start-0 w-[74px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center overflow-y-auto pb-4">
                {productStudioTools.map((tool) => (
                    <div key={tool.id} onClick={() => { dispatch(setTool(tool.id)); dispatch(setToolName(tool.toolName)); Navigate(`?tool_id=${tool.id}&tool=${tool.toolName}`) }} className="mt-4 cursor-pointer">

                        {/* tool icon implementation based on whether its image or symbol  */}
                        {tool.icon[0] === "/" ? <img src={`/icons${tool.icon}`} alt={tool.toolName}
                            className={activeTool === tool.id ? "w-[30px] ms-5 p-1 bg-highLightBg rounded" : "w-[30px] ms-5 p-1"} /> :

                            <span className={activeTool === tool.id ? "material-symbols-outlined bg-highLightBg text-violetTxt py-0.5 px-1 rounded"
                                : "p-0.5 px-1 material-symbols-outlined"}>
                                {tool.icon}
                            </span>}

                        <p className={activeTool === tool.id ? "text-violetTxt text-xs" : "text-xs"}>{tool.toolName}</p>

                    </div>
                ))}

            </section>
            }

            {/* Model Studio Tool Bar */}
            {location === modelStudio && <section className="start-0 w-[74px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center overflow-y-auto pb-4">
                {modelStudioTools.map((tool) => (
                    <div key={tool.id} onClick={() => { dispatch(setTool(tool.id)); dispatch(setToolName(tool.toolName)); Navigate(`?tool_id=${tool.id}&tool=${tool.toolName}`) }} className="mt-4 cursor-pointer">

                        {/* tool icon implementation based on whether its image or symbol  */}
                        {tool.icon[0] === "/" ? <img src={`/icons${tool.icon}`} alt={tool.toolName}
                            className={activeTool === tool.id ? "w-[30px] ms-5 p-1 bg-highLightBg rounded" : "w-[30px] ms-5 p-1"} /> :

                            <span className={activeTool === tool.id ? "material-symbols-outlined bg-highLightBg text-violetTxt py-0.5 px-1 rounded"
                                : "p-0.5 px-1 material-symbols-outlined"}>
                                {tool.icon}
                            </span>}

                        <p className={activeTool === tool.id ? "text-violetTxt text-xs" : "text-xs"}>{tool.toolName}</p>

                    </div>
                ))}

            </section>
            }

            {/* Ad Creative Tool Bar */}
            {location === adStudio && <section className="start-0 w-[74px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center overflow-y-auto pb-4">
                {adCreativeTools.map((tool) => (
                    <div key={tool.id} onClick={() => { dispatch(setTool(tool.id)); dispatch(setToolName(tool.toolName)); Navigate(`?tool_id=${tool.id}&tool=${tool.toolName}`) }} className="mt-4 cursor-pointer">

                        {/* tool icon implementation based on whether its image or symbol  */}
                        {tool.icon[0] === "/" ? <img src={`/icons${tool.icon}`} alt={tool.toolName}
                            className={activeTool === tool.id ? "w-[30px] ms-5 p-1 bg-highLightBg rounded" : "w-[30px] ms-5 p-1"} /> :

                            <span className={activeTool === tool.id ? "material-symbols-outlined bg-highLightBg text-violetTxt py-0.5 px-1 rounded"
                                : "p-0.5 px-1 material-symbols-outlined"}>
                                {tool.icon}
                            </span>}

                        <p className={activeTool === tool.id ? "text-violetTxt text-xs" : "text-xs"}>{tool.toolName}</p>

                    </div>
                ))}

            </section>
            }
        </>
    )
}

export default ToolsBar