import { formatIDR } from '@/types/FormtRupiah';
import { Send } from 'lucide-react';
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

const FourTeen = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar dengan z-index tinggi
        <div className="sticky bottom-0 z-50 w-full pointer-events-none">

            {/* Ultra-Curved Dock Container */}
            <div className={`
                pointer-events-auto w-full max-w-3xl mx-auto px-6 py-5 md:px-8 md:py-6 
                rounded-t-[40px] backdrop-blur-2xl border-t transition-all duration-300
                flex justify-between items-center
                ${isDarkMode
                    ? "bg-[#111111]/95 border-white/5 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.5)]"
                    : "bg-white/95 border-slate-200/40 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.05)]"}
            `}>

                {/* Bagian Kiri: Info Item & Harga */}
                <div className="flex flex-col justify-center">
                    <span className={`text-[11px] font-bold tracking-widest uppercase mb-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                        Total ({totalCart} Item)
                    </span>
                    <p className={`font-black text-2xl tracking-tighter leading-none ${isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        {formatIDR(summary)}
                    </p>
                </div>

                {/* Bagian Kanan: Tombol Beli High-Contrast */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group relative flex items-center gap-2.5 px-8 py-3.5 rounded-[20px] font-bold text-sm tracking-wide
                        transition-all duration-300 hover:scale-105 active:scale-95
                        ${isDarkMode
                            ? "bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.15)] hover:bg-slate-200"
                            : "bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:bg-slate-800"}
                    `}
                >
                    <span>Beli</span>
                    {/* Ikon Send dengan animasi Lepas Landas saat di-hover */}
                    <Send
                        size={18}
                        className="transform rotate-45 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                </HandleCheckout>

            </div>
        </div>
    );
}

export default FourTeen;