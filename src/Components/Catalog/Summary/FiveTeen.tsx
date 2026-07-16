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

const FiveTeen = ({ isDarkMode, isBuild, summary, totalCart, selectedOutlet }: Props) => {
    return (
        // Wrapper luar dengan z-index dan batas max-width agar proporsional
        <div className="sticky bottom-6 z-50 px-4 w-full max-w-md mx-auto pointer-events-none">

            {/* Seamless Split Block Container */}
            <div className={`
                pointer-events-auto flex w-full rounded-[24px] overflow-hidden shadow-2xl border transition-all duration-300
                ${isDarkMode
                    ? "border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
                    : "border-slate-200/60 shadow-[0_15px_40px_rgba(0,0,0,0.08)]"}
            `}>

                {/* Panel Kiri: Info Harga dengan Glassmorphism */}
                <div className={`
                    flex-1 px-6 py-4 flex flex-col justify-center backdrop-blur-xl transition-colors
                    ${isDarkMode ? "bg-[#18181b]/95" : "bg-white/95"}
                `}>
                    <p className={`text-[11px] font-extrabold uppercase tracking-widest mb-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                        Total Tagihan
                    </p>
                    <p className={`text-xl font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        {formatIDR(summary)}
                    </p>
                </div>

                {/* Panel Kanan: Tombol Checkout Menempel Penuh */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group relative flex items-center justify-center px-6 sm:px-8
                        bg-[var(--summary-primary-color)] text-white 
                        font-black uppercase tracking-widest text-xs italic
                        transition-all duration-300 
                        hover:brightness-110 active:brightness-95
                    `}
                >
                    {/* Teks dengan efek zoom tipis saat di-hover */}
                    <span className="transform transition-transform duration-300 group-hover:scale-105">
                        Checkout ({totalCart})
                    </span>

                    {/* Efek kilauan halus (opsional) */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none" />
                </HandleCheckout>

            </div>
        </div>
    );
}

export default FiveTeen;