import { useState } from "react";
import Modal from "react-modal";
import { useCookies } from "react-cookie";

const PointsModal = () => {
  const [toggle, setToggle] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["sa-mask-info"]);
  const [isModalOpen, setIsModalOpen] = useState(true); // State variable for modal visibility


  if (cookies["sa-mask-info"]) return null;

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}
      style={{
        content: {
          borderRadius: '10px',
          height: '505px',
          width: '720px',
          margin: 'auto',
        }
      }}
    >
      <div className={`modal ${toggle && "modal-open"}`}>
        <div className="w-full modal-box">
          <div className="flex flex-row justify-between mb-4 text-sm">
            <span>How to use the selection tool</span>
            <span>
              <a
                href="#"
                className="font-semibold text-violetTxt cursor-pointer"
                onClick={() => {
                  setCookie("sa-mask-info", "true");
                  setToggle(false);
                  closeModal();
                }}
              >
                Close
              </a>
            </span>
          </div>

          <div className="flex w-full justify-evenly">
            <div className="flex-row">
              <video src="https://krut-ai-assets.s3.amazonaws.com/videos/magic_remove.mp4" autoPlay loop playsInline className="h-[300px] rounded-[10px] mt-5" />
              <div className="w-full text-center text-sm">Magic Remove</div>
            </div>
            <div className="flex-row">
            <video src="https://krut-ai-assets.s3.amazonaws.com/videos/magic_replace.mp4" autoPlay loop playsInline className="h-[300px] rounded-[10px] mt-5" />
              <div className="w-full text-center text-sm">Magic Replace</div>
            </div>
          </div>

          <h3 className="my-2 text-xl font-semibold mt-5">Add and subtract areas</h3>
          <p>
            Mask areas by adding points. Select <b>Add Area</b>, then select the
            object. Refine the mask by selecting <b>Remove Area</b>, then select
            the area.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default PointsModal;
