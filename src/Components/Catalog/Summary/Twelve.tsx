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

const Twelve = ({ isDarkMode, isBuild, totalCart, summary, selectedOutlet }: Props) => {
    return (
        // Wrapper luar untuk posisi dan z-index
        <div className="sticky bottom-6 z-50 px-4 w-full max-w-xl mx-auto pointer-events-none">

            {/* Neo-Brutalism Container */}
            <div className={`
                pointer-events-auto p-4 flex justify-between items-center border-[3px] transition-colors duration-300
                bg-[var(--summary-primary-color)] text-[var(--summary-secondary-color)]
                ${isDarkMode
                    ? "border-slate-200 shadow-[6px_6px_0_0_rgba(226,232,240,1)]"
                    : "border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]"}
            `}>

                {/* Bagian Kiri: Info Text */}
                <div className="flex flex-col">
                    <span className="font-bold text-[10px] uppercase tracking-widest border-b-2 border-current w-fit mb-1 pb-0.5">
                        {totalCart} Item Terpilih
                    </span>
                    <span className="font-black text-xl tracking-tighter leading-none">
                        {formatIDR(summary)}
                    </span>
                </div>

                {/* Bagian Kanan: Tactile Brutalist Button */}
                <HandleCheckout
                    selectedOutlet={selectedOutlet}
                    isBuild={isBuild}
                    className={`
                        px-7 py-3 text-xs font-black uppercase tracking-widest border-[3px] 
                        transition-transform duration-100
                        hover:-translate-y-0.5 hover:-translate-x-0.5
                        active:translate-x-1 active:translate-y-1 active:shadow-none
                        ${isDarkMode
                            ? "bg-slate-200 text-black border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                            : "bg-black text-white border-black shadow-[4px_4px_0_0_rgba(255,255,255,1)]"}
                    `}
                >
                    Gas!
                </HandleCheckout>

            </div>
        </div>
    );
}

export default Twelve;