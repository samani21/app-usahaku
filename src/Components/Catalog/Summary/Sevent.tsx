import { formatIDR } from '@/types/FormtRupiah';
import { ChevronRight } from 'lucide-react';
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

const Sevent = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar untuk menahan posisi di bawah
        <div className="sticky bottom-0 z-50 w-full pointer-events-none">

            {/* Minimalist Bottom Bar Container */}
            <div className={`
                pointer-events-auto w-full backdrop-blur-xl border-t transition-colors duration-300
                ${isDarkMode
                    ? "bg-[#121212]/85 border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
                    : "bg-white/90 border-slate-200/50 shadow-[0_-8px_30px_rgba(0,0,0,0.03)]"}
            `}>

                {/* Inner Content dengan batas lebar maksimal */}
                <div className="max-w-screen-xl mx-auto px-5 py-4 md:px-8 flex justify-between items-center">

                    {/* Bagian Kiri: Info Harga */}
                    <div className="flex flex-col justify-center">
                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-400"
                            }`}>
                            Total Tagihan
                        </span>
                        <span className={`text-lg font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-slate-900"
                            }`}>
                            {formatIDR(summary)}
                        </span>
                    </div>

                    {/* Bagian Kanan: Minimalist Text Button */}
                    <HandleCheckout
                        selectedOutlet={selectedOutlet}
                        isBuild={isBuild}
                        className={`
                            group flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest
                            text-[var(--summary-primary-color)] transition-all duration-300
                            hover:bg-[var(--summary-primary-color)]/10 active:scale-95
                        `}
                    >
                        <span>Lanjut ({totalCart})</span>
                        {/* Panah bergeser saat di-hover */}
                        <ChevronRight
                            size={18}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </HandleCheckout>

                </div>
            </div>
        </div>
    );
}

export default Sevent;