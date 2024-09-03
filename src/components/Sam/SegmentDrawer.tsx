
import { useContext, useEffect, useState } from "react";
import { getCookieConsentValue } from "react-cookie-consent";
import { useDropzone } from "react-dropzone";
import * as ReactGA from "react-ga4";
import Animate from "./hooks/Animation";
import AppContext from "./hooks/createContext";
import SegmentOptions from "./SegmentOptions";
import "../../assets/stylesheets/canvasStyles.css"
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setBrushSize, setBrushToolMode, setIsBrushMaskApplied, setLoading, setMagicRemovedImage, setMagicReplacedImage, setUploadImageSrc } from "../../features/canvas/canvasSlice";
import { ReduxStateType } from "../../types/reduxTypes";
import { loading } from "../../assets/defaultStrings";
import { magicRemoveAPI, magicReplaceAPI } from "../../services/APIservice";
import React from "react";
import KrutLoaderModal from "../KrutLoaderModal";

interface SegmentDrawerProps {
  handleResetState: () => void;
  handleResetInteraction: (flag?: boolean) => void;
  handleUndoInteraction: () => void;
  handleRedoInteraction: () => void;
  handleCreateSticker: () => void;
  handleMagicErase: () => void;
  handleImage: (img?: HTMLImageElement) => void;
  handleMultiMaskMode: () => void;
  userNegClickBool: [
    userNegClickBool: boolean,
    setUserNegClickBool: (e: boolean) => void
  ];
  showGallery: [showGallery: boolean, setShowGallery: (e: boolean) => void];
  hasClicked: boolean;
  handleSelectedImage: (
    data: File | URL,
    options?: { shouldDownload?: boolean; shouldNotFetchAllModel?: boolean }
  ) => void;
}

const SegmentDrawer = ({
  handleResetState,
  handleResetInteraction,
  handleUndoInteraction,
  handleRedoInteraction,
  handleCreateSticker,
  handleMagicErase,
  handleImage,
  handleMultiMaskMode,
  userNegClickBool: [userNegClickBool, setUserNegClickBool],
  showGallery: [showGallery, setShowGallery],
  hasClicked,
  handleSelectedImage,
}: SegmentDrawerProps) => {
  const {
    isModelLoaded: [isModelLoaded, setIsModelLoaded],
    segmentTypes: [segmentTypes, setSegmentTypes],
    isLoading: [isLoading, setIsLoading],
    isErased: [isErased, setIsErased],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
    stickers: [stickers, setStickers],
    maskImg,
    image: [image, setImage],
    activeSticker: [activeSticker, setActiveSticker],
    didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation],
    isAllAnimationDone: [isAllAnimationDone, setIsAllAnimationDone],
    isToolBarUpload: [isToolBarUpload, setIsToolBarUpload],
  } = useContext(AppContext)!;

  const [uploadClick, setUploadClick] = useState<boolean>(true);
  const [visibleClickHover, setVisibleClickHover] = useState<boolean>(false);
  const [visibleBoxHover, setVisibleBoxHover] = useState<boolean>(false);
  const [visibleAllHover, setVisibleAllHover] = useState<boolean>(false);
  const [visibleStickerHover, setVisibleStickerHover] =
    useState<boolean>(false);
  const [isCutOut, setIsCutOut] = useState<boolean>(false);
  const handleStickerClick = (i: number) => {
    setActiveSticker(i);
  };
  const [error, setError] = useState<string>("");
  const [isClickCollapsed, setIsClickCollapsed] = useState(true);
  const [isBoxCollapsed, setIsBoxCollapsed] = useState(true);
  const [isAllCollapsed, setIsAllCollapsed] = useState(true);
  const [isCutOutCollapsed, setIsCutOutCollapsed] = useState(true);
  const [isClickMounted, setIsClickMounted] = useState(false);
  const [isBoxMounted, setIsBoxMounted] = useState(false);
  const [isAllMounted, setIsAllMounted] = useState(false);
  const [isCutOutMounted, setIsCutOutMounted] = useState(false);
  let clickTimeout: string | number | NodeJS.Timeout | undefined,
    boxTimeout: string | number | NodeJS.Timeout | undefined,
    allTimeout: string | number | NodeJS.Timeout | undefined,
    cutOutTimeout: string | number | NodeJS.Timeout | undefined;

  // setIsClickMounted(false)
  // setIsBoxMounted(false)
  // setIsAllMounted(false)
  // setIsCutOutMounted(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    onDrop: (acceptedFile) => {
      try {
        if (acceptedFile.length === 0) {
          setError("File not accepted! Try again.");
          return;
        }
        if (acceptedFile.length > 1) {
          setError("Too many files! Try again with 1 file.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          handleSelectedImage(acceptedFile[0]);
        };
        reader.readAsDataURL(acceptedFile[0]);
      } catch (error) {
        console.log(error);
      }
    },
    maxSize: 50_000_000,
  });

  const remove = "Remove";
  const replace = "Replace";
  const [magicTool, setMagicTool] = useState(remove);
  const [prompt, setPrompt] = useState("");
  const [isBrushSelected, setIsBrushSelected] = useState(false);
  const dispatch = useDispatch()
  const [CurrentMask, setCurrentMask] = useState<string | null>(null);
  const { brushSize, maskImage, uploadedImage, isBrushToolMode, isBrushMaskApplied, isLoadingState } = useSelector((state: ReduxStateType) => state?.canvas);

  //update the mask when redux mask changes
  useEffect(() => {
    setCurrentMask(maskImage);
  }, [maskImage])

  // when brush is selected
  useEffect(() => {
    if (!isBrushSelected) {
      dispatch(setBrushToolMode(false));
      return
    };
    handleResetInteraction(true);
    setIsCutOut(false);
    setIsClickCollapsed(true);
    setIsBoxCollapsed(true);
    setIsAllCollapsed(true);
    setIsCutOutCollapsed(true);
    setIsAllMounted(false);
    setIsClickMounted(false);
    setIsBoxMounted(false);
    setIsCutOutMounted(false);
    setIsMultiMaskMode(false);
    setDidShowAMGAnimation(false);
    setSegmentTypes("Brush");
    dispatch(setBrushToolMode(true));
  }, [isBrushSelected])


  function downloadCutout(url: string) {
    const base64Data = url.split(',')[1];             // Extracting the base64 data
    const blob = b64toBlob(base64Data, 'image/png');  // Creating a blob from the base64 data
    const a = document.createElement('a');            // Creating a download link
    a.href = URL.createObjectURL(blob);
    a.download = 'cutout.png';

    document.body.appendChild(a);                     // Initiating the download
    a.click();
    document.body.removeChild(a);
  }

  // Function to convert base64 to blob
  function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  //--- Magic Remove / Magic Replace API ----------
  async function magicRemoveHelper() {
    if (isBrushToolMode) {
      if (!isBrushMaskApplied) return toast.error("Please click on apply brush mask button on canvas");
    }
    const mask_image = CurrentMask;
    const init_image = uploadedImage;

    // console.log(init_image) //test
    // console.log(mask_image) //test

    if (!init_image) return toast.error("Please upload an image");
    if (!mask_image) return toast.error("mask image not found");

    dispatch(setLoading(loading));  // set loading status in redux

    let dataURL = "";

    if (magicTool === remove) {
      //---- Magic Remove -----
      const response = await magicRemoveAPI({
        init_image, mask_image
      })
      dataURL = response?.data?.images
      dispatch(setMagicRemovedImage(dataURL)) //Save image in Redux

    } else {
      //---- Magic Replace -----
      if (!prompt) return toast.error("Please provide a prompt to replace")
      const response = await magicReplaceAPI({
        init_image, mask_image, prompt
      })
      dataURL = response?.data?.images
      dispatch(setMagicReplacedImage(dataURL)) //Save image in Redux
    }

    if (dataURL) {
      const img = new Image();
      img.src = dataURL;
      img.onload = () => {
        // Set to the original image width and height
        img.width = image?.width || 0;
        img.height = image?.height || 0;
        setImage(img);
        dispatch(setUploadImageSrc(dataURL)) //update redux upload image state
        handleResetInteraction(true);
        dispatch(setIsBrushMaskApplied(false));
      };
    }
    dispatch(setLoading(null));  // set loading status in redux

  }


  //===========================================================================================================================================

  return (
    <div className="text-start overflow-y-scroll">

      <section className="flex-col hidden pt-[6%] md:flex start-0 w-[335px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center py-[24px] px-[16px]">

        <div className="p-2 pb-2">
          <h4 className="font-bold text-base">Magic Tool</h4>
          <div className="text-center mt-2">
            <p className="text-xs font-medium text-[#667085]">Eliminate or Swap unwanted objects and fix imperfections instantly and accurately </p>
          </div>
        </div>

        {/* =========  upload image button ========= */}
        {uploadClick &&
          <button type="submit" className="w-full py-2  bg-violetBg my-5 text-white rounded-lg zoomEffect hover:bg-violetTxt focus:outline-none"
            onClick={() => { setShowGallery(true); setIsCutOut(false); setIsToolBarUpload(true); }}>

            <h5 {...getRootProps()} className=" text-white text-center focus:outline-none">
              <input {...getInputProps()} />
              Upload Image <span className="text-white font-bold focus:outline-none"> +</span>
            </h5>

          </button>
        }


        {/* =========== Magic remove / replace selector =========== */}

        <div className="my-2 mb-8">
          <button className={magicTool === remove ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
            "py-1.5 cursor-pointer w-1/2"} onClick={() => setMagicTool(remove)}>
            <h5 className="text-[#344054] font-medium">Magic Remove</h5>
          </button>

          <button className={magicTool === replace ? "py-1.5 w-1/2 border-2 border-t-0 border-x-0 border-violetBg" :
            "py-1.5 cursor-pointer w-1/2"} onClick={() => setMagicTool(replace)}>
            <h5 className="text-[#344054] font-medium">Magic Replace</h5>
          </button>
        </div>


        {/* ======= Click and Select Tool ========== */}
        <div
          onClick={() => {
            segmentTypes !== "Click" && handleResetInteraction();
            getCookieConsentValue("sa_demo") === "true" &&
              ReactGA.default.send({
                category: "event",
                action: "is_click",
              });
            clearTimeout(clickTimeout);
            setIsMultiMaskMode(false);
            setSegmentTypes("Click");
            setIsCutOut(false);
            setDidShowAMGAnimation(false);
            setIsBrushSelected(false);
          }}
          className={`transition-all overflow-hidden pb-2 mb-3 ${segmentTypes !== "Click" &&
            (isClickCollapsed ? "max-h-[40px]" : "max-h-[85px]")
            } px-3 py-2 cursor-pointer rounded-lg ${segmentTypes === "Click"
              ? "border-violetBg border-[1.5px] min-h-[250px]"
              : "border-[1.5px] border-gray-200 min-h-[45px]"
            } ${isCutOut && "hidden"}`}
          onMouseEnter={() => {
            clearTimeout(clickTimeout);
            clickTimeout = setTimeout(() => {
              setIsClickCollapsed(false);
              setVisibleClickHover(true);
              setIsClickMounted(!isClickMounted);
            }, 700);
          }}
          onMouseLeave={() => {
            setIsClickCollapsed(true);
            setIsBoxCollapsed(true);
            setIsAllCollapsed(true);
            setIsCutOutCollapsed(true);
            // setVisibleClickHover(false);
            clearTimeout(clickTimeout);
            setIsClickMounted(false);
            setIsBoxMounted(false);
            setIsAllMounted(false);
            setIsCutOutMounted(false);
          }} >

          <div className="flex items-center">
            <span className="text-sm text-[#344054] flex items-center">
              <span className="material-symbols-outlined px-1 text-xl">arrow_selector_tool</span>
              Click the area
            </span>
          </div>

          {segmentTypes !== "Click" && visibleClickHover && (
            <Animate isMounted={isClickMounted}>
              <p className="my-3 text-[11px] opacity-70">
                Click an object one or more times.
              </p>
            </Animate>
          )}
          {segmentTypes === "Click" && (
            <p className={`my-3 text-[11px] text-violetTxt opacity-70`}>
              Click an object one or more times.
            </p>
          )}
          <div className="flex justify-between mx-5 my-3">
            <div onClick={() => setUserNegClickBool(false)} className="flex flex-col items-center"  >

              <p className={`w-8 h-8 text-3xl leading-7 text-center align-middle rounded mb-1 ${userNegClickBool
                ? "outline outline-1 outline-violetTxt text-violetTxt" : "bg-violetBg"}`} >
                <button>
                  <span className={`material-symbols-outlined p-1 ${userNegClickBool ? "text-violetTxt" : "text-white"}`}> add_circle </span>
                </button>
              </p>
              <p
                className={`text-xs font-bold ${!userNegClickBool && "text-violetTxt"
                  }`}   >
                Add Mask
              </p>
            </div>

            <div onClick={() => setUserNegClickBool(true)}
              className={`flex flex-col items-center ${!hasClicked ? "disabled" : ""
                }`} >
              <p className={`w-8 h-8 text-3xl leading-6 text-center align-middle rounded mb-1 ${userNegClickBool
                ? "bg-violetTxt text-white"
                : "outline outline-1 outline-violetTxt text-violetTxt"
                }`}  >
                <button>
                  <span className={`material-symbols-outlined p-1  ${userNegClickBool ? "text-white" : "text-violetTxt"}`}> do_not_disturb_on </span>
                </button>
              </p>
              <p className={`text-xs font-bold ${userNegClickBool && "text-violetBg"}`}   >
                Remove Area
              </p>
            </div>
          </div>
          {segmentTypes === "Click" && (
            <SegmentOptions
              handleResetInteraction={handleResetInteraction}
              handleUndoInteraction={handleUndoInteraction}
              handleRedoInteraction={handleRedoInteraction}
              handleCreateSticker={handleCreateSticker}
              handleMagicErase={handleMagicErase}
              handleImage={handleImage}
              hasClicked={hasClicked}
              isCutOut={[isCutOut, setIsCutOut]}
              handleMultiMaskMode={handleMultiMaskMode}
            />
          )}
        </div>


        {/* ================ Box Tool ================= */}
        <div onClick={() => {
          segmentTypes !== "Box" && handleResetInteraction(true);
          getCookieConsentValue("sa_demo") === "true" &&
            ReactGA.default.send({
              category: "event",
              action: "is_box",
            });
          clearTimeout(boxTimeout);
          setIsMultiMaskMode(false);
          setSegmentTypes("Box");
          setIsCutOut(false);
          setDidShowAMGAnimation(false);
          setIsBrushSelected(false);
        }}
          className={`transition-all overflow-hidden mb-3 ${segmentTypes !== "Box" &&
            (isBoxCollapsed ? "max-h-[40px]" : "max-h-[85px]")
            } my-2 rounded-lg px-4 py-2 cursor-pointer ${segmentTypes === "Box"
              ? "border-violetTxt border-[1.5px] min-h-[250px]"
              : "border-[1.5px] border-gray-200 min-h-[45px]"
            } ${isCutOut && "hidden"}`}
          onMouseEnter={() => {
            clearTimeout(boxTimeout);
            boxTimeout = setTimeout(() => {
              setIsBoxCollapsed(false);
              setVisibleBoxHover(true);
              setIsBoxMounted(true);
            }, 700);
          }}
          onMouseLeave={() => {
            setIsClickCollapsed(true);
            setIsBoxCollapsed(true);
            setIsAllCollapsed(true);
            setIsCutOutCollapsed(true);
            // setVisibleBoxHover(false);
            clearTimeout(boxTimeout);
            setIsClickMounted(false);
            setIsBoxMounted(false);
            setIsAllMounted(false);
            setIsCutOutMounted(false);
          }} >
          <div className="flex items-center">
            <span className="text-sm text-[#344054] flex items-center">
              <span className="material-symbols-outlined px-1 text-xl">variable_add</span>
              Box
            </span>
          </div>
          {segmentTypes !== "Box" && visibleBoxHover && (
            <Animate isMounted={isBoxMounted}>
              <p className="my-3 text-xs opacity-70">
                Roughly draw a box around an object.
              </p>
            </Animate>
          )}
          {segmentTypes === "Box" && (
            <p className={`my-3 text-xs text-violetTxt opacity-70`}>
              Roughly draw a box around an object.
            </p>
          )}
          <div className="flex justify-between mx-5 my-3">
            <div onClick={() => setUserNegClickBool(false)} className="flex flex-col items-center" >
              <p className={`w-8 h-8 text-3xl leading-7 text-center align-middle rounded mb-1 ${userNegClickBool
                ? "outline outline-1 outline-violetTxt text-violetTxt"
                : "bg-violetBg text-white"
                }`}  >
                <button>
                  <span className={`material-symbols-outlined p-1 ${userNegClickBool ? "text-violetTxt" : "text-white"}`}> add_circle </span>
                </button>
              </p>
              <p className={`text-xs font-bold ${!userNegClickBool && "text-violetBg"
                }`}  >
                Add Mask
              </p>

            </div>

            <div onClick={() => setUserNegClickBool(true)} className={`flex flex-col items-center ${!hasClicked ? "disabled" : ""}`} >
              <p className={`w-8 h-8 text-3xl leading-6 text-center align-middle rounded mb-1 ${userNegClickBool
                ? "bg-violetBg text-white"
                : "outline outline-1 outline-violetTxt text-violetTxt"
                }`}  >
                <button>
                  <span className={`material-symbols-outlined p-1  ${userNegClickBool ? "text-white" : "text-violetTxt"}`}> do_not_disturb_on </span>
                </button>
              </p>
              <p className={`text-xs font-bold ${userNegClickBool && "text-violetBg"}`}  >
                Remove Area
              </p>
            </div>
          </div>
          {segmentTypes === "Box" && (
            <SegmentOptions
              handleResetInteraction={handleResetInteraction}
              handleUndoInteraction={handleUndoInteraction}
              handleRedoInteraction={handleRedoInteraction}
              handleCreateSticker={handleCreateSticker}
              handleMagicErase={handleMagicErase}
              handleImage={handleImage}
              hasClicked={hasClicked}
              isCutOut={[isCutOut, setIsCutOut]}
              handleMultiMaskMode={handleMultiMaskMode}
            />
          )}
        </div>


        {/* ======== Brush Tool ============= */}

        {!isCutOut &&
          <>
            <button className={`p-2 px-3 text-start bg-transparent mt-1 rounded-lg cursor-pointer w-full mb-3 
            ${isBrushSelected ? "border-violetBg border-[1.5px]" : 'border-[1.5px] border-gray-200'}`}>

              <div className="flex justify-between" onClick={() => { setIsBrushSelected(true) }}>
                <span className="text-sm text-[#344054] flex items-center">
                  <span className="material-symbols-outlined px-1 font-light text-xl">brush</span>
                  Brush
                </span>

                {/* <span className={isBrushSelected ? "material-symbols-outlined rotate-180" : "material-symbols-outlined"}> expand_more </span> */}
              </div>

              {segmentTypes === "Brush" && (
                <p className={`my-3 text-xs text-violetTxt opacity-70 text-center`}>
                  Paint the area you wish to modify.
                </p>
              )}

              {isBrushSelected && <>
                <div className="mt-3">
                  <div className="flex justify-between">
                    <label htmlFor="brushSize" className="mb-1 text-xs text-[#475467]">Brush Size</label>
                    <h5 className="text-start font-medium mb-1 text-xs text-violetTxt"> {brushSize} </h5>
                  </div>

                  {/* slider */}
                  <input type="range" id="brushSize" name="brushSize" list="markers" min="1" max="100" className="w-full accent-violetBg border-gray-300 cursor-ew-resize"
                    value={brushSize} onChange={(e) => dispatch(setBrushSize(e.target.value))} />
                </div>

                <div onClick={() => {
                  dispatch(setBrushToolMode(false));
                  setTimeout(() => {
                    dispatch(setBrushToolMode(true));
                  }, 0);
                }} className="text-sm py-2 mt-3 bg-gray-200 rounded-xl text-center"><span className="text-gray-400">Reset</span></div>

              </>}
            </button>
          </>
        }



        {/* ========== select all segments ========= */}
        {/* <div
              onClick={() => {
                segmentTypes !== "All" && handleResetInteraction();
                getCookieConsentValue("sa_demo") === "true" &&
                  ReactGA.default.send({
                    category: "event",
                    action: "is_amg",
                  });
                clearTimeout(allTimeout);
                setSegmentTypes("All");
                setIsCutOut(false);
                setDidShowAMGAnimation(false);
              }}
              className={`transition-all overflow-hidden ${segmentTypes === "All" &&
                isAllAnimationDone === false &&
                "disabled"
                } ${segmentTypes !== "All" &&
                (isAllCollapsed ? "max-h-[40px]" : "max-h-[85px]")
                } my-2 rounded px-4 py-2 cursor-pointer ${segmentTypes === "All"
                  ? "outline-violetTxt outline outline-[1.5px]"
                  : "outline outline-gray-200"
                } ${(!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                "pointer-events-none"
                } ${isCutOut && "hidden"}`}
              onMouseEnter={() => {
                clearTimeout(allTimeout);
                allTimeout = setTimeout(() => {
                  setIsAllCollapsed(false);
                  setVisibleAllHover(true);
                  setIsAllMounted(true);
                }, 700);
              }}
              onMouseLeave={() => {
                setIsClickCollapsed(true);
                setIsBoxCollapsed(true);
                setIsAllCollapsed(true);
                setIsCutOutCollapsed(true);
                // setVisibleAllHover(false);
                clearTimeout(allTimeout);
                setIsClickMounted(false);
                setIsBoxMounted(false);
                setIsAllMounted(false);
                setIsCutOutMounted(false);
              }}
            >
              <div className="flex">
                <Sparkle isActive={true} />
                <span
                  className={`pl-3 font-bold ${segmentTypes === "All" && "text-violetBg"
                    } ${(!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                    "disabled"
                    }`}
                >
                  Everything
                </span>
              </div>
              {segmentTypes !== "All" && visibleAllHover && (
                <Animate isMounted={isAllMounted}>
                  <p
                    className={`text-xs my-3 opacity-70 ${(!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                      "disabled"
                      }`}
                  >
                    Find all the objects in the image automatically.
                  </p>
                </Animate>
              )}
              {segmentTypes === "All" && (
                <p
                  className={`text-xs my-3 opacity-70 text-violetTxt ${(!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                    "disabled"
                    }`}
                >
                  Find all the objects in the image automatically.
                </p>
              )}
              {segmentTypes === "All" && (
                <SegmentOptions
                  handleResetInteraction={handleResetInteraction}
                  handleUndoInteraction={handleUndoInteraction}
                  handleRedoInteraction={handleRedoInteraction}
                  handleCreateSticker={handleCreateSticker}
                  handleMagicErase={handleMagicErase}
                  handleImage={handleImage}
                  hasClicked={hasClicked}
                  isCutOut={[isCutOut, setIsCutOut]}
                  handleMultiMaskMode={handleMultiMaskMode}
                />
              )}
            </div> */}


        {/* ==========   CutOuts List ========= */}
        <div
          onClick={(e) => {
            clearTimeout(cutOutTimeout);
            setIsMultiMaskMode(false);
            setIsCutOut(true);
            setUploadClick(false);
            setIsBrushSelected(false)
            getCookieConsentValue("sa_demo") === "true" &&
              ReactGA.default.send({
                category: "event",
                action: "is_cutout",
              });
          }}
          className={`transition-all overflow-hidden my-2 rounded-lg px-4 py-2 cursor-pointer ${isCutOut
            ? "border-violetTxt border-[1.5px]"
            : "border-[1.5px] border-gray-200 min-h-[45px]"
            }`}
          onMouseEnter={() => {
            clearTimeout(cutOutTimeout);
            cutOutTimeout = setTimeout(() => {
              setIsCutOutCollapsed(false);
              setVisibleStickerHover(true);
              setIsCutOutMounted(true);
            }, 700);
          }}
          onMouseLeave={() => {
            setIsClickCollapsed(true);
            setIsBoxCollapsed(true);
            setIsAllCollapsed(true);
            setIsCutOutCollapsed(true);
            clearTimeout(cutOutTimeout);
            // setVisibleStickerHover(false);
            setIsClickMounted(false);
            setIsBoxMounted(false);
            setIsAllMounted(false);
            setIsCutOutMounted(false);
          }} >
          <div className={`flex items-center ${isCutOut === false &&
            (isCutOutCollapsed ? "max-h-[40px]" : "max-h-[2048px]")
            }`} >
            <span className="material-symbols-outlined px-1 font-light text-xl">ar_stickers</span>
            <span className={`text-xs ${isCutOut && "text-xs"}`}>
              Cut-Outs
            </span>
            {isCutOut && (
              <button
                className="ml-auto text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCutOut(false);
                  setSegmentTypes("Click");
                  setUploadClick(true);
                }}
              >
                Close
              </button>
            )}
          </div>
          {isCutOut === false && visibleStickerHover && (
            <Animate isMounted={isCutOutMounted}>
              {/* <p className="my-2 text-xs opacity-70">See Cut-outs</p> */}
            </Animate>
          )}
          {isCutOut && (
            <>
              <Animate isMounted={isCutOut}>
                <p className="my-1 text-xs text-violetTxt">See Cut-outs</p>
                <div className={`overflow-y-auto ${magicTool === remove ? "h-[52vh]" : "h-[42vh]"} text-center px-4`}>
                  {stickers.map((el: HTMLCanvasElement, i) => (
                    <div className="border rounded mb-1" key={i}>

                      <div className="flex w-full justify-end">
                        <button className="Btn relative z-10" onClick={() => downloadCutout(el.toDataURL())}>
                          <svg className="svgIcon" viewBox="0 0 384 512" height="0.5em" xmlns="http://www.w3.org/2000/svg"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"></path></svg>
                          <span className="icon2"></span>
                          <span className="tooltip z-50">Download</span>
                        </button>
                      </div>

                      <img className={`sticker m-5 max-w-[75%] max-h-20 md:max-h-24 lg:max-h-28 xl:max-h-32 cursor-pointer inline hover:opacity-100 ${i === activeSticker ? "sticker-select" : ""
                        }`}
                        alt="sticker"
                        src={el.toDataURL()}
                        onClick={(e) => handleStickerClick(i)}
                      />

                    </div>
                  ))}
                  <br />
                </div>
              </Animate>
            </>
          )}
        </div>

        <br />

        {magicTool === replace && <div className="mt-4 text-start mb-1">
          <label htmlFor="prompt" className="text-sm font-medium text-[#667085]">Write a prompt for image replacement</label>
          <textarea name="prompt" id="prompt" placeholder="Enter prompt here.."
            className="block w-full ps-2 rounded-lg border-0 py-2 mt-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6" onChange={(e) => setPrompt(e?.target?.value)} />
        </div>}

        <button className="w-full py-2 bg-violetBg my-8 text-white rounded-lg zoomEffect hover:bg-violetTxt cursor-pointer"
          onClick={magicRemoveHelper}>{magicTool}</button>
      </section>

       {/* loading spinner */}
       <KrutLoaderModal isLoading={isLoadingState} />
    </div>
  );
};

export default SegmentDrawer;
