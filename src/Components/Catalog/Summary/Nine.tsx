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

const Nine = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    // SOP 4: Antisipasi Error (Edge Case)
    // Sembunyikan kapsul jika belum ada produk di keranjang
    if (totalCart < 1) return null;

    return (
        // Wrapper untuk posisi dan z-index
        <div className="sticky bottom-6 z-50 px-4 w-full flex justify-center pointer-events-none">

            {/* Inverted Floating Pill Container */}
            {/* Padding kanan (pr-2.5) dikecilkan agar seimbang dengan tombol solid di dalamnya */}
            <div className={`
                pointer-events-auto backdrop-blur-2xl pl-7 pr-2.5 py-2 rounded-full flex items-center gap-5 shadow-2xl transition-colors duration-300
                ${isDarkMode
                    ? "bg-slate-50/95 text-slate-900 shadow-white/5"
                    : "bg-[#18181b]/95 text-white shadow-black/40"}
            `}>

                {/* Bagian Kiri: Label & Harga */}
                <div className="flex flex-col items-start justify-center py-1.5">
                    <span className="text-[10px] font-bold tracking-widest opacity-60 mb-0.5 uppercase">
                        Total Bayar
                    </span>
                    <span className="font-extrabold text-base tracking-tight leading-none">
                        {formatIDR(summary)}
                    </span>
                </div>

                {/* Garis Pemisah (Divider) Dinamis */}
                <div className={`h-8 w-[1.5px] rounded-full opacity-50 ${isDarkMode ? "bg-slate-300" : "bg-slate-600"
                    }`}
                />

                {/* Bagian Kanan: Tombol Solid dengan Perlindungan YIQ */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        px-5 py-2.5 rounded-full font-extrabold text-sm uppercase tracking-wide
                        transition-all duration-300 hover:scale-105 active:scale-95 shadow-md
                        bg-[var(--summary-primary-color)] 
                        text-[var(--summary-secondary-color)] /* Proteksi cerdas YIQ! */
                        shadow-[var(--summary-primary-color)]/20
                    `}
                >
                    Checkout ({totalCart})
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Nine;