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

const Elevent = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper dengan z-index dan max-width untuk proporsi yang baik di semua layar
        <div className="sticky bottom-6 z-50 px-4 w-full max-w-lg mx-auto pointer-events-none">

            {/* Seluruh kontainer adalah tombol HandleCheckout */}
            <HandleCheckout
                selectedOutlet={selectedOutlet}
                isBuild={isBuild}
                className={`
                    pointer-events-auto group relative flex justify-between items-center w-full px-6 py-4 
                    rounded-full overflow-hidden transition-all duration-300
                    bg-[var(--summary-primary-color)] text-[var(--summary-secondary-color)]
                    shadow-xl shadow-[var(--summary-primary-color)]/40
                    hover:scale-[1.02] active:scale-[0.98]
                `}
            >
                {/* Efek kilauan cahaya (Shimmer) saat di-hover */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />

                {/* Bagian Kiri: Info Item */}
                <div className="relative z-10 flex items-center gap-2">
                    <span className="font-semibold text-sm md:text-base tracking-wide">
                        Checkout {totalCart} Item
                    </span>
                </div>

                {/* Bagian Kanan: Pemisah & Harga */}
                <div className="relative z-10 flex items-center gap-4">
                    {/* Garis Pemisah (Divider) */}
                    <div className="w-[1.5px] h-6 bg-[var(--summary-secondary-color)]/30 rounded-full" />

                    {/* Harga */}
                    <span className="font-black text-lg md:text-xl tracking-tight leading-none">
                        {formatIDR(summary)}
                    </span>
                </div>
            </HandleCheckout>

        </div>
    );
}

export default Elevent;