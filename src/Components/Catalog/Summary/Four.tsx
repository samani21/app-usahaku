import { formatIDR } from '@/types/FormtRupiah';
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

const Four = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper untuk membatasi lebar maksimal dan mengatur z-index
        <div className="sticky bottom-6 z-50 px-4 w-full max-w-lg mx-auto">

            {/* Outer Container: Efek Gradient Border & Shadow Glow */}
            <div className={`
                bg-gradient-to-r from-[var(--summary-primary-color)] via-[var(--summary-primary-color)]/60 to-[var(--summary-primary-color)]/10 
                p-[1.5px] rounded-[20px] shadow-xl transition-all duration-300
                shadow-[var(--summary-primary-color)]/20
            `}>

                {/* Inner Container: Glassmorphism Effect */}
                <div className={`
                    flex items-center justify-between p-2 pl-4 rounded-[18.5px] backdrop-blur-xl
                    ${isDarkMode ? "bg-[#121212]/95" : "bg-white/95"}
                `}>

                    {/* Bagian Kiri: Info Cart */}
                    <div className="flex items-center gap-3">
                        {/* Badge Jumlah Barang */}
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest ${isDarkMode ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-600"
                            }`}>
                            {totalCart} Item
                        </span>

                        {/* Dot Separator */}
                        <div className={`w-1 h-1 rounded-full ${isDarkMode ? "bg-slate-600" : "bg-slate-300"}`} />

                        {/* Harga */}
                        <span className={`text-[15px] font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {formatIDR(summary)}
                        </span>
                    </div>

                    {/* Bagian Kanan: Tombol Beli */}
                    <HandleCheckout
                        selectedOutlet={selectedOutlet}
                        isBuild={isBuild}
                        className={`
                            bg-gradient-to-r from-[var(--summary-primary-color)] to-[var(--summary-primary-color)]/80 
                            hover:to-[var(--summary-primary-color)] 
                            text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest 
                            transition-all duration-300 hover:scale-105 active:scale-95 shadow-md
                        `}
                    >
                        Beli
                    </HandleCheckout>

                </div>
            </div>
        </div>
    );
}

export default Four;