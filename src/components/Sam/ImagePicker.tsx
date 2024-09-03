import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import AppContext from "./hooks/createContext";
import MagicTool from "../SidebarSections/MagicTool";

export interface ImagePickerProps {
  handleSelectedImage: (
    data: File | URL,
    options?: { shouldDownload?: boolean; shouldNotFetchAllModel?: boolean }
  ) => void;
  showGallery: [showGallery: boolean, setShowGallery: (e: boolean) => void];
}

const ImagePicker = ({
  handleSelectedImage,
}: ImagePickerProps) => {
  const [error, setError] = useState<string>("");
  const [isLoadedCount, setIsLoadedCount] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const {
    enableDemo: [, setEnableDemo],
  } = useContext(AppContext)!;

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

  return (
    <div className="w-[100%]">

      <div className="flex">

        <section className="start-0 w-[335px] h-[94.3vh] border-l-0 border border-y-0 space-y-4 text-center bg-toolPalette py-[24px] px-[16px] overflow-y-auto">
          
          <h4 className="my-1 font-bold text-base">Magic Tool</h4>
          <MagicTool />

        </section>


        <div className="pt-6 mx-10 w-[75%] h-[30vh] m-20 bg-toolPalette border border-dashed border-violetTxt rounded-md
    flex justify-center items-center
    " {...getRootProps()}>
          {/*!enableDemo && <StarterModal />*/}
          <div className="flex flex-row py-5 text-sm align-middle md:text-lg">
            <span>Drag & Drop files here, or</span>
            <input {...getInputProps()} />
            <button className="ml-1 text-violetTxt underline">  Upload  </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImagePicker;
