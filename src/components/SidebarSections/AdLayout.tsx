import { useDispatch } from "react-redux";
import { setRatio, setTool, setToolName } from "../../features/canvas/canvasSlice";
import { aspect_ratios } from "../../assets/aspect_ratios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdLayout() {
    const modelStudioAspectRatios = aspect_ratios.filter((ratio) => ratio.ratioValue === "1:1");
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const [selectedAspectRatios, setSelectedAspectRatios] = useState(aspect_ratios);

    useEffect(() => {
        if (window.location.href.includes("modelStudio")) {
            setSelectedAspectRatios(modelStudioAspectRatios)
        }
    }, [window?.location?.href])


    return (
        <div className="p-1">

            <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 mb-7">
                {selectedAspectRatios.map((item, index) => (
                    <div key={index}>
                        <div className="card border bg-white rounded-md w-[120px] h-[120px] mx-auto mb-1 hover:border-violetBg hover:shadow-sm cursor-pointer"
                            onClick={() => { dispatch(setRatio(item.ratioValue)) }}>
                            <img src={item.image} alt={item.title} className="rounded-md" />
                        </div>
                        <p className="text-center text-xs font-medium w-full">{item.title}</p>
                    </div>
                ))}
            </div>


            {/* custom size section */}
            {/* <CustomSize /> */}

            <button className="w-full py-2 bg-violetBg my-3 text-white rounded-lg zoomEffect hover:bg-violetTxt"
                onClick={() => {
                    if (window.location.pathname.slice(1, 6) === 'model') {
                        dispatch(setTool("2"));
                        dispatch(setToolName("Generate"))
                        Navigate("/modelStudio?tool_id=2&tool=Generate");
                    } else {
                        dispatch(setTool("2"));
                        dispatch(setToolName("Assets"))
                        Navigate("/productStudio?tool_id=2&tool=Assets");
                    }
                }}>Create Design</button>
        </div>
    )
}

export default AdLayout