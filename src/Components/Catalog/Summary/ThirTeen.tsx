import { formatIDR } from '@/types/FormtRupiah';
import { CreditCard } from 'lucide-react';
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

const ThirTeen = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar untuk z-index dan sentralisasi
        <div className="sticky bottom-10 z-50 flex justify-center px-4 w-full pointer-events-none">

            {/* 
                Seluruh Kapsul adalah Tombol HandleCheckout 
                Menggunakan group untuk trigger animasi ke elemen anak
            */}
            <HandleCheckout
                selectedOutlet={selectedOutlet}
                isBuild={isBuild}
                className={`
                    pointer-events-auto group flex items-center gap-4 p-2 pr-7 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300
                    hover:scale-105 active:scale-95 hover:shadow-3xl
                    ${isDarkMode
                        ? "bg-[#1e1e1e]/90 border-white/10 shadow-black/50"
                        : "bg-white/95 border-slate-200/60 shadow-slate-300/60"}
                `}
            >
                {/* Bagian Kiri: Ikon & Badge */}
                <div className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full transition-colors
                    ${isDarkMode ? "bg-white/10 text-white" : "bg-slate-900 text-white"}
                `}>
                    <CreditCard
                        size={20}
                        className="transition-transform duration-300 group-hover:rotate-[-5deg]"
                    />

                    {/* Dynamic Cutout Badge untuk Total Item */}
                    <span className={`
                        absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full border-[2.5px] 
                        flex items-center justify-center text-[10px] font-black shadow-sm
                        bg-[var(--summary-primary-color)] text-[var(--summary-secondary-color)]
                        ${isDarkMode ? "border-[#1e1e1e]" : "border-white"}
                    `}>
                        {totalCart}
                    </span>
                </div>

                {/* Bagian Kanan: Tipografi Harga & Label */}
                <div className="flex flex-col text-left justify-center">
                    <span className={`font-black text-lg tracking-tight leading-none mb-1 ${isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        {formatIDR(summary)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"
                        }`}>
                        Checkout Sekarang
                    </span>
                </div>
            </HandleCheckout>

        </div>
    );
}

export default ThirTeen;