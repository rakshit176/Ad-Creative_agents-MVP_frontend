import { useContext, useState } from "react";
import AppContext from "./hooks/createContext";
import Modal from "react-modal";
import "../../assets/stylesheets/spinnerLoader.css"
import KrutLoader from "../KrutLoader";

interface LoadingModalProps {
  handleResetState: () => void;
}

const LoadingModal = ({ handleResetState }: LoadingModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true); // State variable for modal visibility

  const {
    showLoadingModal: [showLoadingModal, setShowLoadingModal],
    image: [image, setImage],
    isErasing: [isErasing, setIsErasing],
    eraserText: [eraserText, setEraserText],
  } = useContext(AppContext)!;

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <>
      {showLoadingModal && (

        <Modal isOpen={isModalOpen || showLoadingModal} onRequestClose={closeModal} ariaHideApp={false}
          style={{
            content: {
              borderRadius: '8px',
              border: '0px',
              height: '380px',
              width: '600px',
              margin: 'auto',
              background:"transparent"
            }
          }}
        >
          <div className="modal modal-open">
            <div className="flex flex-col items-center justify-center h-72 modal-box">
              <div className="flex">
                {/* <img className="object-contain w-10 mr-3" src={image?.src} />
                <img className="mr-3" src="../assets/arrow-icn.svg" /> */}

                {/* ==== Loading Spinner ===== */}
                <div className="w-36">
                  <KrutLoader />
                </div>
               
                {/* <img className="mr-3" src="../assets/arrow-icn.svg" />
                <img src="../assets/stack.svg" /> */}
              </div>
              <p className="py-4 text-sm md:text-lg">
                {isErasing &&
                  eraserText.isEmbedding &&
                  "Re-extracting embedding on the erased image"}
                {isErasing &&
                  eraserText.isErase &&
                  "Masks can be fed into other open source models"}
                {!isErasing && "Loading ..."}
              </p>
              {/* <div className="loading-bar"></div> */}
              <button
                className="pt-2 text-sm"
                onClick={() => { handleResetState(); closeModal() }}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default LoadingModal;
