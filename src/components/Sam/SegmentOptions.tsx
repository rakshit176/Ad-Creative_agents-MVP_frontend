import React, { useContext } from "react";
import AppContext from "./hooks/createContext";

interface SegmentOptionsProps {
  handleResetInteraction: () => void;
  handleUndoInteraction: () => void;
  handleRedoInteraction: () => void;
  handleCreateSticker: () => void;
  handleMagicErase: () => void;
  handleImage: (img?: HTMLImageElement) => void;
  hasClicked: boolean;
  isCutOut: [isCutOut: boolean, setIsCutOut: (e: boolean) => void];
  handleMultiMaskMode: () => void;
}

const SegmentOptions = ({
  handleResetInteraction,
  handleUndoInteraction,
  handleRedoInteraction,
  handleCreateSticker,
  handleMagicErase,
  handleImage,
  hasClicked,
  isCutOut: [isCutOut, setIsCutOut],
  handleMultiMaskMode,
}: SegmentOptionsProps) => {
  const {
    isModelLoaded: [isModelLoaded, setIsModelLoaded],
    segmentTypes: [segmentTypes, setSegmentTypes],
    isLoading: [isLoading, setIsLoading],
    isErased: [isErased, setIsErased],
    svg: [svg, setSVG],
    clicksHistory: [clicksHistory, setClicksHistory],
    image: [image],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
    svgs: [svgs, setSVGs],
    clicks: [clicks, setClicks],
    showLoadingModal: [showLoadingModal, setShowLoadingModal],
    didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation],
  } = useContext(AppContext)!;
  return (
    <>
      <div
        className={`flex justify-between px-4 py-2 my-2 text-sm bg-gray-200 rounded-xl opacity-70 ${segmentTypes === "All" && "hidden"
          } ${isCutOut && "hidden"}`}
      >
        <button
          onClick={() => {
            if (isErased) {
              setIsErased(false);
              setIsLoading(true);
              handleImage();
            }
            setSegmentTypes("Click");
            handleResetInteraction();
          }}
          className={`${((!svg && !svgs && !isErased) || segmentTypes === "All") &&
            "disabled"
            }`}
        >
          Reset
        </button>
        <button
          onClick={handleUndoInteraction}
          className={`${(!svg || segmentTypes === "All" || isMultiMaskMode) && "disabled"
            }`}
        >
          Undo
        </button>
        <button
          onClick={handleRedoInteraction}
          className={`${(!clicksHistory?.length || segmentTypes === "All") && "disabled"
            }`}
        >
          Redo
        </button>
      </div>
      <div
        className={`flex flex-col gap-3 py-3 pl-3 text-sm bg-gray-200 cursor-pointer rounded-xl ${hasClicked &&
          "bg-gradient-to-r from-gray-200 to-blue-400/30 background-animate"
          } ${isCutOut && "hidden"}`}
      >
        {/* {segmentTypes === "Click" && (
          <button
            onClick={() => {
              handleMultiMaskMode();
              setDidShowAMGAnimation(false);
            }}
            className="flex opacity-70"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="1"
                y="1"
                width="12"
                height="12"
                rx="2"
                fill="#DEE3E9"
                stroke={isMultiMaskMode ? "#5856d6" : "#1C2A33"}
                strokeWidth="2"
              />
              <rect
                x="4"
                y="4"
                width="12"
                height="12"
                rx="2"
                fill="#DEE3E9"
                stroke={isMultiMaskMode ? "#5856d6" : "#1C2A33"}
                strokeWidth="2"
              />
              <rect
                x="7"
                y="7"
                width="12"
                height="12"
                rx="2"
                fill="#DEE3E9"
                stroke={isMultiMaskMode ? "#5856d6" : "#1C2A33"}
                strokeWidth="2"
              />
            </svg>

            <span
              className={`pl-2 opacity-70 font-bold ${
                isMultiMaskMode && "text-violetTxt "
              }`}
            >
              Multi-mask
            </span>
          </button>
        )} */}
        {/* <button
          className={`flex ${!svg && "disabled"} ${
            segmentTypes === "All" && "hidden"
          }`}
          onClick={() => {
            handleMagicErase();
            setShowLoadingModal(true);
          }}
        >
          <img src="assets/erase.svg" />
          <span className="pl-2 opacity-70">Erase Object</span>
        </button> */}
        <button
          className={`flex ${!svg && segmentTypes !== "All" && "disabled"} `}
          onClick={(e) => {
            handleCreateSticker();
            e.stopPropagation();
            setIsCutOut(true);
          }} >
          <span className="material-symbols-outlined text-base"> cut </span>
          <span className="pl-2 opacity-70">
            {segmentTypes === "All" ? "Cut out all objects" : "Cut out object"}
          </span>
        </button>
      </div>
    </>
  );
};

export default SegmentOptions;
