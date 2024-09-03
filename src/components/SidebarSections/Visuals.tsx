import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addImage, handleDragStart, uploadVisuals } from "../../services/canvasMethods";
import { useSelector } from "react-redux";
import { ReduxStateType } from "../../types/reduxTypes";
import { loading } from "../../assets/defaultStrings";
import { visualSamples, visualDemo } from "../../assets/assetSamples";
import KrutLoader from "../KrutLoader";

function Visuals() {
    const [searchKeyword, setsearchKeyword] = useState("");
    const [searchStatus, setSearchStatus] = useState<null | string>(null);
    const { editor } = useSelector((state: ReduxStateType) => state.canvas);
    const [visualsDisplay, setVisualsDisplay] = useState(visualDemo);
    const [isExpandedView, setIsExpandedView] = useState(false);




    function handleSearch(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setsearchKeyword(searchKeyword.trimEnd());
        if (!searchKeyword?.length) return toast.error("Please type any keyword to search")
        setSearchStatus(loading);

        setTimeout(() => {
            toast.error(`Search Keyword : ${searchKeyword} \nSearch Function not implemented`);
            setsearchKeyword(""); //reset search
            setSearchStatus(null);
        }, 5000);
    }



    function viewMoreVisualsHelper(title: string): void {
        const viewMore = visualSamples.filter((visual) => visual.title === title);
        setVisualsDisplay(viewMore);
        setIsExpandedView(true);
    }


    //===============================================================================

    return (
        <div className=" p-1 gap-[20px]">

            {/* Search Bar  */}
            {/* <div className="mt-4 flex items-center rounded-xl border border-gray-300 bg-white">
                <span className="px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"  >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <form onSubmit={handleSearch}>
                    <input type="text" name="search" id="search" placeholder="Search visuals" className="py-1.5 ps-2 rounded-xl focus:outline-none"
                        value={searchKeyword} onChange={(e) => setsearchKeyword(e.target.value)} />
                </form>
            </div> */}


            {/* loading spinner */}
            {searchStatus === loading &&
                <div className="container-fluid">
                    <div className="flex w-full h-full items-center justify-center">
                        <div className="w-36">
                            <KrutLoader />
                        </div>
                    </div>
                </div>
            }


            {!searchStatus && <>
                <button type="submit" className="w-full py-1.5  bg-violetBg my-5 text-white rounded-lg zoomEffect hover:bg-violetTxt"
                    onClick={() => uploadVisuals(editor)}>Upload visuals <span className="text-white font-bold"> +</span></button>


                {/* Assets List */}
                {visualsDisplay.map((item, index) => (
                    <div key={index} >
                        <div className="flex justify-between mb-0">
                            <h5 className="text-start font-medium my-3" >{item.title}</h5>
                            {!isExpandedView ? <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer"
                                onClick={() => viewMoreVisualsHelper(item.title)} >View All</h5> :
                                <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer"
                                    onClick={() => {
                                        setVisualsDisplay(visualDemo);
                                        setIsExpandedView(false);
                                    }} >Collapse</h5>
                            }
                        </div>

                        <div className="grid grid-cols-2 gap-[16px] md:grid-cols-3 mb-4">
                            {item?.images?.length && item.images.map((image, index) => (

                                <div key={index} className="mx-auto mb-1 border hover:shadow-xl rounded-md" onClick={() => addImage(image.path, editor)}>
                                    <img src={image.thumbnail} alt={image.name} className="zoomEffect rounded-md" loading="lazy"
                                        // draggable="true" onDragStart={(event) => handleDragStart(event)} 
                                        />
                                </div>

                            ))}
                        </div>
                    </div>
                ))
                }
            </>
            }
        </div>
    )
}

export default Visuals 