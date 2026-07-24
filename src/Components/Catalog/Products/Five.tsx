"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom'; // 💎 POIN 1: Pake Portal, BYE ModalWrapper!
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingCart, X, Plus, Info } from 'lucide-react';
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

const Five = ({ products, isDarkMode, handleCart }: Props) => {
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

    // 🎨 ANTI-NABRAK LOGIC
    const isClashingLight = !isDarkMode && isPrimaryLight;
    const isClashingDark = isDarkMode && !isPrimaryLight;

    const clashBorderClass = isClashingLight ? 'border border-slate-200' : isClashingDark ? 'border border-slate-700' : 'border border-transparent';
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
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 py-4 sm:py-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;
                const staggerClass = i % 2 === 0 ? 'md:translate-y-6' : 'md:-translate-y-6';

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative flex flex-col transition-all duration-700 ease-out p-3.5 sm:p-5 rounded-[1.5rem] 
                            ${is_available ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2' : 'cursor-not-allowed opacity-80'}
                            ${staggerClass}
                            ${isDarkMode ? 'bg-slate-900 shadow-black/40 border border-slate-800' : 'bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] border border-slate-100'}`}
                    >
                        <div className={`relative aspect-[3/4] mb-6 overflow-hidden rounded-xl transition-all duration-500
                            ${!is_available ? 'opacity-80' : ''}
                            ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>

                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-110' : 'grayscale sepia-[0.3]'}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out
                                        ${is_available ? 'group-hover:scale-110' : 'grayscale sepia-[0.3]'}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-110' : 'grayscale sepia-[0.3]'}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                            <div className={`absolute inset-0 transition-all duration-500 flex items-center justify-center
                                ${is_available ? 'bg-black/0 group-hover:bg-black/30 backdrop-blur-[0px] group-hover:backdrop-blur-[2px]' : 'bg-slate-900/40 backdrop-blur-[1px]'}`}>

                                {is_available ? (
                                    <div className="w-14 h-14 rounded-full bg-white/90 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out flex items-center justify-center text-slate-900 shadow-xl">
                                        <Plus size={24} strokeWidth={2} />
                                    </div>
                                ) : (
                                    <span className={`font-serif italic text-sm tracking-[0.2em] px-5 py-2.5 rounded-sm border shadow-lg
                                        ${isDarkMode ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-900'}`}>
                                        Sold Out
                                    </span>
                                )}
                            </div>

                            {label && is_available && (
                                <div className={`absolute top-3 left-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-md rounded-sm
                                    bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}>
                                    {label}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center text-center px-2 pb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.3em] mb-3 
                                ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {p.category}
                            </span>

                            <h3 className={`font-serif text-lg md:text-xl italic font-medium leading-snug mb-4 line-clamp-2 transition-colors duration-300
                                ${is_available
                                    ? isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'
                                    : isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                {p.name}
                            </h3>

                            <div className="mt-auto flex flex-col items-center gap-1.5">
                                <div className="h-4">
                                    {label && is_available && (
                                        <span className={`text-[11px] line-through font-medium tracking-wide
                                            ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm md:text-base font-black tracking-widest uppercase
                                    ${!is_available
                                        ? isDarkMode ? 'text-slate-600' : 'text-slate-400'
                                        : priceTextColor}`}>
                                    {is_available ? formatIDR(finalPrice) : 'Unavailable'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 💎 1. MODAL PREMIUM & BARU (Bottom Sheet Mobile + Floating Desktop) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">

                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" onClick={closeModal} />

                    {/* Pop-up Container */}
                    <div className={`relative w-full md:max-w-4xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col rounded-t-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 duration-500
                        ${isDarkMode ? 'bg-slate-900 border-t md:border border-slate-800' : 'bg-white border-t md:border border-slate-200'}`}>

                        {/* Close Button */}
                        <button onClick={closeModal} className={`absolute top-4 right-4 z-50 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-sm
                            ${isDarkMode ? 'bg-black/40 text-white hover:bg-black/60' : 'bg-white/80 text-slate-700 hover:bg-slate-100'}`}>
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Top Hero Image Area */}
                        <div className="relative w-full h-[40vh] md:h-[45vh] shrink-0 bg-slate-900">
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <Icon icon="mynaui:image" className="w-32 h-32 opacity-30 text-slate-500" />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className="w-32 h-32 opacity-30 text-slate-500" />
                                </div>
                            )}
                            {/* Gradient Overlay for seamless blend */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>

                        {/* Bottom Scrollable Content Area */}
                        <div className={`relative flex-1 overflow-y-auto no-scrollbar -mt-10 z-10 rounded-t-[2rem] px-6 py-8 sm:p-10 flex flex-col items-center
                            ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>

                            <div className={`mb-6 px-4 py-2 rounded-full border flex items-center gap-3 shadow-sm
                                ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                                <div className={`bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass} p-1.5 rounded-full`}>
                                    <Info size={14} strokeWidth={2.5} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                    {product?.category} <span className="opacity-40 px-1">•</span> {product?.stock} In Stock
                                </span>
                            </div>

                            <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl italic text-center leading-tight mb-6 max-w-2xl
                                ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                {product?.name}
                            </h2>

                            {/* 📝 3. DESKRIPSI AMAN */}
                            {product?.description ? (
                                <div className="w-full max-w-2xl mb-10">
                                    <ExpandableHTML
                                        htmlContent={product.description}
                                        className={`text-center text-sm md:text-base leading-relaxed font-medium 
                                            ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                                    />
                                </div>
                            ) : null}

                            <div className={`w-full max-w-2xl flex flex-col gap-8 py-8 border-y 
                                ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>

                                {/* 🚫 2. VARIAN AMAN (Anti 0) */}
                                {product?.variants && product.variants.length > 0 ? (
                                    <div className="flex flex-col items-center">
                                        <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            Pilih Edisi Varian
                                        </span>
                                        <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                ) : null}

                                {/* 🚫 4. QTY AMAN (Anti 0) */}
                                {product?.is_qty ? (
                                    <div className="flex flex-col items-center mt-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            Tentukan Jumlah
                                        </span>
                                        <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    </div>
                                ) : null}
                            </div>

                            <div className="w-full max-w-md flex flex-col items-center pt-8 pb-4">
                                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                    Total Keseluruhan
                                </p>

                                <div className="flex flex-col items-center mb-6">
                                    {product?.discount_price ? (
                                        <span className={`text-sm line-through font-bold mb-1 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                                            {formatIDR((selectedVariant?.price ?? product?.price ?? 0) * quantity)}
                                        </span>
                                    ) : null}
                                    <span className={`text-3xl sm:text-4xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                    </span>
                                </div>

                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full relative py-4 sm:py-5 rounded-full overflow-hidden transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_30px_rgba(0,0,0,0.15)]
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3 font-bold uppercase text-[11px] sm:text-xs tracking-[0.2em]">
                                        <ShoppingCart size={18} strokeWidth={2.5} />
                                        {product?.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product?.product_stock) ?? 0) < 1
                                            ? 'STOK HABIS'
                                            : 'TAMBAH KE TAS'}
                                    </div>
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

export default Five;