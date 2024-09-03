import { useState } from "react"
import "../../assets/stylesheets/sidebar.css"
import { remove, replace } from "../../assets/defaultStrings";
import toast from "react-hot-toast";

// This component is dummy

function MagicTool() {

    const [magicTool, setMagicTool] = useState(remove);

    function uploadImageAlert(): void {
        toast.error("Upload an Image to continue");
    }

    return (
        <div className="text-start">

            <div className="text-center">
                <p className="text-xs font-medium text-[#667085]">Eliminate or Swap unwanted objects and fix imperfections instantly and accurately </p>
            </div>
            
            <div className="my-4 mt-6">

                <div className="my-4 ">
                    <button className={magicTool === remove ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 cursor-pointer w-1/2"} onClick={() => setMagicTool(remove)}>
                        <h5 className="text-[#344054] font-medium">Magic Remove</h5>
                    </button>

                    <button className={magicTool === replace ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 cursor-pointer w-1/2"} onClick={() => setMagicTool(replace)}>
                        <h5 className="text-[#344054] font-medium">Magic Replace</h5>
                    </button>
                </div>

                <div className="space-y-3">

                    <button className="p-2 px-3 text-start bg-white mt-1 rounded border hover:shadow-lg hover:border-violetBg  cursor-pointer w-full "
                        onClick={uploadImageAlert}>
                        <p className="text-sm flex items-center">
                            <span className="material-symbols-outlined px-1 font-light text-xl">arrow_selector_tool</span>
                            Click the area
                        </p>
                    </button>

                    <button className="p-2 px-3 text-start bg-white mt-1 rounded border hover:shadow-lg hover:border-violetBg  cursor-pointer w-full "
                        onClick={uploadImageAlert}>
                        <p className="text-sm flex items-center">
                            <span className="material-symbols-outlined px-1 font-light text-xl">variable_add</span>
                            Box
                        </p>
                    </button>


                    <button className="p-2 px-3 text-start bg-white mt-1 rounded border hover:shadow-lg hover:border-violetBg  cursor-pointer w-full"
                        onClick={uploadImageAlert}>
                        <p className="text-sm text-[#344054] flex items-center">
                            <span className="material-symbols-outlined px-1 font-light text-xl">brush</span>
                            Brush
                        </p>
                    </button>

                </div>

                <button className="w-full py-2 bg-violetBg mt-8 text-white rounded-lg zoomEffect hover:bg-violetTxt"
                    onClick={uploadImageAlert}>
                    {magicTool}
                </button>

            </div>
        </div>
    )
}

export default MagicTool