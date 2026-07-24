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

const Six = ({ isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    // SOP 4: Antisipasi Error (Edge Case)
    // Sembunyikan panel "Dynamic Island" ini jika keranjang kosong
    if (totalCart < 1) return null;

    return (
        // Wrapper utama untuk menempatkan di tengah bawah dan mengamankan z-index
        <div className="sticky bottom-6 z-50 px-4 w-full pointer-events-none flex justify-center">

            {/* Dynamic Island Container - Glassmorphism */}
            <div className={`
                pointer-events-auto flex items-center gap-2 p-1.5 rounded-full shadow-2xl backdrop-blur-2xl border transition-colors duration-300
                ${isDarkMode
                    ? "bg-[#1e1e1e]/60 border-white/10 shadow-black/50"
                    : "bg-white/50 border-white/60 shadow-slate-300/50"}
            `}>

                {/* Bagian Harga (Inner Pill Kiri) - Tetap netral agar mudah dibaca */}
                <div className={`
                    px-5 py-2.5 rounded-full shadow-sm transition-colors flex items-center justify-center
                    ${isDarkMode ? "bg-white/10 text-white" : "bg-white text-slate-800"}
                `}>
                    <span className="font-extrabold tracking-tight text-sm md:text-base leading-none">
                        {formatIDR(summary)}
                    </span>
                </div>

                {/* Bagian Tombol Checkout (Inner Pill Kanan) dengan Warna Branding & YIQ */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        group flex items-center gap-2.5 pr-5 pl-2 py-2 rounded-full text-sm font-semibold transition-all duration-300
                        hover:scale-[1.03] active:scale-95 shadow-md
                        bg-[var(--summary-primary-color)] 
                        text-[var(--summary-secondary-color)] /* Mengamankan tulisan agar tidak nabrak background */
                        shadow-[var(--summary-primary-color)]/30
                    `}
                >
                    {/* Inline Badge untuk Jumlah Item - Dibuat kebalikan (Inverted) warnanya agar mencolok! */}
                    <div className={`
                        flex items-center justify-center min-w-[26px] h-[26px] rounded-full text-[11px] font-bold transition-colors
                        bg-[var(--summary-secondary-color)] 
                        text-[var(--summary-primary-color)]
                    `}>
                        {totalCart}
                    </div>
                    <span className="tracking-wide">Checkout</span>
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Six;