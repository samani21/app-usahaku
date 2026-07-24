"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 1. WAJIB PORTAL!
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, Zap, ArrowRight, Tag } from 'lucide-react';
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

const Eight = ({ products, isDarkMode, handleCart }: Props) => {
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
        <div>
            {/* 🌟 SLEEK TECH GRID (Clean, Thin Borders, Maximum Readability) */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-4 md:p-8 max-w-[1400px] mx-auto'>
                {products?.map((p, i) => {
                    const { finalPrice, label } = getPromoDetails(p);
                    const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                    return (
                        <div
                            key={i}
                            onClick={() => is_available && setProduct(p)}
                            className={`group flex flex-col rounded-[1.5rem] overflow-hidden transition-all duration-300 ease-out border
                                ${isDarkMode
                                    ? 'bg-[#0a0a0a] border-white/10 hover:border-white/20 hover:bg-[#111]'
                                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}
                                ${is_available ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-60 grayscale-[0.3]'}`}
                        >
                            {/* Image Section (Clean Gray Backdrop) */}
                            <div className={`relative aspect-square w-full overflow-hidden shrink-0 ${isDarkMode ? 'bg-[#161618]' : 'bg-slate-50'}`}>

                                {/* Promo Tag (YIQ Fallback Applied) */}
                                {label && is_available && (
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm z-10
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}>
                                        <Zap size={10} fill="currentColor" /> {label}
                                    </div>
                                )}

                                {!p?.image ? (
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                        <Icon icon="mynaui:image" className={`w-12 h-12 opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                                        <Icon icon={p.image} className={`w-12 h-12 opacity-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} />
                                    </div>
                                )}

                                {!is_available && (
                                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-10">
                                        <span className="bg-white text-slate-900 px-3 py-1 rounded-md text-[10px] font-bold shadow-md uppercase tracking-wider">
                                            Habis
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Info Section (Structured & Clean) */}
                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Tag size={10} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                    <span className={`text-[9px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {p.category}
                                    </span>
                                </div>

                                <h3 className={`font-semibold text-sm leading-snug line-clamp-2 mb-4
                                    ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    {p.name}
                                </h3>

                                <div className="mt-auto flex items-end justify-between">
                                    <div className="flex flex-col">
                                        {label && is_available && (
                                            <span className={`text-[10px] font-medium line-through mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                {formatIDR(p.price)}
                                            </span>
                                        )}
                                        <p className={`text-base sm:text-lg font-bold tracking-tight ${priceTextColor}`}>
                                            {formatIDR(finalPrice)}
                                        </p>
                                    </div>

                                    {is_available && (
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300
                                            ${isDarkMode ? 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-900'}`}>
                                            <ArrowRight size={14} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 💎 1. PORTAL MODAL (Floating on Desktop, Bottom Sheet on Mobile + FIXED SCROLL) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-8 animate-in fade-in duration-200">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* Modal Container */}
                    <div className={`relative w-full md:max-w-4xl lg:max-w-5xl h-[88vh] md:h-auto md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-300 rounded-t-[1.5rem] md:rounded-[2rem] border
                        ${isDarkMode ? 'bg-[#0a0a0a] text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'}`}>

                        {/* Close Button Float */}
                        <button onClick={closeModal} className={`absolute top-4 right-4 z-[100] p-2 rounded-full backdrop-blur-md border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/40 text-white border-white/10 hover:bg-black/60' : 'bg-white/80 text-slate-900 border-slate-200 hover:bg-white shadow-sm'}`}>
                            <X size={18} strokeWidth={2.5} />
                        </button>

                        {/* LEFT: Clean Image Area */}
                        <div className={`w-full md:w-1/2 h-[35vh] md:h-auto relative shrink-0 ${isDarkMode ? "bg-[#161618]" : "bg-slate-50"}`}>
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-24 h-24 opacity-20 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-24 h-24 opacity-20 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* RIGHT: Scrollable Content - 🛠️ BUG SCROLL FIXED DENGAN `flex-1 min-h-0` */}
                        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 z-10 relative">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10 pb-50 md:pb-10">

                                <div className="flex items-center gap-1.5 mb-4">
                                    <Tag size={12} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {product?.category}
                                    </span>
                                </div>

                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-6">
                                    {product?.name}
                                </h2>

                                <div className="flex items-end gap-3 mb-8">
                                    <p className={`text-4xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </p>
                                    {product?.discount_price ? (
                                        <p className={`text-sm font-semibold line-through mb-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </p>
                                    ) : null}
                                </div>

                                <hr className={`border-dashed mb-8 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />

                                {/* 📝 3. DESKRIPSI AMAN (Tanpa Angka 0) */}
                                {product?.description ? (
                                    <div className={`text-sm leading-relaxed mb-10 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                        <ExpandableHTML htmlContent={product.description} />
                                    </div>
                                ) : null}

                                <div className="space-y-8">
                                    {/* 🚫 2. VARIAN AMAN (Tanpa Angka 0) */}
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div className="space-y-4">
                                            <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                Varian Tersedia
                                            </p>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {/* 🚫 4. QTY AMAN (Tanpa Angka 0) */}
                                    {product?.is_qty ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                    Kuantitas
                                                </p>
                                                {product.is_stock !== false && (
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                        Stok: {selectedVariant?.product_variant_stock ?? product?.product_stock}
                                                    </span>
                                                )}
                                            </div>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* 📱 5. Sticky Bottom Action Bar */}
                            <div className={`absolute md:relative bottom-0 left-0 right-0 p-5 md:p-8 shrink-0 border-t backdrop-blur-xl
                                ${isDarkMode ? "border-white/10 bg-[#0a0a0a]/90" : "border-slate-200 bg-white/90"}`}>

                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        Total Harga
                                    </span>
                                    <span className={`text-2xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                    </span>
                                </div>

                                {/* 🎨 6. Tombol YIQ (Anti Nabrak Warna Background) */}
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'STOK HABIS'
                                        : <>Tamba ke Keranjang <ShoppingBag size={16} strokeWidth={2} /></>}
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

export default Eight;