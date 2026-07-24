"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Check, X, ShoppingCart, Tag, ChevronRight } from 'lucide-react';
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

const Four = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [mounted, setMounted] = useState(false);

    // 🎨 YIQ Color Detector
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
                    setIsPrimaryLight(yiq >= 128); // Terang jika >= 128
                }
            }
        };
        setTimeout(checkPrimaryColor, 50);
    }, []);

    // 🚨 ANTI-NABRAK LOGIC (Clash Detector)
    // Mengecek apakah warna primary terlalu terang di light mode, atau terlalu gelap di dark mode
    const isClashingLight = !isDarkMode && isPrimaryLight;
    const isClashingDark = isDarkMode && !isPrimaryLight;

    // Fallback warna border untuk tombol/elemen biar nggak tenggelam sama background
    const clashBorderClass = isClashingLight ? 'border border-slate-200' : isClashingDark ? 'border border-slate-700' : 'border border-transparent';

    // Teks harga jika pakai primary color. Kalau nabrak, balik ke hitam/putih.
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
        if (product) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
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
        if (product && product.is_stock !== false) {
            const maxStock = selectedVariant
                ? (selectedVariant.product_variant_stock ?? 0)
                : (product.product_stock ?? 0);
            if (quantity > maxStock) setQuantity(maxStock > 0 ? maxStock : 1);
        }
    }, [selectedVariant, quantity, product]);

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group flex flex-col rounded-2xl md:rounded-[2rem] overflow-hidden transition-all duration-300 ease-out 
                            ${isDarkMode ? "bg-[#1E293B]/40 hover:bg-[#1E293B]/80" : "bg-white border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]"}
                            ${is_available ? "cursor-pointer" : "cursor-not-allowed opacity-60 grayscale-[0.5]"}`}
                    >
                        {/* IMAGE SECTION - Clean Gray/Slate Background */}
                        <div className={`relative aspect-square w-full p-4 flex items-center justify-center overflow-hidden
                            ${isDarkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>

                            {label && is_available && (
                                <span className={`absolute top-3 left-3 z-10 text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase
                                    bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}>
                                    {label}
                                </span>
                            )}

                            {!is_available && (
                                <span className={`absolute inset-0 z-10 flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px]`}>
                                    <span className="bg-white text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                                        Habis
                                    </span>
                                </span>
                            )}

                            {!p?.image ? (
                                <Icon icon="mynaui:image" className={`w-16 h-16 transition-transform duration-500 opacity-20 ${is_available && "group-hover:scale-110"} ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-contain transition-transform duration-700 ease-out drop-shadow-xl
                                        ${is_available && "group-hover:scale-110 group-hover:-translate-y-2"}`}
                                    alt={p.name}
                                />
                            ) : (
                                <Icon icon={p.image} className={`w-16 h-16 transition-transform duration-500 opacity-20 ${is_available && "group-hover:scale-110"} ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                            )}
                        </div>

                        {/* TEXT SECTION */}
                        <div className="p-4 sm:p-5 flex flex-col flex-grow">
                            <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block
                                ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                {p.category}
                            </span>

                            <h3 className={`text-sm sm:text-base font-bold leading-snug mb-3 line-clamp-2
                                ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                                {p?.name}
                            </h3>

                            <div className="mt-auto flex flex-col">
                                {label && is_available && (
                                    <span className={`text-[11px] line-through font-medium mb-0.5
                                        ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                        {formatIDR(p.price)}
                                    </span>
                                )}
                                <span className={`text-lg sm:text-xl font-black tracking-tight ${priceTextColor}`}>
                                    {formatIDR(finalPrice)}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 💎 PREMIUM MODAL (Split Layout: Image Left/Top, Content Right/Bottom) */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12 animate-in fade-in duration-300">

                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={closeModal} />

                    <div className={`relative w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[85vh] flex flex-col md:flex-row rounded-t-3xl md:rounded-[2rem] overflow-auto no-scrollbar shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500
                        ${isDarkMode ? 'bg-[#0f172a] border border-slate-800' : 'bg-white border border-slate-200'}`}>

                        {/* Close Button */}
                        <button onClick={closeModal} className={`absolute top-4 right-4 z-50 p-2.5 rounded-full backdrop-blur-md transition-colors shadow-sm
                            ${isDarkMode ? 'bg-black/40 text-white hover:bg-black/60' : 'bg-white/80 text-slate-700 hover:bg-slate-100'}`}>
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* Left Side: Product Image Showcase */}
                        <div className={`w-full md:w-1/2 relative shrink-0 flex items-center justify-center p-8 md:p-12 
                            ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full max-h-[30vh] md:max-h-full object-contain drop-shadow-2xl"
                                    alt={product?.name}
                                />
                            ) : (
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            )}
                        </div>

                        {/* Right Side: Product Details & Actions */}
                        <div className="w-full md:w-1/2 flex flex-col h-full">

                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 lg:p-10">
                                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block
                                    ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                    {product?.category}
                                </span>

                                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-6 leading-snug
                                    ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {product?.name}
                                </h2>

                                <div className="flex flex-col gap-1 mb-8">
                                    <p className={`text-4xl font-black tracking-tighter ${priceTextColor}`}>
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </p>
                                    {product?.discount_price ? (
                                        <div className="flex items-center gap-3 mt-2">
                                            <p className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}>
                                                Hemat {Promo(product, selectedVariant)}
                                            </p>
                                            <p className={`text-sm font-semibold line-through ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>

                                {/* 🔒 Deskripsi Aman */}
                                {product?.description ? (
                                    <div className="mb-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                        <ExpandableHTML
                                            htmlContent={product.description}
                                            className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                                        />
                                    </div>
                                ) : null}

                                <div className="space-y-6">
                                    {/* 🔒 Varian Aman & Nggak Render Angka 0 */}
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div className="space-y-3">
                                            <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Pilih Varian</p>
                                            <VariantPicker
                                                isStock={product?.is_stock}
                                                variants={product.variants}
                                                selectedVariant={selectedVariant}
                                                setSelectedVariant={setSelectedVariant}
                                                isDarkMode={isDarkMode}
                                            />
                                        </div>
                                    ) : null}

                                    {/* 🔒 Qty Aman & Nggak Render Angka 0 */}
                                    {product?.is_qty ? (
                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center">
                                                <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Kuantitas</p>
                                                {product.is_stock !== false && (
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        Stok: {selectedVariant?.product_variant_stock ?? product?.product_stock}
                                                    </p>
                                                )}
                                            </div>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Sticky Action Button area */}
                            <div className={`p-6 sm:p-8 shrink-0 border-t bg-opacity-95 backdrop-blur-sm
                                ${isDarkMode ? "border-slate-800 bg-[#0f172a]" : "border-slate-100 bg-white"}`}>

                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-4 px-6 rounded-2xl font-black text-[13px] tracking-[0.1em] uppercase transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-3
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    <ShoppingCart size={18} strokeWidth={2.5} />
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'STOK HABIS'
                                        : 'MASUKKAN KERANJANG'}
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

export default Four;