// @ts-ignore
// @ts-nocheck
import { useEffect, useState } from "react"
import { getTemplateDataAPI, getTemplatesAPI, searchTemplatesAPI } from "../../services/APIservice";
import { useFabricJSEditor } from "fabricjs-react";
import toast from "react-hot-toast";
import { loaded, loading } from "../../assets/defaultStrings";
import KrutLoader from "../KrutLoader";


function Templates() {
    const [templates, setTemplates] = useState<null | [{ preview: string, json: string }]>(null);
    const { editor } = useFabricJSEditor();
    const [searchKeyword, setsearchKeyword] = useState("");
    const [searchStatus, setSearchStatus] = useState<null | string>(null);

    useEffect(() => {
        // get sample templates from API
        (async () => {
            const response = await getTemplatesAPI();
            setTemplates(response);
        })();
    }, [])

    async function addFromTemplate(templateUrl: string) {
        //loading template on selection
        const template = await getTemplateDataAPI(templateUrl);
        console.log("template data =>", template)
        if (editor?.canvas) {
            editor?.canvas.loadFromJSON(template, () => {
                editor?.canvas.requestRenderAll();
            });
        }
    }

    async function handleSearch(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setsearchKeyword(searchKeyword.trimEnd());
        if (!searchKeyword?.length) return toast.error("Please type any keyword to search")
        setSearchStatus(loading);

        try {
            //search templates
            const response = await searchTemplatesAPI(searchKeyword);
            if (response) {
                setTemplates(response);
                setSearchStatus(loaded);
            }

        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    return (
        <>
            {/* Search Bar  */}
            <div className="my-4 flex items-center rounded-xl border border-gray-300 bg-white">
                <span className="px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"  >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <form onSubmit={handleSearch}>
                    <input type="text" name="search" id="search" placeholder="Search templates" className="py-1.5 ps-2 rounded-xl focus:outline-none"
                        value={searchKeyword} onChange={(e) => setsearchKeyword(e.target.value)} />
                </form>
            </div>
            <br />
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

            {(!searchStatus || searchStatus === loaded) && <>
                <div className="grid grid-cols-1 gap-[16px] md:grid-cols-2 mb-10">
                    {templates ? templates.map((item, index) => (
                        <div key={index}>
                            <div className="card border bg-white rounded-md w-[120px] mx-auto mb-1 hover:shadow-lg cursor-pointer"
                                onClick={() => { addFromTemplate(item?.json) }}  >
                                <img src={item?.preview} alt={`template ${index + 1}`} className="template preview" />
                            </div>
                        </div>
                    )) : null}
                </div>
            </>}
        </>
    )
}

export default Templates