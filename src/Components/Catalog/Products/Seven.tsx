"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, Zap, ArrowUpRight } from 'lucide-react';
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

const Seven = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const [mounted, setMounted] = useState(false);
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
            {/* 🌟 IMMERSIVE GRID (Glass Strip Bottom) */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-8 max-w-[1600px] mx-auto'>
                {products?.map((p, i) => {
                    const { finalPrice, label } = getPromoDetails(p);
                    const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                    return (
                        <div
                            key={i}
                            onClick={() => is_available && setProduct(p)}
                            className={`group relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm hover:shadow-2xl
                                ${isDarkMode ? 'bg-[#0a0a0a] border border-white/5' : 'bg-slate-100 border border-slate-200'}
                                ${is_available ? 'cursor-pointer hover:-translate-y-2' : 'cursor-not-allowed opacity-60 grayscale-[0.6]'}`}
                        >
                            {!p?.image ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-20 h-20 opacity-20 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,1,0.5,1)]
                                        ${is_available ? 'group-hover:scale-110' : ''}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon={p.image} className={`w-20 h-20 opacity-20 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                                </div>
                            )}

                            {label && is_available && (
                                <div className={`absolute top-4 left-4 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg z-10
                                    bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}>
                                    <Zap size={12} fill="currentColor" /> {label}
                                </div>
                            )}

                            {!is_available && (
                                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-10">
                                    <div className="bg-white text-black px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl">
                                        Habis Terjual
                                    </div>
                                </div>
                            )}

                            <div className={`absolute bottom-3 left-3 right-3 p-4 rounded-[1.2rem] backdrop-blur-xl border transition-all duration-500 flex flex-col gap-1
                                ${isDarkMode ? 'bg-black/60 border-white/10 text-white' : 'bg-white/80 border-white/50 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.08)]'}`}>
                                
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col">
                                        <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 
                                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {p.category}
                                        </p>
                                        <h3 className="font-bold text-sm leading-tight line-clamp-1">
                                            {p.name}
                                        </h3>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-transform duration-300
                                        ${isDarkMode ? 'bg-white/10' : 'bg-slate-200/50'} ${is_available ? 'group-hover:rotate-45' : ''}`}>
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1">
                                    <p className={`text-lg font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR(finalPrice)}
                                    </p>
                                    {label && is_available && (
                                        <span className={`text-[10px] font-semibold line-through
                                            ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 💎 1. MEGA MODAL PORTAL (Fixed Scroll Mobile) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-300">
                    
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
                        onClick={closeModal} 
                    />

                    <div className={`relative w-full h-full md:max-w-7xl md:h-[90vh] md:rounded-[2.5rem] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 duration-500
                        ${isDarkMode ? 'bg-[#0f0f11] text-white border md:border-white/10' : 'bg-white text-slate-900 border md:border-slate-200'}`}>

                        <button onClick={closeModal} className={`absolute top-4 md:top-6 right-4 md:right-6 z-[100] p-3 rounded-full backdrop-blur-xl border transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/50 text-white border-white/20 hover:bg-black/70' : 'bg-white/80 text-black border-slate-200 hover:bg-white shadow-lg'}`}>
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Left: Mega Image Area */}
                        <div className={`w-full md:w-1/2 h-[45vh] md:h-full relative shrink-0 ${isDarkMode ? "bg-[#161618]" : "bg-slate-50"}`}>
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                                </div>
                            )}
                            <div className="hidden md:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-current to-transparent opacity-10 pointer-events-none" style={{ color: isDarkMode ? '#0f0f11' : '#ffffff' }} />
                            <div className="md:hidden absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-current to-transparent opacity-10 pointer-events-none" style={{ color: isDarkMode ? '#0f0f11' : '#ffffff' }} />
                        </div>

                        {/* Right: Immersive Info Area - BUG FIX SCROLL: `flex-1 min-h-0` */}
                        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 relative z-10">
                            
                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 md:p-12 pb-50 md:pb-12">
                                
                                <span className={`inline-block px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6
                                    ${isDarkMode ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                    {product?.category}
                                </span>

                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.05] mb-6">
                                    {product?.name}
                                </h2>

                                <div className="md:flex items-end gap-4 mb-8">
                                    <p className={`text-5xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </p>
                                    {product?.discount_price ? (
                                        <p className={`text-lg font-bold line-through mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </p>
                                    ) : null}
                                </div>

                                <hr className={`my-8 border-dashed ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`} />

                                {/* Deskripsi Aman */}
                                {product?.description ? (
                                    <div className={`text-base leading-relaxed font-medium mb-10 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                        <ExpandableHTML htmlContent={product.description} />
                                    </div>
                                ) : null}

                                <div className="space-y-10">
                                    {/* Varian Aman */}
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div className="space-y-4">
                                            <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                Pilih Variasi Produk
                                            </p>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {/* Qty Aman */}
                                    {product?.is_qty ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <p className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                                    Tentukan Jumlah
                                                </p>
                                                {product.is_stock !== false && (
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${isDarkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                                        Sisa: {selectedVariant?.product_variant_stock ?? product?.product_stock}
                                                    </span>
                                                )}
                                            </div>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Sticky Bottom Action */}
                            <div className={`absolute md:relative bottom-0 left-0 right-0 p-6 md:p-8 shrink-0 backdrop-blur-xl border-t 
                                ${isDarkMode ? "border-white/10 bg-[#0f0f11]/90" : "border-slate-200 bg-white/90"}`}>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        Total Pembayaran
                                    </span>
                                    <span className={`text-2xl sm:text-3xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                    </span>
                                </div>
                                
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-5 rounded-[1rem] md:rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'STOK HABIS'
                                        : <>Tamba ke Keranjang <ShoppingBag size={18} strokeWidth={2.5} /></>}
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

export default Seven;