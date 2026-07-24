"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 1. WAJIB PORTAL!
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, Zap, MoveUpRight, ShieldCheck, Tag } from 'lucide-react';
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

const Eleven = ({ products, isDarkMode, handleCart }: Props) => {
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
            {/* 🌟 SPATIAL BENTO GRID (Immersive, Floating Glass) */}
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 p-4 md:p-8 max-w-[1400px] mx-auto auto-rows-[220px] md:auto-rows-[280px]'>
                {products?.map((p, i) => {
                    const { finalPrice, label } = getPromoDetails(p);
                    const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                    // Dinamika Bento: Kelipatan 5 jadi Hero Card
                    const isLarge = i % 5 === 0;

                    return (
                        <div
                            key={i}
                            onClick={() => is_available && setProduct(p)}
                            className={`group relative rounded-[2rem] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col justify-end
                                ${isLarge ? "col-span-2 row-span-2 md:col-span-4 lg:col-span-4" : "col-span-2 row-span-1 md:col-span-2 lg:col-span-2"}
                                ${is_available
                                    ? `cursor-pointer ${isDarkMode ? "hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:-translate-y-2 z-10" : "shadow-sm hover:shadow-2xl hover:-translate-y-2 z-10"}`
                                    : "cursor-not-allowed opacity-60 grayscale-[0.6]"
                                }`}
                        >
                            {/* Spatial Image Canvas */}
                            <div className={`absolute inset-0 overflow-hidden ${isDarkMode ? "bg-[#111113]" : "bg-slate-100"}`}>
                                {!p?.image ? (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-1000 ${is_available ? "group-hover:scale-110" : ""}`}>
                                        <Icon icon="mynaui:image" className={`w-20 h-20 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className={`w-full h-full object-cover transition-transform duration-1000 ease-out 
                                            ${is_available ? "group-hover:scale-110" : ""}`}
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-1000 ${is_available ? "group-hover:scale-110" : ""}`}>
                                        <Icon icon={p.image} className={`w-20 h-20 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                )}
                            </div>

                            {/* Deep Spatial Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none transition-opacity duration-500
                                ${isDarkMode ? "from-black/90 via-black/30 to-transparent" : "from-black/70 via-black/10 to-transparent"} 
                                ${is_available ? "opacity-70 group-hover:opacity-90" : "opacity-90"}`}
                            />

                            {/* Top Badges (Glassmorphism) */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                                {label && is_available ? (
                                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border flex items-center gap-1.5
                                        bg-[var(--product-primary-color)]/90 ${buttonTextColor} ${clashBorderClass} border-white/20`}>
                                        <Zap size={12} fill="currentColor" /> {label}
                                    </div>
                                ) : !is_available ? (
                                    <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10">
                                        Sold Out
                                    </div>
                                ) : <div />}

                                {is_available && (
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300
                                        ${isDarkMode ? 'bg-white/10 border-white/20 text-white group-hover:bg-white group-hover:text-black' : 'bg-black/10 border-black/10 text-white group-hover:bg-white group-hover:text-black'}`}>
                                        <MoveUpRight size={16} className="group-hover:rotate-12 transition-transform" />
                                    </div>
                                )}
                            </div>

                            {/* Content Layer (Floating Typography) */}
                            <div className="relative z-20 p-5 md:p-6 w-full flex flex-col gap-1.5">
                                <span className={`w-max px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest backdrop-blur-sm border
                                    ${isDarkMode ? "bg-white/10 border-white/10 text-slate-300" : "bg-black/20 border-white/20 text-white"}`}>
                                    {p.category}
                                </span>

                                <h3 className={`font-black leading-[1.1] tracking-tight text-white drop-shadow-lg line-clamp-2 mt-1
                                    ${isLarge ? "text-3xl md:text-5xl" : "text-xl md:text-2xl"}`}>
                                    {p.name}
                                </h3>

                                <div className={`flex flex-wrap items-end gap-3 mt-1 ${isLarge ? "mt-3" : ""}`}>
                                    <p className={`font-black drop-shadow-md tracking-tighter ${priceTextColor}
                                        ${isLarge ? "text-2xl md:text-4xl" : "text-xl"} 
                                        ${is_available ? "text-[var(--product-primary-color)]" : "text-slate-400 line-through"}`}>
                                        {formatIDR(finalPrice)}
                                    </p>

                                    {label && is_available && (
                                        <span className="text-xs md:text-sm line-through opacity-80 font-medium text-white/80 drop-shadow-sm mb-1">
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 💎 1. PORTAL MODAL (Spatial Floating Island - FIXED SCROLL MOBILE) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">

                    {/* Immersive Blur Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl cursor-pointer"
                        onClick={closeModal}
                    />

                    {/* Spatial Island Container (Floating on ALL devices) */}
                    <div className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 rounded-[2rem] md:rounded-[2.5rem] border
                        ${isDarkMode ? 'bg-[#0a0a0a]/90 text-white border-white/10' : 'bg-white/95 text-slate-900 border-white/50 backdrop-blur-2xl'}`}>

                        {/* Floating Close Button */}
                        <button onClick={closeModal} className={`absolute top-4 right-4 md:top-6 md:right-6 z-[100] p-2.5 rounded-full backdrop-blur-xl border transition-all active:scale-90
                            ${isDarkMode ? 'bg-black/50 text-white border-white/20 hover:bg-white hover:text-black' : 'bg-white/80 text-slate-900 border-slate-200 hover:bg-black hover:text-white shadow-lg'}`}>
                            <X size={18} strokeWidth={2.5} />
                        </button>

                        {/* LEFT: Cinematic Image Block */}
                        <div className={`w-full md:w-[45%] h-[35vh] md:h-auto relative shrink-0 overflow-hidden
                            ${isDarkMode ? "bg-[#161618]" : "bg-slate-100"}`}>
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-28 h-28 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-28 h-28 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                            {/* Inner Shadow for Depth */}
                            <div className="absolute inset-0 shadow-[inset_0_-40px_80px_rgba(0,0,0,0.3)] pointer-events-none md:hidden" />
                            <div className="absolute inset-0 shadow-[inset_-40px_0_80px_rgba(0,0,0,0.2)] pointer-events-none hidden md:block" />
                        </div>

                        {/* RIGHT: Scrollable Content - 🛠️ BUG SCROLL FIXED DENGAN `flex-1 min-h-0` */}
                        <div className="w-full md:w-[55%] flex flex-col flex-1 min-h-0 z-10 relative">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10 lg:p-12 pb-50 md:pb-12">

                                <div className="flex items-center gap-1.5 mb-4">
                                    <Tag size={12} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {product?.category}
                                    </span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-6">
                                    {product?.name}
                                </h2>

                                <div className="md:flex items-end gap-3 mb-8">
                                    <p className={`text-4xl md:text-5xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </p>
                                    {product?.discount_price ? (
                                        <p className={`text-sm md:text-base font-semibold line-through mb-1.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </p>
                                    ) : null}
                                </div>

                                <hr className={`border-dashed mb-8 ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />

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
                                            <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                Pilih Variasi
                                            </p>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {/* 🚫 4. QTY AMAN */}
                                    {product?.is_qty ? (
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                    Kuantitas
                                                </p>
                                                {product.is_stock !== false && (
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                        Sisa: {selectedVariant?.product_variant_stock ?? product?.product_stock}
                                                    </span>
                                                )}
                                            </div>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* 📱 5. Floating Action Bottom Bar (Glassmorphism) */}
                            <div className={`absolute md:relative bottom-0 left-0 right-0 p-5 md:p-8 shrink-0 flex flex-col gap-4 z-20 backdrop-blur-2xl border-t
                                ${isDarkMode ? "bg-black/60 border-white/10" : "bg-white/80 border-slate-200/50"}`}>

                                <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        Total Akhir
                                    </span>
                                    <span className={`text-2xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                    </span>
                                </div>

                                {/* 🎨 6. Tombol YIQ Glow & Aman */}
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-4 md:py-5 rounded-[1.2rem] font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'STOK HABIS'
                                        : <>Selesaikan Pesanan <ShieldCheck size={18} strokeWidth={2.5} /></>}
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

export default Eleven;