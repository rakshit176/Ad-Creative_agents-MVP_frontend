// @ts-ignore
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import "../../assets/stylesheets/spinnerLoader.css";
import { useSelector } from "react-redux";
import { ReduxStateType } from "../../types/reduxTypes";
import { addImage, handleDragStart, uploadImage } from "../../services/canvasMethods";
import { searchIconsAPI } from "../../services/APIservice";
import { Icons, Shapes, loaded, loading } from "../../assets/defaultStrings";
import KrutLoader from "../KrutLoader";

function ShapesAndIcons() {

    //temporary data
    const sampleShapesList = [

        {
            src: "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiPgogICAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtMC4zNjIwNzcyNjUyMDk5NTYyIj4KICAgICAgPHBhdGggZD0iTSAwIDAgTCAzMDAgMCBMIDMwMCAzMDAgTCAwIDMwMCBaIiAvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CgogIDwhLS0gUGF0aCBmb3IgdGhlIGZpbGwgLS0+CiAgPHBhdGggZD0iTSAwIDAgTCAzMDAgMCBMIDMwMCAzMDAgTCAwIDMwMCBaIiBmaWxsPSJsaWdodGdyYXkiIHRyYW5zZm9ybT0ic2NhbGUoMSwgMSkiLz4KCiAgPCEtLSBQYXRoIGZvciB0aGUgc3Ryb2tlLCBjbGlwcGVkIGJ5IHRoZSBzdGFyIHBhdGggLS0+CiAgPHBhdGggZD0iTSAwIDAgTCAzMDAgMCBMIDMwMCAzMDAgTCAwIDMwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwYzBjMGMiIHN0cm9rZS13aWR0aD0iMCIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtMC4zNjIwNzcyNjUyMDk5NTYyKSIgdHJhbnNmb3JtPSJzY2FsZSgxLCAxKSIgc3Ryb2tlLWRhc2hhcnJheT0iIi8+CiAgICA8L3N2Zz4KICA=",
            alt: "rectangle"
        },
        {
            src: "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiPgogICAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtMC4xMDA1NzA4NjI4NjU1NjE3MiI+CiAgICAgIDxwYXRoIGQ9Ik0gMTUwIDE1MCBtIC0xNTAsIDAgYSAxNTAsMTUwIDAgMSwwIDMwMCwwIGEgMTUwLDE1MCAwIDEsMCAtMzAwLDAiIC8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KCiAgPCEtLSBQYXRoIGZvciB0aGUgZmlsbCAtLT4KICA8cGF0aCBkPSJNIDE1MCAxNTAgbSAtMTUwLCAwIGEgMTUwLDE1MCAwIDEsMCAzMDAsMCBhIDE1MCwxNTAgMCAxLDAgLTMwMCwwIiBmaWxsPSJsaWdodGdyYXkiIHRyYW5zZm9ybT0ic2NhbGUoMSwgMSkiLz4KCiAgPCEtLSBQYXRoIGZvciB0aGUgc3Ryb2tlLCBjbGlwcGVkIGJ5IHRoZSBzdGFyIHBhdGggLS0+CiAgPHBhdGggZD0iTSAxNTAgMTUwIG0gLTE1MCwgMCBhIDE1MCwxNTAgMCAxLDAgMzAwLDAgYSAxNTAsMTUwIDAgMSwwIC0zMDAsMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGMwYzBjIiBzdHJva2Utd2lkdGg9IjAiIGNsaXAtcGF0aD0idXJsKCNjbGlwLTAuMTAwNTcwODYyODY1NTYxNzIpIiB0cmFuc2Zvcm09InNjYWxlKDEsIDEpIiBzdHJva2UtZGFzaGFycmF5PSIiLz4KICAgIDwvc3ZnPgogIA==",
            alt: "circle"
        },
        {
            src: "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiPgogICAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtMC43MTY1MDExNzA0MjI1Mzg0Ij4KICAgICAgPHBhdGggZD0iTSAxNTAgMCBMIDMwMCAzMDAgTCAwIDMwMCBaIiAvPgogICAgPC9jbGlwUGF0aD4KICA8L2RlZnM+CgogIDwhLS0gUGF0aCBmb3IgdGhlIGZpbGwgLS0+CiAgPHBhdGggZD0iTSAxNTAgMCBMIDMwMCAzMDAgTCAwIDMwMCBaIiBmaWxsPSJsaWdodGdyYXkiIHRyYW5zZm9ybT0ic2NhbGUoMSwgMSkiLz4KCiAgPCEtLSBQYXRoIGZvciB0aGUgc3Ryb2tlLCBjbGlwcGVkIGJ5IHRoZSBzdGFyIHBhdGggLS0+CiAgPHBhdGggZD0iTSAxNTAgMCBMIDMwMCAzMDAgTCAwIDMwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwYzBjMGMiIHN0cm9rZS13aWR0aD0iMCIgY2xpcC1wYXRoPSJ1cmwoI2NsaXAtMC43MTY1MDExNzA0MjI1Mzg0KSIgdHJhbnNmb3JtPSJzY2FsZSgxLCAxKSIgc3Ryb2tlLWRhc2hhcnJheT0iIi8+CiAgICA8L3N2Zz4KICA=",
            alt: "triangle"
        },
        {
            src: "data:image/svg+xml;base64,CiAgICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiPgogICAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtMC4zNzY2MDcxMzUyMjc2MTU0NiI+CiAgICAgIDxwYXRoIGQ9Ik0gMTUwIDAgTCAzMDAgMTUwIEwgMTUwIDMwMCBMIDAgMTUwIFoiIC8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KCiAgPCEtLSBQYXRoIGZvciB0aGUgZmlsbCAtLT4KICA8cGF0aCBkPSJNIDE1MCAwIEwgMzAwIDE1MCBMIDE1MCAzMDAgTCAwIDE1MCBaIiBmaWxsPSJsaWdodGdyYXkiIHRyYW5zZm9ybT0ic2NhbGUoMSwgMSkiLz4KCiAgPCEtLSBQYXRoIGZvciB0aGUgc3Ryb2tlLCBjbGlwcGVkIGJ5IHRoZSBzdGFyIHBhdGggLS0+CiAgPHBhdGggZD0iTSAxNTAgMCBMIDMwMCAxNTAgTCAxNTAgMzAwIEwgMCAxNTAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGMwYzBjIiBzdHJva2Utd2lkdGg9IjAiIGNsaXAtcGF0aD0idXJsKCNjbGlwLTAuMzc2NjA3MTM1MjI3NjE1NDYpIiB0cmFuc2Zvcm09InNjYWxlKDEsIDEpIiBzdHJva2UtZGFzaGFycmF5PSIiLz4KICAgIDwvc3ZnPgogIA==",
            alt: "diamond"
        },
        {
            src: "https://cdn-icons-png.flaticon.com/128/815/815497.png",
            alt: "line"
        },
    ]

    const [assetChoice, setAssetChoice] = useState(Shapes);
    const [searchKeyword, setsearchKeyword] = useState("");
    const [searchStatus, setSearchStatus] = useState<null | string>(null);
    const [searchResults, setSearchResults] = useState<null | [""]>(null);
    const { editor } = useSelector((state: ReduxStateType) => state.canvas);
    const formRef = useRef<HTMLFormElement>(null);
    const [sampleIcons, setSampleIcons] = useState<null | [""]>(null);
    const [sampleShapes, setSampleShapes] = useState(sampleShapesList);




    useEffect(() => {
        (async () => {
            // get sample icons from API
            const response = await searchIconsAPI("");
            setSampleIcons(response);
        })();
        setSampleShapes(sampleShapesList);
    }, [])


    async function handleSearch(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setsearchKeyword(searchKeyword.trimEnd());
        if (!searchKeyword?.length) return toast.error("Please type any keyword to search")

        if (assetChoice === Shapes) return toast.error("Shape search not implemented")
        setSearchStatus(loading);

        try {
            //search from API
            const response = assetChoice === Icons ? await searchIconsAPI(searchKeyword) : null;
            if (response) {
                setSearchResults(response);
                setSearchStatus(loaded);
            }

        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    function handleFileUpload(): void {
        uploadImage(editor);
    }

    return (
        <div className="text-start">

            <div className="my-4 mt-6">

                {/* ========== Choice =========== */}
                <div className="my-4 flex justify-evenly">
                    <button className={assetChoice === Shapes ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 w-1/2 cursor-pointer"} onClick={() => { setAssetChoice(Shapes) }}>
                        <h5 className="text-[#344054] font-medium">{Shapes}</h5>
                    </button>

                    <button className={assetChoice === Icons ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
                        "py-1.5 w-1/2 cursor-pointer"} onClick={() => { setAssetChoice(Icons) }}>
                        <h5 className="text-[#344054] font-medium">{Icons}</h5>
                    </button>
                </div>


                {/*=================== Search Bar ================= */}
                <div className="my-5 flex items-center rounded-xl border border-gray-300 bg-white">
                    <span className="px-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2"  >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </span>
                    <form ref={formRef} onSubmit={handleSearch}>
                        <input type="text" name="search" id="search" placeholder={`Search ${assetChoice}`}
                            className=" py-1.5 ps-2 rounded-xl focus:outline-none"
                            value={searchKeyword} onChange={(e) => setsearchKeyword(e.target.value)} />
                    </form>
                </div>

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

                {/* ====== Search Results ========== */}
                {searchStatus === loaded &&
                    <>
                        <div className="flex justify-end mb-2">
                            <h5 className="text-start font-medium my-3 text-violetTxt cursor-pointer" onClick={() => { setSearchStatus(null); setsearchKeyword("") }} >clear</h5>
                        </div>

                        <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mb-10 overflow-y-scroll" style={{ maxHeight: "530px" }}>
                            {searchResults?.length && searchResults.map((image, index) => (
                                <div key={index} className="mx-auto mb-1 hover:shadow-lg" onClick={() => addImage(image, editor)}>
                                    <img src={image} alt={`${searchKeyword}-${index + 1}`} className="w-[52px] h-[52px]" />
                                </div>
                            ))}
                        </div>

                    </>
                }

                {/* // ============ No search results ================== */}

                {!searchStatus &&
                    <>
                        {assetChoice === Icons &&
                            <>
                                {/* upload image section */}
                                <button className="w-full py-1.5  bg-violetBg my-2 text-white rounded-lg hover:bg-violetTxt mb-5"
                                    onClick={handleFileUpload}
                                >Upload file <span className="text-white font-bold"> +</span>
                                </button>

                            </>
                        }


                        {/* ------------------------ Icons section ------------------------------- */}
                        {assetChoice === Icons &&
                            <div className="overflow-y-auto h-[62vh]">
                                <br />
                                <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mb-10">
                                    {sampleIcons ? sampleIcons?.length && sampleIcons.map((image, index) => (

                                        <div key={index} className="mx-auto mb-1 hover:shadow-lg" onClick={() => addImage(image, editor)}>
                                            <img src={image} alt={`icon ${index + 1}`} className="w-[52px] h-[52px]"
                                                draggable="true" onDragStart={(event) => handleDragStart(event)} />
                                        </div>

                                    )) : null}
                                </div>

                            </div>
                        }

                        {/* ------------------------- Shapes section -------------------------- */}
                        {assetChoice === Shapes &&
                            <>
                                {/* <div className="flex justify-between mb-2">
                                    <h5 className="text-start font-medium my-3" >Background</h5>
                                    <h5 className="text-start font-medium my-3 text-violetTxt" >View All</h5>
                                </div> */}
                                <br />

                                <div className="grid grid-cols-2 gap-[12px] md:grid-cols-3 mb-10">
                                    {sampleShapes?.length && sampleShapes.map((image, index) => (

                                        <div key={index} className="mx-auto mb-1 hover:shadow-lg">
                                            <img src={image.src} alt={image.alt} className="w-[92px]" />
                                        </div>

                                    ))}
                                </div>
                            </>
                        }

                        {/* ------------------------- Shapes section -------------------------- */}




                    </>}
            </div>
        </div >
    )
}

export default ShapesAndIcons