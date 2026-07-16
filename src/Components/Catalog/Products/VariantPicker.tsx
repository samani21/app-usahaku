import { Variants } from '@/types/Admin/ProductsType';
import { Layers } from 'lucide-react';
import React from 'react';

type Props = {
    variants: Variants[];
    selectedVariant: Variants | null;
    setSelectedVariant: (val: Variants) => void;
    isDarkMode: boolean;
    isStock: boolean;
    color?: string;
}

const VariantPicker = ({ variants, selectedVariant, setSelectedVariant, isDarkMode, color, isStock }: Props) => {
    const activeBorder = color ? `border-[${color}] bg-[${color}]` : 'border-[var(--product-primary-color)] bg-[var(--product-primary-color)]';

    return (
        <div className="space-y-3">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                <Layers className="w-3 h-3" /> Pilih Varian:
            </span>
            <div className="flex flex-wrap gap-2">
                {variants.map((v, i) => {
                    const isStockOut = isStock && (v.product_variant_stock ?? 0) <= 0;
                    const isSelected = selectedVariant?.id === v.id;

                    return (
                        <button
                            key={i}
                            disabled={isStockOut}
                            onClick={() => setSelectedVariant(v)}
                            className={`
                                relative overflow-hidden px-4 py-3 rounded-xl border-2 transition-all font-bold text-xs flex flex-col items-center min-w-[100px]
                                ${isStockOut
                                    ? 'border-zinc-300 bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    : isSelected
                                        ? `${activeBorder} text-white shadow-lg scale-105`
                                        : isDarkMode
                                            ? 'border-white/10 hover:border-white/30 text-white bg-zinc-800'
                                            : 'border-zinc-200 hover:border-zinc-400 text-zinc-900 bg-white'
                                }
                            `}
                        >
                            <span>{v?.name}</span>

                            {/* Label Habis di Pojok Kanan Atas */}
                            {isStockOut && (
                                <div className="absolute top-0 right-0 overflow-hidden w-12 h-12">
                                    <div className="absolute top-[8px] right-[-14px] bg-red-600 text-white text-[7px] font-black uppercase py-0.5 w-16 text-center rotate-45 shadow-sm">
                                        Habis
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VariantPicker;