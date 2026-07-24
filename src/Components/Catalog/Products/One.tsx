"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import AlertWrapper from './AlertWrapper';
import { Check, ShoppingBag, Tag, X, Eye, ShoppingCart } from 'lucide-react';
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

const One = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const [mounted, setMounted] = useState(false);

    // 🎨 STATE BARU: Untuk menyimpan status apakah warna primary terang atau gelap
    const [isPrimaryLight, setIsPrimaryLight] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 🎨 LOGIC COLOR DETECTOR: Mengecek kecerahan dari --product-primary-color
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
                    // YIQ Luminance Formula
                    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
                    setIsPrimaryLight(yiq >= 128); // Jika yiq >= 128, warnanya TERANG
                }
            }
        };

        // Beri sedikit delay (50ms) memastikan CSS variable sudah dimuat browser
        setTimeout(checkPrimaryColor, 50);
    }, []);

    // 🔒 LOGIC IS_STOCK
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
        if (product && product.is_stock !== false) {
            const maxStock = selectedVariant
                ? (selectedVariant.product_variant_stock ?? 0)
                : (product.product_stock ?? 0);

            if (quantity > maxStock) {
                setQuantity(maxStock > 0 ? maxStock : 1);
            }
        }
    }, [selectedVariant, quantity, product]);

    useEffect(() => {
        document.body.style.overflow = product ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [product]);

    const addCart = () => {
        if (handleCart) handleCart(product, selectedVariant, quantity);
        closeModal();
    };

    const closeModal = () => {
        setProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    }

    // 🎨 DYNAMIC TEXT COLOR: Teks yang ngikutin warna primary di Harga Modal
    const modalPriceColor = isDarkMode
        ? (isPrimaryLight ? 'text-[var(--product-primary-color)]' : 'text-white') // Dark mode & gelap = Putih
        : (isPrimaryLight ? 'text-slate-900' : 'text-[var(--product-primary-color)]'); // Light mode & terang = Hitam

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        className={`group relative flex flex-col rounded-[24px] overflow-hidden transition-all duration-500 ease-out
                            ${is_available ? 'cursor-pointer hover:-translate-y-1.5' : 'cursor-not-allowed opacity-80'} 
                            ${isDarkMode
                                ? 'bg-[#1E293B]/40 hover:bg-[#1E293B]/80 border border-slate-800/60 ' + (is_available ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]' : '')
                                : 'bg-white border border-slate-100 ' + (is_available ? 'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]' : '')
                            }`}
                        onClick={() => {
                            if (is_available) {
                                setProduct(p);
                                setProductAlert(p);
                            }
                        }}
                    >
                        {/* 1. Image Container */}
                        <div className={`relative aspect-[4/5] overflow-hidden ${isDarkMode ? "bg-slate-800/50" : 'bg-slate-50'}`}>
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {label && is_available && (
                                <div className="absolute top-4 left-4 z-20 bg-rose-500/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 tracking-wide">
                                    <Tag size={12} strokeWidth={2.5} /> {label}
                                </div>
                            )}

                            {!is_available && (
                                <div className={`absolute inset-0 z-20 flex items-center justify-center ${isDarkMode ? "bg-black/40" : "bg-white/40"} backdrop-blur-[2px]`}>
                                    <div className="bg-slate-900/90 text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase shadow-xl">
                                        Stok Habis
                                    </div>
                                </div>
                            )}

                            {is_available && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center">
                                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-full text-slate-900 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-xl">
                                        <Eye size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                            )}

                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-105' : 'grayscale-[0.8] brightness-90'}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transform transition-transform duration-700 ease-out
                                        ${is_available ? 'group-hover:scale-105' : 'grayscale-[0.8] brightness-90'}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-105' : 'grayscale-[0.8] brightness-90'}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}
                        </div>

                        {/* 2. Content Container */}
                        <div className={`p-4 md:p-5 flex flex-col flex-grow ${!is_available ? isDarkMode ? ':bg-transparent' : 'bg-slate-50' : ''}`}>
                            <div className="flex justify-between items-start mb-2.5">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors
                                    ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    {p.category}
                                </span>
                            </div>

                            <h3 className={`font-semibold text-sm md:text-base line-clamp-2 mb-3 leading-snug flex-grow transition-colors duration-300
                                ${!is_available ? 'text-slate-400' : isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 '}`}>
                                {p?.name}
                            </h3>

                            <div className="mt-auto pt-3 flex flex-col justify-end">
                                <div className="h-4 mb-0.5">
                                    {label && (
                                        <span className={`text-[11px] font-medium line-through ${isDarkMode ? 'text-slate-500' : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-end justify-between gap-2">
                                    <p className={`font-bold text-lg md:text-xl tracking-tight transition-colors
                                        ${is_available ? `${isDarkMode ? "text-white" : "text-slate-900"} ` : `${isDarkMode ? 'text-slate-600' : "text-slate-400"}`}`}>
                                        {formatIDR(finalPrice)}
                                    </p>

                                    {/* 🎨 COLOR DETECTOR: Ubah Ikon Basket Hover Otomatis Gelap/Terang */}
                                    <div className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
                                        ${!is_available
                                            ? ` ${isDarkMode ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-300"}`
                                            : isDarkMode
                                                ? `bg-slate-800 text-slate-300 group-hover:bg-[var(--product-primary-color)] ${isPrimaryLight ? 'group-hover:text-slate-900' : 'group-hover:text-white'}`
                                                : `bg-slate-50 text-slate-500 group-hover:bg-[var(--product-primary-color)] ${isPrimaryLight ? 'group-hover:text-slate-900' : 'group-hover:text-white'} group-hover:shadow-md`}`}>
                                        <ShoppingBag size={16} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. MODAL RENDERED VIA PORTAL */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-4 transition-all">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" onClick={closeModal} />

                    <div className={`relative w-full md:w-[850px] lg:w-[1000px] h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col md:flex-row overflow-auto no-scrollbar
                        ${isDarkMode ? 'bg-[#0F172A] shadow-[0_0_40px_rgba(0,0,0,0.5)]' : 'bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]'}
                        rounded-t-[32px] md:rounded-[32px] transform transition-transform duration-300 animate-in fade-in slide-in-from-bottom-10`}
                    >
                        <button
                            onClick={closeModal}
                            className={`absolute top-4 right-4 md:top-5 md:right-5 z-50 p-2 rounded-full backdrop-blur-md transition-all hover:scale-105 active:scale-95
                                ${isDarkMode ? 'bg-black/40 text-white hover:bg-black/60' : 'bg-white/80 text-slate-900 hover:bg-white shadow-sm'}
                            `}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        <div className='flex flex-col md:flex-row h-full w-full overflow-y-auto no-scrollbar'>
                            <div className={`md:w-1/2 relative shrink-0 ${isDarkMode ? "bg-[#1E293B]" : "bg-slate-50"}`}>
                                {!(selectedVariant?.image ?? product?.image) ? (
                                    <div className="w-full h-[40vh] md:h-full md:min-h-[500px] flex items-center justify-center">
                                        <Icon icon="mynaui:image" className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                    <img
                                        src={selectedVariant?.image ?? product?.image}
                                        className="w-full h-[45vh] md:h-full object-cover"
                                        alt={product?.name}
                                    />
                                ) : (
                                    <div className="w-full h-[40vh] md:h-full md:min-h-[500px] flex items-center justify-center">
                                        <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent md:hidden pointer-events-none" />
                            </div>

                            <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col flex-grow">
                                <div className='flex flex-wrap items-center gap-3 mb-4'>
                                    <span className={`px-3 py-1 ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"} text-[10px] font-bold rounded-full uppercase tracking-wider`}>
                                        {product?.category}
                                    </span>
                                    {product?.discount_price ? (
                                        <div className={`${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"} text-rose-500 px-3 py-1 rounded-full flex items-center font-bold text-[10px] gap-1.5 tracking-wider uppercase`}>
                                            <Tag size={12} strokeWidth={2.5} />
                                            <span>Hemat {Promo(product, selectedVariant)}</span>
                                        </div>
                                    ) : null}
                                </div>

                                <h2 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 leading-tight tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {product?.name}
                                </h2>

                                <div className="flex items-baseline gap-3 mb-6">
                                    {/* 🎨 COLOR DETECTOR: Proteksi warna harga utama biar ngga nabrak background */}
                                    <p className={`text-3xl md:text-4xl font-extrabold ${modalPriceColor} leading-none tracking-tighter transition-colors`}>
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </p>

                                    {(product?.discount_price || selectedVariant?.discount_price) ? (
                                        <p className={`text-lg md:text-xl font-medium line-through ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-6 flex-grow">
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {product?.description ? (
                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-3 block`}>
                                                Deskripsi Produk
                                            </label>
                                            <ExpandableHTML
                                                htmlContent={product.description}
                                                className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-sm leading-relaxed`}
                                            />
                                        </div>
                                    ) : null}
                                </div>

                                <div className={`mt-8 pt-5 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                    <div className='flex items-end justify-between mb-5'>
                                        <div>
                                            <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-2 block`}>
                                                Atur Jumlah
                                            </label>
                                            {product?.is_qty ? (
                                                <QtySelector quantity={quantity} setQuantity={setQuantity} product={product} selectedVariant={selectedVariant} isDarkMode={isDarkMode} />
                                            ) : <div className="h-[42px]" />}
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-1`}>
                                                Total Harga
                                            </p>
                                            <p className={`text-xl md:text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                                {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 🎨 COLOR DETECTOR: Override text color di tombol pakai isPrimaryLight */}
                                    <button
                                        disabled={disableButton}
                                        onClick={addCart}
                                        className={`w-full group/btn relative overflow-hidden py-4 px-6 bg-[var(--product-primary-color)] 
                                            ${isPrimaryLight ? 'text-slate-900' : 'text-white'} 
                                            rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_8px_25px_-8px_var(--product-primary-color)] active:scale-[0.98] 
                                            ${isDarkMode ? 'disabled:bg-slate-800 ' : "disabled:bg-slate-300 "} disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed`}
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            <ShoppingCart size={18} strokeWidth={2.5} />
                                            {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                                ? 'STOK HABIS'
                                                : 'BELI SEKARANG'}
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default One;