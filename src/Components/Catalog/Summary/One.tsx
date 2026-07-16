import { formatIDR } from '@/types/FormtRupiah';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import HandleCheckout from './HandleCheckout';
import { OutletsType } from '@/types/Admin/OutletType';

type Props = {
    isDarkMode: boolean;
    totalCart: number;
    summary: number;
    isBuild?: boolean;
    selectedOutlet: OutletsType | null;
}

const One = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    return (
        // Wrapper luar untuk posisi sticky & z-index agar selalu di atas
        <div className="sticky bottom-6 z-50 px-4 w-full max-w-md mx-auto">
            
            {/* Main Pill Container - Glassmorphism Effect */}
            <div className={`
                relative flex items-center justify-between p-2 pl-6 rounded-full shadow-2xl backdrop-blur-xl border transition-colors duration-300
                ${isDarkMode 
                    ? "bg-[#121212]/70 border-white/10 shadow-black/60" 
                    : "bg-white/80 border-slate-200/50 shadow-slate-300/50"}
            `}>
                
                {/* Efek gradien tipis di dalam pill (Opsional untuk kesan premium) */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent to-[var(--summary-primary-color)]/5 pointer-events-none" />

                {/* Bagian Teks (Item & Harga) */}
                <div className="flex flex-col relative z-10 space-y-1">
                    <span className={`text-[11px] font-medium tracking-widest uppercase leading-none ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {totalCart} {totalCart > 1 ? 'Items' : 'Item'}
                    </span>
                    <span className={`text-lg font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"} leading-none`}>
                        {formatIDR(summary)}
                    </span>
                </div>

                {/* Tombol Checkout */}
                <HandleCheckout 
                    selectedOutlet={selectedOutlet} 
                    isBuild={isBuild} 
                    className={`
                        group relative flex items-center justify-center h-12 w-12 rounded-full overflow-hidden transition-all duration-300
                        bg-[var(--summary-primary-color)] text-white 
                        hover:scale-105 active:scale-95 
                        shadow-lg shadow-[var(--summary-primary-color)]/40
                    `}
                >
                    {/* Panah dengan animasi geser saat di-hover */}
                    <ArrowRight 
                        size={20} 
                        strokeWidth={2.5} 
                        className="transform transition-transform duration-300 group-hover:translate-x-1" 
                    />
                </HandleCheckout>
                
            </div>
        </div>
    );
}

export default One;