import React from 'react'

type Props = {
    children: React.ReactNode;
    position: string;
    activeAlert: boolean
}

const AlertWrapper = ({ children, position = "top-right", activeAlert }: Props) => {
    if (!activeAlert) return null;

    const posClasses: any = {
        "top-right": "top-6 right-1 sm:right-6",
        "bottom-right": "bottom-6 right-1 sm:right-6",
        "top-center": "top-6 left-1/2 -translate-x-1/2",
        "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
        "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    };

    return (
        <div className={`fixed z-[100] w-full max-w-sm animate-in fade-in slide-in-from-right-8 duration-300 ${posClasses[position]}`}>
            {children}
        </div>
    );
};
export default AlertWrapper