import { useEffect, useRef, useState } from "react";
import logo from "/images/logo.png"
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/user/userSlice";
import { adStudio, dashboard, modelStudio, productStudio } from "../assets/defaultStrings";
import { ReduxStateType } from "../types/reduxTypes";
import creditsIcon from "/images/credits.png"
import { setSelectedStudio } from "../features/canvas/canvasSlice";
import { backupToDataBase } from "../services/canvasMethods";


function Header({ location }: { location: string }) {
    const profileImage = "https://img.freepik.com/premium-photo/woman-with-red-hair-blue-background-with-red-hair_481747-2790.jpg"; //tempory profile pic
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState("png");
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const exportMenuRef = useRef(null);
    const { activeToolName, editor, generatedImage, upscaledImage, outpaintedImage, bgRemovedImage, uploadedImage } = useSelector((state: ReduxStateType) => state?.canvas);
    const userCredit = useSelector((state: ReduxStateType) => state?.user?.userCredit) || (localStorage.getItem('credit_balance') || 0);
    const totalCredit = useSelector((state: ReduxStateType) => state?.user?.totalCredits) || (localStorage.getItem('credit_total') || 500);
    // const reduxData: ReduxStateType = useSelector((state: ReduxStateType) => state);

    async function handleLogout() {
        setIsMenuOpen(false);
        // const backupStatus = await backupToDataBase(reduxData);
        // if (backupStatus) dispatch(logout());
        // else {
        //     const isConfirm = window.confirm("Unable to backup your data, Proceed logout without backup?");
        //     if (isConfirm) {
        //         dispatch(logout());
        //         Navigate("/");
        //     } else return
        // }

        dispatch(logout()); //temp
        Navigate("/");  //temp
    }

    // ----------- Handle Image Download ------------------------
    function handleDownload() {
        // console.log(activeToolName) //test 
        //for downloading from canvas
        if (activeToolName === "Assets" || activeToolName === "Visuals" || activeToolName === "Ad Layout") {
            if (!editor) return
            //discard active objects if any
            editor?.canvas?.discardActiveObject();
            editor?.canvas?.requestRenderAll();

            const link = document.createElement("a");

            // for jpg / png download from canvas
            if (exportFormat !== "svg") {
                link.href = editor?.canvas?.toDataURL({
                    format: exportFormat,
                    quality: 1,
                });
                link.download = `Krut_export_${Date.now()}.${exportFormat}`;
                link.click();
                toast.success("File is being downloaded");
            } else {
                //for svg download
                const svgData = editor?.canvas?.toSVG();
                const blob = new Blob([svgData], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                link.href = url;
                let file_name = `Krut_export_${Date.now()}.svg`;
                link.download = file_name;
                link.click();
                // Clean up
                URL.revokeObjectURL(url);
                toast.success("File is being downloaded");
            }

            //download base64 images without canvas
        } else if (activeToolName === "Generate" || activeToolName === "Upscaler" || activeToolName === "Auto Fill"
            || activeToolName === "Background Remover" || activeToolName === "Magic Tool") {

            let fileToDownload = "";

            if (activeToolName === "Generate") {
                if (!generatedImage) return toast.error("Please generate image first");
                fileToDownload = generatedImage;
            } else if (activeToolName === "Upscaler") {
                if (!upscaledImage) return toast.error("Please upscale image first");
                fileToDownload = upscaledImage;
            } else if (activeToolName === "Auto Fill") {
                if (!outpaintedImage) return toast.error("Please apply auto fill image first");
                fileToDownload = outpaintedImage;
            } else if (activeToolName === "Background Remover") {
                if (!bgRemovedImage) return toast.error("Please remove background first");
                fileToDownload = bgRemovedImage;
            } else if (activeToolName === "Magic Tool") {
                if (!uploadedImage) return toast.error("Please upload an image");
                fileToDownload = uploadedImage;
            } else {
                return toast.error("Please use any tool to build image for download");
            }

            // Check if the generatedImage string starts with 'data:image'
            if (!fileToDownload.startsWith('data:image')) {
                return toast.error("Invalid image format");
            }
            // Extract the base64 data part of the string
            const base64Image = fileToDownload.split(',')[1];

            // for jpg / png download
            if (exportFormat !== "svg") {

                // Convert base64 to Blob
                const byteCharacters = atob(base64Image);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/png' });

                // Create URL
                const url = URL.createObjectURL(blob);

                // Create anchor element
                const a = document.createElement('a');
                a.href = url;
                let file_name = `Krut_export_${Date.now()}.${exportFormat}`;
                a.download = file_name;

                // Simulate click
                a.click();

                // Clean up
                URL.revokeObjectURL(url);

            } else {
                //-------- for svg download ----------

                // Create a new image element
                const img = new Image();
                img.onload = () => {
                    // Get the dimensions of the image
                    const width = img.width;
                    const height = img.height;

                    // Construct the SVG content with the Base64 URL embedded
                    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
                    <image xlink:href="data:image/png;base64,${base64Image}" width="${width}" height="${height}"/>
                    </svg>`;


                    // Convert the SVG content to a Blob
                    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });

                    // Create a download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(svgBlob);
                    downloadLink.download = `Krut_export_${Date.now()}.svg`;

                    // Trigger the download
                    downloadLink.click();
                };

                // Set the source of the image to the base64 string
                img.src = `data:image/png;base64,${base64Image}`;
            }

        }
        setIsExportMenuOpen(false);  //close export menu popup
    }
    // -----------------------------------

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setIsExportMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (window.location.href.includes(modelStudio)) {
            dispatch(setSelectedStudio(modelStudio))
        } else if (window.location.href.includes(productStudio)) {
            dispatch(setSelectedStudio(productStudio))
        } else {
            dispatch(setSelectedStudio("adCreative"))
        }
    }, [window?.location?.href]);

    return (
        <>
            <div className="flex py-2 mx-5 sm:mx-20 justify-between items-center max-h-[55px]">

                <div className="flex items-center cursor-pointer" onClick={() => Navigate("/dashboard")}>
                    <img src={logo} alt="Krut AI Logo" className="h-[35px]" />
                    <h2 className="headerLogo mx-2">Krut AI</h2>
                </div>

                <div className="flex space-x-6">

                    <button className="border-violetBg px-3 my-auto py-1.5 font-bold rounded-xl border flex items-center cursor-default">
                        <img src={creditsIcon} alt="credits" className="w-5 me-2" />
                        {userCredit? userCredit : 0}/{totalCredit} credits used
                    </button>


                    {/* credits graph area */}
                    {/* <div className="flex-col  hidden sm:block">
                        <p className="text-sm font-normal">Credit used <span className="ms-10">{userCredit}/{totalCredit}</span></p>
                        <div className="h-1 mt-2 bg-violetBg" style={{ width: (userCredit / totalCredit) * 1.5 * 100 }}></div>
                        <hr />
                    </div> */}


                    {/* Move to ad creative button  */}
                    {/* {(location === productStudio || location === modelStudio) && <button className="mx-5 bg-violetBg px-5 text-white rounded-xl border cursor-pointer"
                        onClick={() => { setIsExportMenuOpen(false); setIsMenuOpen(false); Navigate('/adCreative') }}
                    >Move to Ad creative</button>} */}

                    {/* Export Button */}
                    {(location !== dashboard && location !== adStudio) && <>

                        {/* Download button */}
                        {/* <button className="bg-violetBg px-5 text-white rounded-xl border flex items-center cursor-pointer"
                            onClick={() => {
                                // download upscaled Image API call
                            }}>
                            Download <span className="material-symbols-outlined ms-1 text-white"> download </span>
                        </button> */}

                        <button className="bg-violetBg px-5 my-1 text-white rounded-xl border flex items-center cursor-pointer font-bold"
                            onClick={() => { isExportMenuOpen ? setIsExportMenuOpen(false) : setIsExportMenuOpen(true); setIsMenuOpen(false) }}>
                            Export <span className="material-symbols-outlined ms-1 text-white">expand_more</span>
                        </button>

                        {isExportMenuOpen && <div ref={exportMenuRef} className="fixed end-20 top-16 z-50">
                            <div className="mx-2 sm:mx-12 bg-white border px-4 py-2.5 text-start flex flex-col rounded-lg shadow-lg ">
                                <label htmlFor="export" className="text-xs mb-3">File Type</label>

                                <div className={`mb-1 border px-8 rounded-lg py-2 cursor-pointer ${exportFormat === "png" ? "border-violetBg bg-highLightBg" : ""}`}
                                    onClick={(e) => setExportFormat("png")}> PNG </div>

                                <div className={`mb-1 border px-8 rounded-lg py-2 cursor-pointer ${exportFormat === "jpg" ? "border-violetBg bg-highLightBg" : ""}`}
                                    onClick={(e) => setExportFormat("jpg")}> JPG </div>

                                <div className={`mb-1 border px-8 rounded-lg py-2 cursor-pointer ${exportFormat === "svg" ? "border-violetBg bg-highLightBg" : ""}`}
                                    onClick={(e) => setExportFormat("svg")}> SVG </div>
                                {/* 
                                <select name="export" id="export" className="border text-start px-8 rounded-lg py-1"
                                    onChange={(e) => setExportFormat(e.target.value)}>
                                    <option value="png">PNG</option>
                                    <option value="jpg">JPG</option>
                                    <option value="svg">SVG</option>
                                </select> */}

                                <button className="text-base font-normal text-white bg-violetBg rounded-lg mt-3 py-2 flex items-center px-6" onClick={handleDownload}>Download
                                    <span className="material-symbols-outlined ms-1 text-white"> download </span> </button>

                            </div>
                        </div>}
                    </>}


                    {/* profile pic & Logout */}
                    <div className="image-container w-12 h-12">
                        <img src={profileImage} alt="profile image" className=" rounded-full cursor-pointer"
                            onClick={() => { isMenuOpen ? setIsMenuOpen(false) : setIsMenuOpen(true); setIsExportMenuOpen(false) }} />
                    </div>
                </div>
            </div>
            <hr />

            {isMenuOpen && <div ref={menuRef} className="fixed top-16 end-0 z-50">
                <div className="mx-2 sm:mx-12 bg-white border px-10 py-2.5 text-start flex items-center rounded-lg shadow-lg cursor-pointer"
                    onClick={handleLogout}>

                    <span className="material-symbols-outlined text-md mr-2">logout</span>
                    <p className="text-base font-normal mb-0 py-1.5">Logout</p>
                </div>
            </div>}
            <Toaster />
        </>
    )
}

export default Header