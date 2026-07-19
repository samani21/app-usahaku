import { formatIDR } from '@/types/FormtRupiah';
import { ShoppingCart } from 'lucide-react';
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

const Three = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    return (
        // Wrapper luar untuk menahan posisi di kanan bawah dengan z-index tinggi
        <div className="sticky bottom-10 z-50 flex justify-end px-4 md:px-8 w-full pointer-events-none">

            {/* Inner Container: Pointer events diaktifkan kembali di sini */}
            <div className={`
                pointer-events-auto flex items-center gap-5 p-2.5 pl-6 rounded-full shadow-2xl border backdrop-blur-xl transition-all duration-300
                ${isDarkMode
                    ? "bg-[#1E1E1E]/90 border-white/10 shadow-black/50"
                    : "bg-white/95 border-slate-200/60 shadow-slate-300/60"}
            `}>

                {/* Bagian Teks (Rata Kanan) */}
                <div className="flex flex-col text-right justify-center">
                    <p className={`text-[11px] font-extrabold tracking-widest uppercase mb-0.5 ${isDarkMode ? "text-slate-400" : "text-[var(--summary-primary-color)]"
                        }`}>
                        Total ({totalCart})
                    </p>
                    <p className={`text-lg font-black tracking-tight leading-none ${isDarkMode ? "text-white" : "text-slate-900"
                        }`}>
                        {formatIDR(summary)}
                    </p>
                </div>

                {/* Tombol Checkout (Lingkaran Sempurna) */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-all duration-300
                        bg-[var(--summary-primary-color)] text-white
                        hover:scale-105 active:scale-95 shadow-md shadow-[var(--summary-primary-color)]/30
                    `}
                >
                    {/* Ikon dengan interaksi transisi */}
                    <ShoppingCart
                        size={20}
                        strokeWidth={2.5}
                        className="transition-transform duration-300 group-hover:-rotate-6"
                    />
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Three;