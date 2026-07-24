"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 1. WAJIB PORTAL!
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, Zap, ChevronRight } from 'lucide-react';
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

const Ten = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // 💎 STATE PORTAL
    const [mounted, setMounted] = useState(false);

    // 🎨 6. YIQ COLOR DETECTOR
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

    // 🛡️ ANTI-NABRAK LOGIC
    const isClashingLight = !isDarkMode && isPrimaryLight;
    const isClashingDark = isDarkMode && !isPrimaryLight;

    const clashBorderClass = isClashingLight ? 'border border-slate-300' : isClashingDark ? 'border border-slate-600' : 'border border-transparent';
    const priceTextColor = isClashingLight ? 'text-slate-900' : isClashingDark ? 'text-white' : 'text-[var(--product-primary-color)]';
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
        document.body.style.overflow = product ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [product]);

    const closeModal = () => {
        setProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    }

    const addCart = () => {
        if (handleCart) handleCart(product, selectedVariant, quantity);
        closeModal();
    };

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity])

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* 🌟 IOS APP-LIKE GRID (Clean, Borderless, Soft Shadows) */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 p-4 md:p-8'>
                {products?.map((p, i) => {
                    const { finalPrice, label } = getPromoDetails(p);
                    const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                    return (
                        <div
                            key={i}
                            onClick={() => is_available && setProduct(p)}
                            className={`group flex flex-col gap-3 transition-all duration-300
                                ${!is_available ? 'opacity-60 grayscale-[0.4] cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                        >
                            {/* Super Rounded Image Container */}
                            <div className={`relative aspect-[4/5] w-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow duration-300
                                ${isDarkMode ? 'bg-[#1a1a1c]' : 'bg-slate-100'}`}>

                                {/* Frosted Promo Tag */}
                                {label && is_available && (
                                    <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm z-10 backdrop-blur-md
                                        bg-[var(--product-primary-color)]/90 ${buttonTextColor} ${clashBorderClass}`}>
                                        <Zap size={12} fill="currentColor" /> {label}
                                    </div>
                                )}

                                {!p?.image ? (
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                        <Icon icon="mynaui:image" className={`w-14 h-14 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                                        <Icon icon={p.image} className={`w-14 h-14 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                )}

                                {!is_available && (
                                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-10">
                                        <span className="bg-white/90 text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md uppercase tracking-widest backdrop-blur-md">
                                            Habis
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Clean Info (Outside the card, like App Store) */}
                            <div className="flex flex-col px-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1
                                    ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {p.category}
                                </span>

                                <h3 className={`font-semibold text-sm md:text-base leading-snug line-clamp-2 mb-1.5
                                    ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {p.name}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2 mt-auto">
                                    <p className={`text-base md:text-lg font-bold tracking-tight ${priceTextColor}`}>
                                        {formatIDR(finalPrice)}
                                    </p>
                                    {label && is_available && (
                                        <span className={`text-[10px] font-medium line-through ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 💎 1. PORTAL MODAL (NATIVE APP FEEL: Frosted Glass & Drag Handle) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-10 animate-in fade-in duration-300">

                    {/* Deep Blur Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* App Sheet Container (Frosted Glass Effect) */}
                    <div className={`relative w-full md:max-w-4xl lg:max-w-5xl h-[92vh] md:h-auto md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500 rounded-t-[2.5rem] md:rounded-[3rem] border backdrop-blur-2xl
                        ${isDarkMode ? 'bg-[#111113]/85 text-white border-white/10' : 'bg-white/90 text-slate-900 border-white/50'}`}>

                        {/* 📱 Mobile Drag Handle (Native iOS Look) */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-slate-300/50 md:hidden z-[100]" />

                        {/* Close Button Float (Desktop Only) */}
                        <button onClick={closeModal} className={`hidden md:flex absolute top-6 right-6 z-[100] p-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/20 text-white border-white/10 hover:bg-black/40' : 'bg-white/50 text-slate-900 border-white hover:bg-white shadow-sm'}`}>
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Close Button Float (Mobile Only) */}
                        <button onClick={closeModal} className={`md:hidden absolute top-4 right-4 z-[100] p-2 rounded-full backdrop-blur-md border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/20 text-white border-white/10' : 'bg-slate-100/50 text-slate-900 border-white shadow-sm'}`}>
                            <X size={16} strokeWidth={2.5} />
                        </button>

                        {/* LEFT: Seamless Image Area */}
                        <div className="w-full md:w-[45%] h-[40vh] md:h-auto relative shrink-0">
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-24 h-24 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-24 h-24 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}
                            {/* Smooth Fade Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 md:from-black/10 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* RIGHT: Content Area - 🛠️ BUG SCROLL FIXED DENGAN `flex-1 min-h-0` */}
                        <div className="w-full md:w-[55%] flex flex-col flex-1 min-h-0 z-10 relative">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 md:p-10 lg:p-12 pb-50 md:pb-12 mt-4 md:mt-0">

                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4
                                    ${isDarkMode ? "bg-white/10 text-slate-300" : "bg-slate-200/50 text-slate-600"}`}>
                                    {product?.category}
                                </span>

                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-4">
                                    {product?.name}
                                </h2>

                                <div className="flex items-end gap-3 mb-8">
                                    <p className={`text-4xl sm:text-5xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </p>
                                    {product?.discount_price ? (
                                        <p className={`text-sm font-semibold line-through mb-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </p>
                                    ) : null}
                                </div>

                                <hr className={`border-none h-[1px] mb-8 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`} />

                                {/* 📝 3. DESKRIPSI AMAN */}
                                {product?.description ? (
                                    <div className={`text-sm leading-relaxed mb-10 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                        <ExpandableHTML htmlContent={product.description} />
                                    </div>
                                ) : null}

                                <div className="space-y-8">
                                    {/* 🚫 2. VARIAN AMAN */}
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div className="space-y-3">
                                            <p className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                Pilihan Variasi
                                            </p>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {/* 🚫 4. QTY AMAN */}
                                    {product?.is_qty ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <p className={`text-xs font-bold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                    Jumlah Pesanan
                                                </p>
                                                {product.is_stock !== false && (
                                                    <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        Sisa stok: {selectedVariant?.product_variant_stock ?? product?.product_stock}
                                                    </span>
                                                )}
                                            </div>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* 📱 5. Sticky Floating Bottom Action Bar */}
                            <div className={`absolute md:relative bottom-0 left-0 right-0 p-5 md:p-8 shrink-0 flex flex-col gap-4 z-20 backdrop-blur-2xl border-t
                                ${isDarkMode ? "bg-[#111113]/80 border-white/10" : "bg-white/80 border-slate-200/50"}`}>

                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        Total Pembayaran
                                    </span>
                                    <span className={`text-2xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                    </span>
                                </div>

                                {/* 🎨 6. Tombol YIQ Rounded Pill (Empuk & Aman) */}
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-4 rounded-full font-bold text-sm transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'Stok Habis'
                                        : <>Tambah ke Keranjang <ChevronRight size={18} strokeWidth={2.5} /></>}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Ten;