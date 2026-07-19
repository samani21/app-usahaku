import { formatIDR } from '@/types/FormtRupiah';
import { ShoppingBag } from 'lucide-react';
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

const Two = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    return (
        // Wrapper luar dengan z-index tinggi dan shadow arah atas
        <div className={`sticky bottom-0 z-50 w-full backdrop-blur-xl border-t transition-all duration-300 ${isDarkMode
            ? "bg-[#121212]/90 border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
            : "bg-white/90 border-slate-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.04)]"
            }`}>
            {/* Container untuk membatasi lebar maksimal di layar besar */}
            <div className="max-w-screen-xl mx-auto px-4 py-4 md:px-6 flex items-center justify-between gap-4">

                {/* Bagian Kiri: Ikon & Harga */}
                <div className="flex items-center gap-4">
                    {/* Ikon Tas dengan Premium Badge */}
                    <div className={`relative flex items-center justify-center w-12 h-12 rounded-2xl transition-colors ${isDarkMode ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-700"
                        }`}>
                        <ShoppingBag size={22} strokeWidth={2} />

                        {/* Badge cart dengan border dinamis untuk efek "Cutout" */}
                        <span className={`absolute -top-1.5 -right-1.5 bg-[var(--summary-primary-color)] text-white text-[10px] font-bold min-w-[22px] h-[22px] rounded-full flex items-center justify-center px-1 border-2 ${isDarkMode ? "border-[#121212]" : "border-white"
                            } shadow-sm`}>
                            {totalCart}
                        </span>
                    </div>

                    {/* Detail Harga */}
                    <div className="flex flex-col">
                        <span className={`text-[11px] font-medium mb-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                            Total Pembayaran
                        </span>
                        <span className={`text-lg font-extrabold tracking-tight leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {formatIDR(summary)}
                        </span>
                    </div>
                </div>

                {/* Tombol Checkout High-Contrast */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group relative overflow-hidden rounded-xl px-6 py-3 font-semibold text-sm transition-all duration-300
                        hover:scale-[1.02] active:scale-95
                        ${isDarkMode
                            ? "bg-white text-black hover:bg-slate-200"
                            : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20"
                        }
                    `}
                >
                    Checkout
                </HandleCheckout>
            </div>
        </div>
    );
}

export default Two;