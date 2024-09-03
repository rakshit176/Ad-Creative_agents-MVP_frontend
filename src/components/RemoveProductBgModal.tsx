// @ts-nocheck
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { addImage } from '../services/canvasMethods';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStateType } from '../types/reduxTypes';
import toast from 'react-hot-toast';
import { detailed, loading } from '../assets/defaultStrings';
import { bgRemoveAPI } from '../services/APIservice';
import { setLoading } from '../features/canvas/canvasSlice';
import KrutLoader from './KrutLoader';

function RemoveProductBgModal() {
    const [uploadedImage, setUploadedImage] = useState<null | ArrayBuffer | string>(null);
    const { editor, isLoadingState } = useSelector((state: ReduxStateType) => state.canvas);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleFileUpload = (event: { target: { files: any[]; }; }) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const maxRes = 3000;
                if (img.width > maxRes || img.height > maxRes) {
                    toast.error("Upload a smaller image. Maximum resolution is 3000x3000.");
                } else {
                    setUploadedImage(e.target.result ? e.target.result : null);
                    setModalIsOpen(true); // Open the modal after image upload
                }
            };
        }
        reader.readAsDataURL(file);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        dispatch(setLoading(null));
    }, [])


    const removeBgHelper = async () => {
        //Remove background API call
        if (!uploadedImage) return toast.error("Please upload an image");
        const removalType = detailed

        dispatch(setLoading(loading));  // set loading status in redux
        const response = await bgRemoveAPI({
            init_image: uploadedImage,
            rm_type: removalType,
        })

        if (response?.data?.images) {
            const image = response.data.images;
            addImage(image, editor);
        }

        dispatch(setLoading(null));  // set loading status in redux
        closeModal(); // Close the modal after deleting the image
    };

    function handleSkip(): void {
        addImage(uploadedImage, editor);
        closeModal();
    }

    return (
        <>
            <div className="h-[100px] bg-white flex items-center justify-center rounded-md border border-dashed border-gray-300">
                {/* upload image section */}
                <div className="flex-col">
                    <h5 className="text-[#475467]">Upload files here</h5>
                    <button
                        className="w-full py-1.5  bg-violetBg my-2 text-white rounded-lg hover:bg-violetTxt cursor-pointer"
                        onClick={() => {
                            const inputElement = document.createElement('input');
                            inputElement.type = 'file';
                            inputElement.accept = 'image/*';
                            inputElement.addEventListener('change', (e) => handleFileUpload(e));
                            inputElement.click();
                        }}>
                        Upload file <span className="text-white font-bold">+</span>
                    </button>
                </div>
            </div>

            {/* Modal to display uploaded image */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Product Image"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        width: '30%',
                        height: '50%',
                        margin: 'auto',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '12px'
                    }
                }} >

                {!isLoadingState ? <>
                    <h4 className='mb-4'>Remove Background</h4>
                    {uploadedImage && (
                        <div className="image-container border rounded-xl p-3">
                            <img src={uploadedImage} alt="Uploaded" className='max-w-full max-h-full' />
                        </div>
                    )}
                    <div className='w-full flex justify-center my-6 space-x-4'>
                        <button onClick={handleSkip} className='py-1.5 w-[7rem] bg-gray-200 my-2 rounded-lg hover:bg-gray-300 cursor-pointer'>Skip</button>
                        <button onClick={removeBgHelper} className='py-1.5 w-[7rem] bg-violetBg my-2 text-white rounded-lg hover:bg-violetTxt cursor-pointer'>Remove</button>
                    </div>
                </> :
                    //loading spinner
                    <div className="container-fluid">
                        <div className="flex w-full h-full items-center justify-center">
                            <div className="w-36">
                                <KrutLoader />
                            </div>
                        </div>
                    </div>
                }

            </Modal>
        </>
    );
}

export default RemoveProductBgModal;
