"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 PORTAL MURNI
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Tag, X, ArrowRight } from 'lucide-react';
import AlertWrapper from './AlertWrapper';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatIDR } from '@/types/FormtRupiah';
import ExpandableHTML from './ExpandableHTML';
import { getPromoDetails, Promo } from './PromoType';
import { OutletsType } from '@/types/Admin/OutletType';
import { Icon } from '@iconify/react';

type Props = {
    products: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

const Thirteen = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // 💎 STATE PORTAL
    const [mounted, setMounted] = useState(false);

    // 🎨 YIQ COLOR DETECTOR (Anti-Nabrak)
    const [isPrimaryLight, setIsPrimaryLight] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkPrimaryColor = () => {
            if (typeof document !== 'undefined') {
                const rootStyle = getComputedStyle(document.documentElement);
                const primaryColor = rootStyle.getPropertyValue('--product-primary-color').trim();

                if (primaryColor) {
                    let r = 0, g = 0, b = 0;
                    if (primaryColor.startsWith('#')) {
                        const hex = primaryColor.replace('#', '');
                        r = parseInt(hex.substring(0, 2), 16) || 0;
                        g = parseInt(hex.substring(2, 4), 16) || 0;
                        b = parseInt(hex.substring(4, 6), 16) || 0;
                    } else if (primaryColor.startsWith('rgb')) {
                        const match = primaryColor.match(/\d+/g);
                        if (match && match.length >= 3) {
                            r = parseInt(match[0], 10);
                            g = parseInt(match[1], 10);
                            b = parseInt(match[2], 10);
                        }
                    }
                    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
                    setIsPrimaryLight(yiq >= 128);
                }
            }
        };
        setTimeout(checkPrimaryColor, 50);
    }, []);

    const buttonTextColor = isPrimaryLight ? 'text-slate-900' : 'text-white';

    const disableButton = useMemo(() => {
        if (!product) return true;
        if (product?.variants && product.variants.length > 0 && !selectedVariant) return true;

        if (product.is_stock !== false) {
            if (selectedVariant) {
                if ((selectedVariant.product_variant_stock ?? 0) < 1) return true;
            } else {
                if ((product.product_stock ?? 0) < 1) return true;
            }
        }
        return false;
    }, [product, selectedVariant]);

    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [product]);

    const closeModal = () => {
        setProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    };

    const addCart = () => {
        if (handleCart) handleCart(product, selectedVariant, quantity);
        closeModal();
    };

    const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
    const currentFinalPrice = selectedVariant?.final_price ?? product?.final_price ?? 0;
    const currentDiscount = currentPrice - currentFinalPrice;

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity])

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 p-4 md:p-8 max-w-[1400px] mx-auto
            ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>

            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`text-center group flex flex-col items-center transition-all duration-700 ease-out
                            ${is_available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                    >
                        {/* Frame Gambar Minimalis - Editorial Style */}
                        <div className={`aspect-[4/5] w-full mb-8 overflow-hidden relative transition-all duration-700
                            ${isDarkMode ? "bg-[#121214]" : "bg-slate-50"} 
                            ${is_available ? "group-hover:shadow-2xl" : ""}`}>

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] ${is_available ? "group-hover:scale-105" : "opacity-30 grayscale"}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] 
                                        ${is_available ? "group-hover:scale-105" : "opacity-30 grayscale"}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] ${is_available ? "group-hover:scale-105" : "opacity-30 grayscale"}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {/* Decorative Border Frame (Muncul saat hover) */}
                            {is_available ? (
                                <div className={`absolute inset-4 border transition-all duration-1000 pointer-events-none opacity-0 group-hover:opacity-20 scale-95 group-hover:scale-100
                                    ${isDarkMode ? 'border-white' : 'border-black'}`} />
                            ) : null}

                            {/* Label Status */}
                            {label && is_available ? (
                                <div className={`absolute top-0 right-0 px-5 py-2.5 text-[9px] tracking-[0.25em] font-medium uppercase z-10 shadow-sm
                                    ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {label}
                                </div>
                            ) : !is_available ? (
                                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className={`text-[10px] tracking-[0.4em] uppercase font-light border-y py-2 px-6
                                        ${isDarkMode ? 'border-white/20 bg-black/40 text-white' : 'border-black/20 bg-white/60 text-black'}`}>
                                        Archived
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        {/* Info Produk - Tipografi Renggang (Pengecekan Ternary Aman) */}
                        {p.category ? (
                            <p className={`text-[9px] sm:text-[10px] tracking-[0.5em] uppercase mb-3 transition-opacity duration-500
                                ${is_available ? "opacity-40 group-hover:opacity-80" : "opacity-30"}`}>
                                {p.category}
                            </p>
                        ) : null}

                        <h3 className={`text-base sm:text-lg font-light tracking-[0.15em] uppercase leading-relaxed mb-4 line-clamp-1 w-full px-4
                            ${!is_available ? "opacity-50" : ""}`}>
                            {p.name}
                        </h3>

                        {/* Decorative Line Separator */}
                        <div className={`h-px transition-all duration-700 ease-out mb-4
                            ${isDarkMode ? 'bg-white' : 'bg-black'}
                            ${is_available ? "w-8 opacity-20 group-hover:w-16 group-hover:opacity-50" : "w-4 opacity-10"}`}
                        />

                        {/* Price Display */}
                        <div className="flex flex-col items-center gap-1.5 mt-auto">
                            {label && is_available ? (
                                <span className={`text-[9px] line-through tracking-widest uppercase
                                    ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                    {formatIDR(p.price)}
                                </span>
                            ) : null}
                            <span className={`font-medium text-sm tracking-widest uppercase
                                ${!is_available ? "opacity-30 font-light" : ""}`}>
                                {is_available ? formatIDR(finalPrice) : "Out of Stock"}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* 💎 1. PORTAL MURNI - Editorial Layout */}
            {mounted && product ? createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-10 animate-in fade-in duration-300">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* Modal Container */}
                    <div className={`relative w-full md:max-w-5xl h-[92vh] md:h-[85vh] flex flex-col md:flex-row-reverse overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-500 rounded-t-[2.5rem] md:rounded-[2rem] border font-sans
                        ${isDarkMode ? 'bg-[#0f0f11] text-zinc-100 border-white/10' : 'bg-[#fafafa] text-slate-900 border-slate-200'}`}>

                        {/* Drag Handle Mobile */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-300/30 rounded-full md:hidden z-[100]" />

                        {/* Close Button */}
                        <button onClick={closeModal} className={`absolute top-5 right-5 z-[100] p-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/50 text-white border-white/20' : 'bg-white/80 text-black border-black/10 shadow-sm'}`}>
                            <X size={18} strokeWidth={1.5} />
                        </button>

                        {/* Bagian Kanan: Visual Frame */}
                        <div className={`w-full md:w-1/2 h-[45vh] md:h-full relative shrink-0 overflow-hidden
                            ${isDarkMode ? "bg-[#18181b]" : "bg-zinc-100"}`}>

                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out hover:scale-105"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {product?.category ? (
                                <div className={`hidden md:block absolute top-16 left-0 -ml-1 px-8 py-3 shadow-xl tracking-[0.3em] text-xs font-light uppercase border-y
                                    ${isDarkMode ? "bg-[#0f0f11]/90 border-white/10 backdrop-blur-md" : 'bg-white/90 border-black/10 backdrop-blur-md'}`}>
                                    {product?.category}
                                </div>
                            ) : null}

                            {product?.discount_price ? (
                                <div className={`absolute top-6 left-6 md:left-auto md:right-6 px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl
                                    ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    -{Promo(product, selectedVariant)}
                                </div>
                            ) : null}
                        </div>

                        {/* 💎 2. SCROLL FIX - Bagian Kiri: Detail Informasi */}
                        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-10 md:p-14 flex flex-col">
                                <div className="space-y-12 mb-auto">

                                    {/* Header Info */}
                                    <div className="space-y-6 text-center md:text-left mt-2 md:mt-0">
                                        {product?.category ? (
                                            <span className="md:hidden text-[10px] font-medium uppercase tracking-[0.4em] opacity-50 block">
                                                {product?.category}
                                            </span>
                                        ) : null}
                                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.1em] uppercase leading-tight">
                                            {product?.name}
                                        </h2>
                                        <div className={`w-12 h-px mx-auto md:mx-0 ${isDarkMode ? 'bg-white/30' : 'bg-black/30'}`} />
                                    </div>

                                    {/* Harga Block */}
                                    <div className={`p-8 border ${isDarkMode ? "bg-[#18181b] border-white/10" : "bg-white border-black/10"}`}>
                                        <div className="space-y-3 text-center md:text-left">
                                            <p className="text-[9px] font-medium uppercase tracking-[0.3em] opacity-40">Detail Harga</p>

                                            <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
                                                <span className="text-2xl sm:text-3xl font-medium tracking-widest uppercase">
                                                    {formatIDR(currentFinalPrice)}
                                                </span>
                                                {currentDiscount > 0 ? (
                                                    <span className="text-sm opacity-40 line-through tracking-widest uppercase">
                                                        {formatIDR(currentPrice)}
                                                    </span>
                                                ) : null}
                                            </div>

                                            {currentDiscount > 0 ? (
                                                <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 border text-[9px] font-medium uppercase tracking-widest
                                                    ${isDarkMode ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-emerald-500/20 text-emerald-600 bg-emerald-50'}`}>
                                                    <Tag size={12} />
                                                    Save {formatIDR(currentDiscount)} {product?.percent_discount && `(${Promo(product, selectedVariant)})`}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* 📝 3. DESKRIPSI AMAN */}
                                    {product?.description ? (
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40 text-center md:text-left">Description</h4>
                                            <div className="text-sm opacity-70 leading-loose font-light text-center md:text-left mx-auto md:mx-0 max-w-lg">
                                                <ExpandableHTML htmlContent={product.description} />
                                            </div>
                                        </div>
                                    ) : null}

                                    {/* Spesifikasi & Input */}
                                    <div className={`py-10 border-t space-y-10 ${isDarkMode ? "border-white/10" : "border-black/10"}`}>

                                        {/* 🚫 4. VARIAN AMAN */}
                                        {product?.variants && product.variants.length > 0 ? (
                                            <div className="space-y-6">
                                                <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40 text-center md:text-left">Variants</h4>
                                                <VariantPicker
                                                    isStock={product?.is_stock}
                                                    variants={product.variants}
                                                    selectedVariant={selectedVariant}
                                                    setSelectedVariant={setSelectedVariant}
                                                    isDarkMode={isDarkMode}
                                                />
                                            </div>
                                        ) : null}

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4">
                                            {/* 🚫 5. QTY AMAN */}
                                            {product?.is_qty ? (
                                                <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-4">
                                                    <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">Quantity</h4>
                                                    <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                                </div>
                                            ) : null}

                                            <div className="text-center sm:text-right w-full sm:w-auto">
                                                <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40 mb-3">Subtotal</h4>
                                                <p className="text-xl font-medium tracking-widest uppercase">
                                                    {formatIDR((currentFinalPrice) * quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="mt-8 shrink-0">
                                    <button
                                        disabled={disableButton}
                                        onClick={addCart}
                                        className={`w-full py-5 font-medium uppercase tracking-[0.3em] text-xs transition-all duration-500 flex items-center justify-center gap-3 border border-transparent disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]
                                            bg-[var(--product-primary-color)] ${buttonTextColor}`}
                                    >
                                        Process Order <ArrowRight size={16} strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>,
                document.body
            ) : null}
        </div>
    )
}

export default Thirteen;