import { Check, Trash2, XCircle } from 'lucide-react'
import React from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    deleteData: any | null
    handleDelete: (id: number | null) => void;
}

const ModalDelete = ({ isOpen, onClose, deleteData, handleDelete }: Props) => {
    if (!isOpen) return null;
    return (

        <div className="fixed inset-0 z-70 overflow-y-auto bg-gray-900/70 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-300">
            <div
                className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-xl max-h-[95vh] overflow-y-auto transform transition-transform duration-300 scale-100 opacity-100 modal-no-scrollbar"
            >
                <div className="sticky top-0 bg-red-700 p-5 rounded-t-xl shadow-lg flex justify-between items-center z-10">
                    <div className="flex items-center space-x-3">
                        <Trash2 size={28} className="text-white" />
                        <h2 className="text-2xl font-bold text-white">Hapus Data</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-200 hover:text-white transition duration-200 p-1 rounded-full hover:bg-red-800 cursor-pointer"
                        aria-label="Tutup Modal"
                    >
                        <XCircle size={28} />
                    </button>
                </div>

                {/* Form Body */}
                <div className='p-6'>
                    <p className="mb-4 text-sm text-gray-700">
                        Anda akan menghapus <strong>{deleteData?.name}</strong>  Aksi ini tidak dapat dikembalikan.
                    </p>
                    <div className="sticky bottom-0 p-4 pb-0 bg-white border-t border-gray-200 flex justify-end space-x-4 z-10 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center cursor-pointer space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
                        >
                            <XCircle size={20} />
                            <span>Batal</span>
                        </button>
                        <button
                            type="submit"
                            className="flex items-center cursor-pointer space-x-2 px-8 py-3 bg-red-700 text-white font-extrabold rounded-lg shadow-xl shadow-red-300/50 hover:bg-red-800 transition duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                            // disabled={isSaveDisabled}
                            onClick={() => handleDelete(deleteData?.id ?? null)}
                        >
                            <Check size={20} />
                            <span>Ya</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ModalDelete