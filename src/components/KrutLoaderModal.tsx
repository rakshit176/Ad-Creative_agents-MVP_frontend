import React from 'react'
import KrutLoader from './KrutLoader'
import { loading } from '../assets/defaultStrings'
import ReactModal from 'react-modal';

function KrutLoaderModal({isLoading}) {
    return (
        <>
            {/* loading spinner */}
            {isLoading === loading &&

                <ReactModal isOpen={true} ariaHideApp={false}
                    style={{
                        content: {
                            borderRadius: '8px',
                            height: '250px',
                            width: '300px',
                            margin: 'auto',
                            border: '0px',
                            background:"transparent",
                        }
                    }}>
                    <div className="flex flex-col items-center justify-center h-full modal-box">
                        <div className="flex">

                            {/* ==== Loading Spinner ===== */}
                            <div className="w-36">
                                <KrutLoader />
                            </div>
                        </div>
                        <p className="py-4 text-sm md:text-lg">
                            Loading ...
                        </p>
                    </div>

                </ReactModal>
            }

        </>
    )
}

export default KrutLoaderModal