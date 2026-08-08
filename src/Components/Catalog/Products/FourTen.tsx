"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 PORTAL MURNI
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Minus, Plus, ShoppingBag, X, Tag, ArrowRight, Check } from 'lucide-react';
import AlertWrapper from './AlertWrapper';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatIDR } from '@/types/FormtRupiah';
import ExpandableHTML from './ExpandableHTML';
import { getPromoDetails, Promo } from './PromoType';
import { Icon } from '@iconify/react';

type Props = {
    products: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

const FourTen = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // 💎 STATE PORTAL
    const [mounted, setMounted] = useState(false);

    // 🎨 YIQ COLOR DETECTOR (Biar tombol utama gak nabrak warna)
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
    }, [selectedVariant, quantity]);

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 p-4 md:p-8 max-w-[1400px] mx-auto
            ${isDarkMode ? 'text-zinc-100' : 'text-slate-800'}`}>

            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative flex flex-col rounded-[2rem] p-3 transition-all duration-500
                            ${is_available
                                ? `cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
                                   ${isDarkMode ? 'bg-[#18181b] border border-white/5 hover:border-white/10' : 'bg-white border border-slate-100 hover:border-slate-200 shadow-sm'}`
                                : `cursor-not-allowed opacity-60 grayscale-[0.5]
                                   ${isDarkMode ? 'bg-[#121212] border border-white/5' : 'bg-slate-50 border border-slate-100'}`
                            }`}
                    >
                        {/* Image Section - Minimalist Floating Style */}
                        <div className={`relative aspect-square rounded-[1.5rem] overflow-hidden mb-5
                            ${isDarkMode ? 'bg-[#0f0f11]' : 'bg-slate-100/50'}`}>

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${is_available ? "group-hover:scale-110" : ""}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] 
                                        ${is_available ? "group-hover:scale-110" : ""}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${is_available ? "group-hover:scale-110" : ""}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {/* Elegant Gradient Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Status Badge - Pill Style */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                                {is_available ? (
                                    label ? (
                                        <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {label}
                                        </div>
                                    ) : <div />
                                ) : (
                                    <div className="bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full">
                                        Sold Out
                                    </div>
                                )}

                                {/* Hover Action Icon */}
                                {is_available ? (
                                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                                        <ArrowRight size={14} />
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* Content Section - Clean Typography */}
                        <div className="px-2 pb-2 flex-1 flex flex-col">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Tag size={12} className={isDarkMode ? "text-zinc-500" : "text-slate-400"} />
                                <span className={`text-[10px] font-medium tracking-widest uppercase
                                    ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                    {p.category || 'Product'}
                                </span>
                            </div>

                            <h3 className={`font-semibold text-lg leading-snug tracking-tight line-clamp-2 transition-colors duration-300 mb-4`}>
                                {p.name}
                            </h3>

                            <div className="mt-auto flex items-end justify-between">
                                <div className="flex flex-col">
                                    {label && is_available ? (
                                        <span className={`text-[11px] line-through font-medium mb-0.5
                                            ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    ) : null}
                                    <p className="text-xl font-bold tracking-tight">
                                        {formatIDR(finalPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 💎 1. PORTAL MURNI - Minimalist Floating Modal / Bottom Sheet */}
            {mounted && product ? createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8 animate-in fade-in duration-300">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer transition-opacity"
                        onClick={closeModal}
                    />

                    {/* Modal Container */}
                    <div className={`relative w-full md:max-w-5xl h-[92vh] md:h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-500 rounded-t-[2.5rem] md:rounded-[2rem] border font-sans
                        ${isDarkMode ? 'bg-[#0f0f11] text-zinc-100 border-white/10' : 'bg-white text-slate-800 border-slate-200'}`}>

                        {/* Drag Handle Mobile */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300/50 rounded-full md:hidden z-[100]" />

                        {/* Close Button */}
                        <button onClick={closeModal} className={`absolute top-5 right-5 z-[100] p-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/50 text-white border-white/20' : 'bg-white/80 text-black border-black/10 shadow-sm'}`}>
                            <X size={18} strokeWidth={2} />
                        </button>

                        {/* Visual Section - Edge to Edge on Mobile, Padded on Desktop */}
                        <div className={`w-full md:w-[45%] lg:w-[50%] h-[40vh] md:h-full relative shrink-0 overflow-hidden flex items-center justify-center
                            ${isDarkMode ? "bg-[#121212]" : "bg-slate-50"}`}>

                            {/* Background Blur Effect */}
                            {(selectedVariant?.image ?? product?.image)?.startsWith('https') ? (
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110"
                                    style={{ backgroundImage: `url(${selectedVariant?.image ?? product?.image})` }}
                                />
                            ) : null}

                            {/* Main Image */}
                            <div className="relative w-full h-full p-0 md:p-8 lg:p-12">
                                {!(selectedVariant?.image ?? product?.image) ? (
                                    <div className={`w-full h-full flex items-center justify-center md:rounded-[2rem] shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-200'}`}>
                                        <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                    </div>
                                ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                    <img
                                        src={selectedVariant?.image ?? product?.image}
                                        className="w-full h-full object-cover md:object-contain md:rounded-[2rem] shadow-2xl transition-all duration-700"
                                        alt={product?.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center md:rounded-[2rem] shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-200'}`}>
                                        <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                    </div>
                                )}

                                {/* Floating Discount Badge */}
                                {product?.discount_price ? (
                                    <div className="absolute top-4 left-4 md:top-12 md:left-12 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full font-semibold text-xs tracking-wide shadow-xl flex items-center gap-2 border border-slate-100">
                                        <span className="w-2 h-2 rounded-full bg-[var(--product-primary-color)] animate-pulse" />
                                        Save {Promo(product, selectedVariant)}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {/* 💎 2. SCROLL FIX - Info Section */}
                        <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col flex-1 min-h-0">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-10 lg:p-12 flex flex-col">
                                <div className="space-y-10 mb-auto mt-4 md:mt-0">

                                    {/* Header */}
                                    <div className="space-y-4">
                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase
                                            ${isDarkMode ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                                            {product?.category || 'Collection'}
                                        </span>
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                                            {product?.name}
                                        </h2>

                                        <div className="flex items-baseline gap-4 pt-2">
                                            <span className="text-3xl font-light tracking-tight">
                                                {formatIDR(currentFinalPrice)}
                                            </span>
                                            {currentDiscount > 0 ? (
                                                <span className="text-lg opacity-40 line-through font-light">
                                                    {formatIDR(currentPrice)}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* 🚫 3. DESKRIPSI AMAN */}
                                    {product?.description ? (
                                        <div className={`text-sm leading-relaxed font-light
                                            ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                                            <ExpandableHTML htmlContent={product.description} />
                                        </div>
                                    ) : null}

                                    {/* Options Area */}
                                    <div className="space-y-8 pt-2">

                                        {/* 🚫 4. VARIAN AMAN */}
                                        {product?.variants && product.variants.length > 0 ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium tracking-wide">Select Variant</p>
                                                </div>
                                                <VariantPicker
                                                    isStock={product?.is_stock}
                                                    variants={product.variants}
                                                    selectedVariant={selectedVariant}
                                                    setSelectedVariant={setSelectedVariant}
                                                    isDarkMode={isDarkMode}
                                                />
                                            </div>
                                        ) : null}

                                        {/* 🚫 5. QTY AMAN */}
                                        {product?.is_qty ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium tracking-wide">Quantity</p>
                                                    <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                                        {selectedVariant?.product_variant_stock ?? product?.stock} Available
                                                    </p>
                                                </div>
                                                <QtySelector
                                                    product={product}
                                                    selectedVariant={selectedVariant}
                                                    quantity={quantity}
                                                    setQuantity={setQuantity}
                                                    isDarkMode={isDarkMode}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Footer - Fixed to bottom */}
                            <div className={`p-6 sm:p-10 lg:p-12 pt-6 mt-auto border-t flex flex-col gap-5 shrink-0
                                ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>

                                <div className="flex justify-between items-end">
                                    <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Subtotal</span>
                                    <span className="text-2xl font-bold tracking-tight">
                                        {formatIDR(currentFinalPrice * quantity)}
                                    </span>
                                </div>

                                {/* 🎨 6. TOMBOL YIQ ANTI-NABRAK */}
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-4 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:opacity-90
                                        ${isDarkMode ? "bg-white text-black hover:bg-zinc-200" : `bg-[var(--product-primary-color)] ${buttonTextColor}`}`}
                                >
                                    <ShoppingBag size={18} />
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                    </div>
                </div>,
                document.body
            ) : null}
        </div>
    );
};

export default FourTen;