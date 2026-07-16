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

const Eight = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar dengan z-index untuk menjaga posisi tetap di atas
        <div className="sticky bottom-6 z-50 px-4 w-full max-w-2xl mx-auto pointer-events-none">
            
            {/* Chunky Card Container */}
            <div className={`
                pointer-events-auto flex items-center justify-between p-3 pl-4 rounded-[28px] shadow-2xl backdrop-blur-xl border transition-all duration-300
                ${isDarkMode 
                    ? "bg-[#18181b]/95 border-white/10 shadow-black/60" 
                    : "bg-white/95 border-slate-200/60 shadow-slate-300/60"}
            `}>
                
                {/* Bagian Kiri: Indikator Kotak & Harga */}
                <div className="flex items-center gap-4">
                    
                    {/* Blocky Item Counter */}
                    <div className={`
                        flex flex-col items-center justify-center w-12 h-12 rounded-[18px] transition-colors
                        ${isDarkMode 
                            ? "bg-white text-black shadow-[0_4px_20px_rgba(255,255,255,0.15)]" 
                            : "bg-slate-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"}
                    `}>
                        <span className="font-black text-xl leading-none">{totalCart}</span>
                    </div>

                    {/* Teks Harga */}
                    <div className="flex flex-col justify-center">
                        <span className={`text-[11px] font-bold tracking-widest uppercase mb-0.5 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                            Total Harga
                        </span>
                        <span className={`text-xl font-extrabold tracking-tight leading-none ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                            {formatIDR(summary)}
                        </span>
                    </div>
                </div>

                {/* Tombol Bayar (Chunky Button) */}
                <HandleCheckout 
                    selectedOutlet={selectedOutlet} 
                    isBuild={isBuild} 
                    className={`
                        bg-[var(--summary-primary-color)] text-white px-8 py-3.5 rounded-[18px] text-sm font-bold uppercase tracking-wider
                        transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg shadow-[var(--summary-primary-color)]/30
                    `}
                >
                    Bayar
                </HandleCheckout>
                
            </div>
        </div>
    );
}

export default Eight;