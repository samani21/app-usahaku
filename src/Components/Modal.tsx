import React from 'react'
type Props = {
    open: boolean;
    children: React.ReactNode;
};

const Modal = ({ open, children }: Props) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-8 rounded-xl shadow-2xl min-w-xs mx-auto transform transition-all duration-300 scale-100">
                {children}
            </div>
        </div>
    )
}

export default Modal