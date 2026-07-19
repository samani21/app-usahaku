import { formatIDR } from '@/types/FormtRupiah';
import { ShoppingBag, Zap } from 'lucide-react';
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

const Five = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar dengan z-index tinggi
        <div className="sticky bottom-0 z-50 w-full md:px-4 md:pb-4 pointer-events-none">

            {/* Main Bottom Sheet Container */}
            <div className={`
                pointer-events-auto w-full max-w-2xl mx-auto px-6 py-5 
                rounded-t-[32px] md:rounded-[32px] 
                shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.15)] backdrop-blur-xl border-t border-x md:border-b
                transition-all duration-300 flex items-center justify-between
                ${isDarkMode
                    ? "bg-[#121212]/95 border-white/10 text-white"
                    : "bg-white/95 border-slate-200/50 text-slate-900"}
            `}>

                {/* Bagian Kiri: Info Cart */}
                <div className="flex items-center gap-4">
                    {/* Ikon Keranjang dengan background memutar */}
                    <div className={`flex items-center justify-center w-11 h-11 rounded-full ${isDarkMode ? "bg-white/10" : "bg-slate-100"
                        }`}>
                        <ShoppingBag size={20} className={isDarkMode ? "text-slate-300" : "text-slate-600"} />
                    </div>

                    {/* Detail Harga & Item */}
                    <div className="flex flex-col">
                        <p className={`text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}>
                            {totalCart} Item Terpilih
                        </p>
                        <p className="text-xl font-extrabold tracking-tight leading-none">
                            {formatIDR(summary)}
                        </p>
                    </div>
                </div>

                {/* Bagian Kanan: Tombol Checkout dengan Ikon Zap */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold tracking-wide
                        transition-all duration-300 hover:scale-105 active:scale-95
                        ${isDarkMode
                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-slate-200"
                            : "bg-slate-900 text-white shadow-[0_0_20px_rgba(0,0,0,0.15)] hover:bg-slate-800"}
                    `}
                >
                    <Zap size={16} className={`${isDarkMode ? "text-black" : "text-yellow-400"} fill-current`} />
                    <span>Checkout</span>
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Five;