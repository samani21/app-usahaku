import React, { useEffect, useState } from 'react';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';

type Props = {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    onClose: () => void;
}

export const AlertComponent = ({ type = 'success', message, onClose }: Props) => {
    // Konfigurasi gaya berdasarkan tipe alert
    const styles: any = {
        success: {
            container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
            button: 'text-emerald-500 hover:bg-emerald-100'
        },
        error: {
            container: 'bg-red-50 border-red-200 text-red-800',
            icon: <XCircle className="w-5 h-5 text-red-500" />,
            button: 'text-red-500 hover:bg-red-100'
        },
        warning: {
            container: 'bg-amber-50 border-amber-200 text-amber-800',
            icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
            button: 'text-amber-500 hover:bg-amber-100'
        },
        info: {
            container: 'bg-blue-50 border-blue-200 text-blue-800',
            icon: <Info className="w-5 h-5 text-blue-500" />,
            button: 'text-blue-500 hover:bg-blue-100'
        }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div className={`flex items-start p-4 mb-4 border rounded-xl shadow-sm transition-all duration-300 ${currentStyle.container}`}>
            <div className="flex-shrink-0 mt-0.5">
                {currentStyle.icon}
            </div>
            <div className="ml-3 flex-1">
                <div className="text-sm leading-relaxed opacity-90">{message}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 transition-colors ${currentStyle.button}`}
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};


export default function Alert({ type, message, onClose }: Props) {
    useEffect(() => {
        setTimeout(() => {
            onClose()
        }, 5000)
    }, [])
    return (
        <div className="absolute z-100 top-4 right-0 w-full max-w-xl">
            <AlertComponent
                type={type}
                message={message}
                onClose={() => onClose()}
            />
        </div>
    );
}