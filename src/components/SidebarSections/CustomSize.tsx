// @ts-ignore
// @ts-nocheck
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setRatio } from "../../features/canvas/canvasSlice";


function CustomSize() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        setAspectRatio()
    }, [width, height])

    function setAspectRatio() {
        if (width && height) {
            if (width > 3000) return toast.error("Set value less than 3000px for width");
            else if (height > 3000) return toast.error("Set value less than 3000px for height");
            else if (height < 1) return toast.error("Set value greater than 0px for height");
            else if (width < 1) return toast.error("Set value greater than 0px for width");
            else dispatch(setRatio(`${width}:${height}`));
        }
    }

    return (
        <>
            <h5 className="text-start font-medium my-3" >Custom Size</h5>

            <div className="flex justify-between items-center">
                <p className="text-xs">Width</p>

                <div className="bg-white flex items-center border rounded w-[123px] my-1">
                    <input type="number" name="width" id="width"
                        className="w-[80px] h-[24px] border rounded text-xs m-1 p-2 " placeholder="1080"
                        value={width ? width : ""} onChange={(e) => setWidth(parseInt(e.target.value))} />
                    <p className="text-center text-xs w-full">px</p>
                </div>

            </div>

            <div className="flex justify-between items-center">
                <p className="text-xs">Height</p>

                <div className="bg-white flex items-center border rounded w-[123px] my-1">
                    <input type="number" name="width" id="width"
                        className="w-[80px] h-[24px] border rounded text-xs m-1 p-2 " placeholder="1080"
                        value={height ? height : ""} onChange={(e) => setHeight(parseInt(e.target.value))} />
                    <p className="text-center text-xs w-full">px</p>
                </div>

            </div>
        </>
    )
}

export default CustomSize

