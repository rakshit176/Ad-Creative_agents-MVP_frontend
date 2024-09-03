import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal"

function ReferUser() {
    const [isModalOpen, setIsModalOpen] = useState(false); // State variable for modal visibility
    const [fullName, setFullName] = useState('');
    const [company, setCompany] = useState('');
    const [email, setEmail] = useState('');
    const [industry, setIndustry] = useState('');
    const [phone, setPhone] = useState('');

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    function referUserHelper() {
        if (!fullName || !email || !phone) {
            return toast.error("Missing required fields");
        }

        // Referral implementation


        toast.success("Referral Sent");
        closeModal();
    }


    return (
        <>
            <div className="mx-2 sm:mx-12 bg-white px-10 py-2.5 text-start flex items-center rounded-lg shadow-lg cursor-pointer rounded-t-none"
                onClick={() => setIsModalOpen(true)}>
                <span className="material-symbols-outlined pe-2  text-gray-500">person_add </span>
                <p className="text-base font-normal pe-2 mb-0 py-1.5"> Refer a friend</p>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}
                style={{
                    content: {
                        borderRadius: '15px',
                        height: '650px',
                        width: '600px',
                        margin: 'auto',
                    }
                }}
            >
                <div className="w-full text-end cursor-pointer" onClick={closeModal}>
                X
                </div>

                <h3 className="text-center text-2xl py-2 mt-1">Refer a friend</h3>

                <div className="m-4 mt-8">
                    <label htmlFor="fullName" className="mb-3">Full Name<span className="text-red-600">*</span></label>
                    <input name="fullName" id="fullName" type="text" placeholder="Enter First name" className="block w-full ps-2 rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6" value={fullName} onChange={(e) => setFullName(e.target.value.trimEnd())} required />
                </div>

                <div className="m-4">
                    <label htmlFor="companyName" className="mb-3">Company Name</label>
                    <input name="companyName" id="companyName" type="text" placeholder="Enter Company name" className="block w-full ps-2 rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6" value={company} onChange={(e) => setCompany(e.target.value.trimEnd())} />
                </div>

                <div className="m-4">
                    <label htmlFor="email" className="mb-3">Email<span className="text-red-600">*</span></label>
                    <input name="email" id="email" type="email" placeholder="Enter Email address" className="block w-full ps-2 rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6" pattern="^(?=.*[@])(?=.*[.]).{5,}$" value={email} onChange={(e) => setEmail(e.target.value.trimEnd())} required />
                </div>

                <div className="m-4">
                    <label htmlFor="industry" className="mb-3">Industry</label>
                    <input name="industry" id="industry" type="text" placeholder="Enter Industry" className="block w-full ps-2 rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6" value={industry} onChange={(e) => setIndustry(e.target.value.trimEnd())} />
                </div>

                <div className="m-4">
                    <label htmlFor="phone" className="mb-3">Phone<span className="text-red-600">*</span></label>
                    <input name="phone" id="phone" type="text" placeholder="Enter Phone number"
                        className="block w-full ps-2 rounded-md border-0 py-2 mt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6" value={phone} onChange={(e) => setPhone(e.target.value.trimEnd())} required />
                </div>

                <div className="flex justify-center mx-4 mt-10">
                    <button className="w-full h-10 rounded-lg bg-violetBg text-white" onClick={referUserHelper}>Refer Now</button>
                </div>

            </Modal>

        </>
    )
}

export default ReferUser