"use client"
import { Variants } from '@/types/Admin/ProductsType';
import { Layers } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
    variants: Variants[];
    selectedVariant: Variants | null;
    setSelectedVariant: (val: Variants) => void;
    isDarkMode: boolean;
    isStock: boolean;
    color?: string;
}

const VariantPicker = ({ variants, selectedVariant, setSelectedVariant, isDarkMode, color, isStock }: Props) => {
    // 🎨 STATE BARU: Untuk menyimpan status terang/gelap
    const [isPrimaryLight, setIsPrimaryLight] = useState(false);

    useEffect(() => {
        // 🎨 LOGIC COLOR DETECTOR
        const checkColorBrightness = () => {
            if (typeof document !== 'undefined') {
                let targetColor = color;

                // Kalau nggak ada props color, ambil dari CSS variable default
                if (!targetColor) {
                    const rootStyle = getComputedStyle(document.documentElement);
                    targetColor = rootStyle.getPropertyValue('--product-primary-color').trim();
                }

                if (targetColor) {
                    let r = 0, g = 0, b = 0;
                    if (targetColor.startsWith('#')) {
                        const hex = targetColor.replace('#', '');
                        r = parseInt(hex.substring(0, 2), 16) || 0;
                        g = parseInt(hex.substring(2, 4), 16) || 0;
                        b = parseInt(hex.substring(4, 6), 16) || 0;
                    } else if (targetColor.startsWith('rgb')) {
                        const match = targetColor.match(/\d+/g);
                        if (match && match.length >= 3) {
                            r = parseInt(match[0], 10);
                            g = parseInt(match[1], 10);
                            b = parseInt(match[2], 10);
                        }
                    }
                    // YIQ Luminance Formula
                    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
                    setIsPrimaryLight(yiq >= 128); // Terang jika >= 128
                }
            }
        };

        // Kasih sedikit delay untuk memastikan DOM dan CSS variabel termuat
        setTimeout(checkColorBrightness, 50);
    }, [color]);

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
                                        // 🎨 UPDATE DI SINI: Teks jadi dinamis ngikutin isPrimaryLight
                                        ? `${activeBorder} ${isPrimaryLight ? 'text-slate-900' : 'text-white'} shadow-lg scale-105`
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