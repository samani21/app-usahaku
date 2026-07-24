"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 PORTAL MURNI = SCROLL HP AMAN
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Check, Plus, ShoppingCart, Zap, X, Sparkles } from 'lucide-react';
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
    const [mounted, setMounted] = useState(false);

    // 🎨 YIQ COLOR DETECTOR (Menjaga teks tombol tetap kontras)
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

    // Warna teks tombol berdasarkan YIQ
    const buttonTextColor = isPrimaryLight ? 'text-slate-900' : 'text-white';

    // Warna teks utama (Hitam di Light Mode, Putih di Dark Mode)
    const textColorMain = isDarkMode ? 'text-white' : 'text-slate-900';
    const textColorSub = isDarkMode ? 'text-slate-400' : 'text-slate-500';

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

    const addCart = () => {
        if (handleCart) handleCart(product, selectedVariant, quantity);
        setProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    };

    const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
    const currentFinalPrice = selectedVariant?.final_price ?? product?.final_price ?? 0;

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity]);

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* 🌟 HOLOGRAPHIC GRID */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 p-4 md:p-8'>
                {products?.map((p, i) => {
                    const { finalPrice, label } = getPromoDetails(p);
                    const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                    return (
                        <div
                            key={i}
                            onClick={() => is_available && setProduct(p)}
                            className={`group relative p-[4px] rounded-[2.5rem] transition-all duration-500 ease-out h-[400px] flex flex-col
                                ${is_available
                                    ? "bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-500 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-2"
                                    : "bg-slate-300 cursor-not-allowed opacity-75 grayscale"}`}
                        >

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between z-20 pointer-events-none">
                                {label && is_available ? (
                                    <div className={`backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg flex items-center gap-1.5
                                        bg-[var(--product-primary-color)] ${buttonTextColor}`}>
                                        <Sparkles size={12} fill="currentColor" /> {label}
                                    </div>
                                ) : !is_available ? (
                                    <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg">
                                        Habis
                                    </div>
                                ) : <div />}
                            </div>

                            {/* Inner Glass Card */}
                            <div className={`h-full w-full rounded-[2.3rem] p-4 flex flex-col justify-between transition-colors duration-500 relative z-10 backdrop-blur-2xl border overflow-hidden
                                ${isDarkMode ? 'bg-[#0f0f11]/85 border-white/10 text-white' : 'bg-white/90 border-white/50 text-slate-900'}
                                ${!is_available ? 'opacity-90' : ''}`}>

                                {/* Image Container */}
                                <div className={`relative w-full h-48 shrink-0 rounded-[1.8rem] overflow-hidden transition-all duration-500 shadow-inner
                                    ${is_available ? (isDarkMode ? "bg-zinc-800" : "bg-slate-100") : "bg-slate-200"}`}>

                                    {!p?.image ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                        </div>
                                    ) : p.image.startsWith('https') ? (
                                        <img
                                            src={p.image}
                                            className={`w-full h-full object-cover transition-transform duration-700 ease-out
                                                ${is_available ? 'group-hover:scale-110' : ''}`}
                                            alt={p.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                        </div>
                                    )}

                                    {/* Quick Action Button Hover */}
                                    {is_available && (
                                        <div className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-xl
                                            bg-[var(--product-primary-color)] ${buttonTextColor}`}>
                                            <Plus size={20} strokeWidth={2.5} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 pt-4 justify-between">
                                    <div className="space-y-1.5">
                                        <span className={`text-[9px] font-black tracking-[0.2em] uppercase ${textColorSub}`}>
                                            {p?.category}
                                        </span>
                                        <h3 className={`font-black text-lg leading-tight line-clamp-2 tracking-tighter ${textColorMain}`}>
                                            {p?.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-end justify-between mt-2 pt-3 border-t border-dashed border-current/20">
                                        <div className="flex flex-col">
                                            {label && is_available && (
                                                <p className={`text-[10px] line-through font-bold mb-0.5 ${textColorSub}`}>
                                                    {formatIDR(p?.price ?? 0)}
                                                </p>
                                            )}
                                            <p className={`text-2xl font-black italic tracking-tighter ${textColorMain} ${!is_available ? 'line-through opacity-50' : ''}`}>
                                                {formatIDR(finalPrice)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 💎 PORTAL MODAL (FIXED SCROLL MOBILE dengan flex-1 min-h-0) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-10 animate-in fade-in duration-300">

                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
                        onClick={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                    />

                    {/* Modal Container */}
                    <div className={`relative w-full md:max-w-5xl h-[92vh] md:h-auto md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500 rounded-t-[2.5rem] md:rounded-[3rem] border backdrop-blur-3xl
                        ${isDarkMode ? 'bg-[#0f0f11]/95 text-white border-white/10' : 'bg-white/95 text-slate-900 border-white/50'}`}>

                        <button onClick={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                            className={`absolute top-4 right-4 md:top-6 md:right-6 z-[100] p-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-white/10 text-white border-white/20' : 'bg-slate-100/80 text-slate-900 border-white shadow-sm'}`}>
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* LEFT: Visual Area */}
                        <div className={`w-full md:w-[45%] h-[35vh] md:h-auto relative shrink-0 overflow-hidden ${isDarkMode ? "bg-zinc-900" : "bg-slate-100"}`}>
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {/* Vibrant Gradient Overlay di Modal */}
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-orange-500/20 mix-blend-overlay pointer-events-none" />

                            {product?.discount_price ? (
                                <div className={`absolute top-5 left-5 px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl border border-white/20 
                                    bg-[var(--product-primary-color)] ${buttonTextColor}`}>
                                    Hemat {Promo(product, selectedVariant)}
                                </div>
                            ) : null}
                        </div>

                        {/* RIGHT: Content Area (BUG SCROLL FIXED) */}
                        <div className="w-full md:w-[55%] flex flex-col flex-1 min-h-0 relative z-10">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10 lg:p-12 pb-50">

                                <span className={`inline-block px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4
                                    ${isDarkMode ? "bg-white/10 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                                    {product?.category}
                                </span>

                                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] uppercase mb-8 ${textColorMain}`}>
                                    {product?.name}
                                </h2>

                                {/* Deskripsi Aman */}
                                {product?.description ? (
                                    <div className={`text-sm leading-relaxed font-medium mb-8 ${textColorSub}`}>
                                        <ExpandableHTML htmlContent={product.description} />
                                    </div>
                                ) : null}

                                {/* Bento Stats Panel */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className={`p-5 rounded-[1.5rem] border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                                        <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${textColorSub}`}>
                                            Harga Unit
                                        </span>
                                        {/* Warna HARGA dipaksa Netral (Putih/Hitam) agar TIDAK NABRAK */}
                                        <div className={`text-2xl font-black tracking-tighter ${textColorMain}`}>
                                            {formatIDR(currentFinalPrice)}
                                        </div>
                                        {product?.discount_price ? (
                                            <div className={`text-xs line-through font-bold mt-1 ${textColorSub}`}>
                                                {formatIDR(currentPrice)}
                                            </div>
                                        ) : null}
                                    </div>

                                    {product?.is_stock && (
                                        <div className={`p-5 rounded-[1.5rem] border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                                            <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${textColorSub}`}>
                                                Stok
                                            </span>
                                            <div className={`text-2xl font-black tracking-tighter flex items-center gap-2 ${textColorMain}`}>
                                                <Check size={20} className="text-emerald-500" strokeWidth={3} />
                                                {selectedVariant?.product_variant_stock ?? product?.stock}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Selectors */}
                                <div className="space-y-6 pt-6 border-t border-dashed border-current/20">
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div className="space-y-3">
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textColorSub}`}>
                                                Pilihan Variasi
                                            </p>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {product?.is_qty ? (
                                        <div className="space-y-3">
                                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${textColorSub}`}>
                                                Jumlah Pesanan
                                            </p>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* 📱 Sticky Floating Bottom Action Bar */}
                            <div className={`absolute md:relative bottom-0 left-0 right-0 p-5 md:p-8 shrink-0 flex flex-col gap-4 z-20 border-t backdrop-blur-2xl
                                ${isDarkMode ? "border-white/10 bg-[#0f0f11]/90" : "border-slate-200 bg-white/90"}`}>

                                <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${textColorSub}`}>
                                        Total Harga
                                    </span>
                                    {/* Warna TOTAL HARGA dipaksa Netral agar TIDAK NABRAK */}
                                    <span className={`text-3xl font-black tracking-tighter italic ${textColorMain}`}>
                                        {formatIDR(currentFinalPrice * quantity)}
                                    </span>
                                </div>

                                {/* TOMBOL MENGGUNAKAN YIQ AMAN */}
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                        bg-[var(--product-primary-color)] ${buttonTextColor}`}
                                >
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'STOK HABIS'
                                        : <>Konfirmasi Order <ShoppingCart size={20} strokeWidth={2.5} /></>}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default Eleven;