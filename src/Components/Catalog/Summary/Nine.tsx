import { formatIDR } from '@/types/FormtRupiah';
import React from 'react';
import HandleCheckout from './HandleCheckout';
import { OutletsType } from '@/types/Admin/OutletType';

type Props = {
    isDarkMode: boolean;
    isBuild?: boolean;
    totalCart: number;
    summary: number;
    selectedOutlet: OutletsType | null;
}

const Nine = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    return (
        // Wrapper untuk posisi dan z-index
        <div className="sticky bottom-6 z-50 px-4 w-full flex justify-center pointer-events-none">

            {/* Inverted Floating Pill Container */}
            <div className={`
                pointer-events-auto backdrop-blur-2xl px-7 py-3.5 rounded-full flex items-center gap-6 shadow-2xl transition-colors duration-300
                ${isDarkMode
                    ? "bg-slate-50/95 text-slate-900 shadow-white/5"
                    : "bg-[#18181b]/95 text-white shadow-black/40"}
            `}>

                {/* Bagian Kiri: Label & Harga */}
                <div className="flex flex-col items-start justify-center">
                    <span className="text-[10px] font-bold tracking-widest opacity-60 mb-0.5 uppercase">
                        Total Bayar
                    </span>
                    <span className="font-extrabold text-base tracking-tight leading-none">
                        {formatIDR(summary)}
                    </span>
                </div>

                {/* Garis Pemisah (Divider) Dinamis */}
                <div className={`h-8 w-[1.5px] rounded-full opacity-50 ${isDarkMode ? "bg-slate-300" : "bg-slate-600"
                    }`} />

                {/* Bagian Kanan: Tombol Teks murni */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        font-extrabold text-sm text-[var(--summary-primary-color)] uppercase tracking-wide
                        transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110
                    `}
                >
                    Checkout ({totalCart})
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Nine;