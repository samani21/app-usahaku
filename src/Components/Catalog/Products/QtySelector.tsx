import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

type Props = {
    setQuantity: (val: number) => void;
    quantity: number;
    isDarkMode: boolean;
    product: ProductsType | null;
    selectedVariant?: Variants | null;
}

const QtySelector = ({ setQuantity, quantity, isDarkMode, product, selectedVariant }: Props) => {
    // Menentukan max stock berdasarkan varian yang dipilih atau stok produk utama
    const maxStock = selectedVariant?.product_variant_stock ?? product?.product_stock ?? 0;

    const handleIncrease = () => {
        if (quantity < maxStock) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="flex flex-col gap-1.5">
            {/* 1. Kapsul Pembungkus (Pill-shaped Container) */}
            <div className={`flex items-center p-1 rounded-full w-fit border transition-colors duration-300 ${isDarkMode
                ? "bg-[#1E293B]/80 border-slate-700/80"
                : "bg-slate-50 border-slate-200/80"
                }`}>

                {/* 2. Tombol Minus */}
                <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center
                        ${isDarkMode
                            ? 'hover:bg-slate-700 text-slate-300 disabled:text-slate-600 disabled:hover:bg-transparent'
                            : 'hover:bg-white hover:shadow-sm text-slate-700 disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:shadow-none'
                        } 
                        disabled:cursor-not-allowed`}
                >
                    <Minus size={16} strokeWidth={2.5} />
                </button>

                {/* 3. Angka Quantity dengan Fixed Width */}
                {/* w-10 memastikan lebar tetap, sehingga tombol tidak bergeser saat angka berubah dari 9 ke 10 */}
                <span className={`w-10 text-center text-sm font-semibold tracking-wide ${isDarkMode ? "text-white" : "text-slate-800"
                    }`}>
                    {quantity}
                </span>

                {/* 4. Tombol Plus */}
                <button
                    onClick={handleIncrease}
                    disabled={quantity >= maxStock || (product?.has_variant && !selectedVariant)}
                    className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center
                        ${isDarkMode
                            ? 'hover:bg-slate-700 text-slate-300 disabled:text-slate-600 disabled:hover:bg-transparent'
                            : 'hover:bg-white hover:shadow-sm text-slate-700 disabled:text-slate-300 disabled:hover:bg-transparent disabled:hover:shadow-none'
                        } 
                        disabled:cursor-not-allowed`}
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>
            </div>

            {/* 5. Indikator Batas Stok (Opsional, untuk UX yang lebih informatif) */}
            {quantity >= maxStock && maxStock > 0 && (
                <span className={`text-[10px] pl-3 font-medium transition-opacity duration-300 ${isDarkMode ? 'text-orange-400/80' : 'text-orange-500/80'
                    }`}>
                    Batas maksimal stok
                </span>
            )}
        </div>
    );
};

export default QtySelector;