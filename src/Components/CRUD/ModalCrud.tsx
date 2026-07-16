"use client"
import { Layers, X } from 'lucide-react';
import React, { useEffect } from 'react';

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    title: string;
    onClose: () => void;
}

const ModalCrud = ({ children, isOpen, title, onClose }: Props) => {
    // UX: Mencegah body halaman bisa di-scroll ketika modal terbuka
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup function saat komponen di-unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop Section 
                Menambahkan onClick agar modal tertutup saat area luar diklik 
            */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                            <Layers className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                            {title}
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 text-slate-400 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-100"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body / Content Section */}
                {/* flex-1 membuat area ini mengambil sisa ruang, overflow-y-auto membuatnya scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ModalCrud;