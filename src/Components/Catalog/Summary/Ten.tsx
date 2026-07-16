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

const Ten = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar untuk menahan posisi bawah dan z-index
        <div className="sticky bottom-0 z-50 w-full pointer-events-none">
            
            {/* Bold Sporty Bottom Bar Container */}
            <div className={`
                pointer-events-auto w-full backdrop-blur-xl border-t-[3px] border-[var(--summary-primary-color)] 
                shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)] transition-colors duration-300
                ${isDarkMode ? "bg-[#1a1a1a]/95" : "bg-white/95"}
            `}>
                
                {/* Inner Wrapper untuk layar besar/kecil */}
                <div className="max-w-screen-xl mx-auto px-5 py-4 flex justify-between items-center">
                    
                    {/* Bagian Kiri: Info Keranjang & Harga */}
                    <div className="flex flex-col justify-center">
                        <p className={`text-[11px] font-extrabold uppercase tracking-widest mb-1 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                            Keranjang ({totalCart})
                        </p>
                        <p className={`text-xl font-black tracking-tighter leading-none ${
                            isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                            {formatIDR(summary)}
                        </p>
                    </div>

                    {/* Bagian Kanan: Sporty Italic Button */}
                    <HandleCheckout 
                        selectedOutlet={selectedOutlet} 
                        isBuild={isBuild} 
                        className={`
                            bg-[var(--summary-primary-color)] text-[var(--summary-secondary-color)] px-8 py-3 rounded-md 
                            font-black uppercase text-xs italic tracking-widest
                            transition-all duration-300 
                            hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--summary-primary-color)]/30 
                            active:translate-y-0 active:scale-95
                        `}
                    >
                        Checkout
                    </HandleCheckout>
                    
                </div>
            </div>
        </div>
    );
}

export default Ten;