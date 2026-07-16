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

const Six = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    return (
        // Wrapper utama untuk menempatkan di tengah bawah dan mengamankan z-index
        <div className="sticky bottom-6 z-50 px-4 w-full pointer-events-none flex justify-center">

            {/* Dynamic Island Container - Glassmorphism */}
            <div className={`
                pointer-events-auto flex items-center gap-2 p-1.5 rounded-full shadow-2xl backdrop-blur-2xl border transition-colors duration-300
                ${isDarkMode
                    ? "bg-[#1e1e1e]/60 border-white/10 shadow-black/50"
                    : "bg-white/50 border-white/60 shadow-slate-300/50"}
            `}>

                {/* Bagian Harga (Inner Pill Kiri) */}
                <div className={`
                    px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center justify-center
                    ${isDarkMode ? "bg-white/10 text-white" : "bg-white text-slate-800"}
                `}>
                    <span className="font-extrabold tracking-tight text-sm md:text-base leading-none">
                        {formatIDR(summary)}
                    </span>
                </div>

                {/* Bagian Tombol Checkout (Inner Pill Kanan) */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group flex items-center gap-2.5 pr-5 pl-2 py-2 rounded-full text-sm font-semibold transition-all duration-300
                        hover:scale-[1.03] active:scale-95 shadow-md
                        ${isDarkMode
                            ? "bg-white text-black hover:bg-slate-200"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"}
                    `}
                >
                    {/* Inline Badge untuk Jumlah Item */}
                    <div className={`
                        flex items-center justify-center min-w-[26px] h-[26px] rounded-full text-[11px] font-bold transition-colors
                        ${isDarkMode ? "bg-black/10 text-black" : "bg-white/20 text-white"}
                    `}>
                        {totalCart}
                    </div>
                    <span className="tracking-wide">Checkout</span>
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Six;