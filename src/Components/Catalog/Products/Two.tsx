"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import AlertWrapper from './AlertWrapper';
import { ArrowRight, X, ShoppingCart, Info } from 'lucide-react';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatIDR } from '@/types/FormtRupiah';
import ExpandableHTML from './ExpandableHTML';
import { getPromoDetails } from './PromoType';
import { OutletsType } from '@/types/Admin/OutletType';
import { Icon } from '@iconify/react';

type Props = {
    products: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

const Two = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null)
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null)
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null)
    const [quantity, setQuantity] = useState<number>(1);

    // State untuk Portal
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

        setTimeout(checkPrimaryColor, 50);
    }, []);

    // 🔒 LOGIC IS_STOCK: Kunci atau Buka Tombol Berdasarkan Stok
    const disableButton = useMemo(() => {
        if (!product) return true;

        if (product?.variants?.length > 0 && !selectedVariant) return true;

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

    // 🔒 LOGIC IS_STOCK: Batasi Kuantitas Maksimal
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

    // 🎨 DYNAMIC TEXT COLOR: Teks ngikutin mode gelap/terang biar ngga nabrak background
    const dynamicTextColor = isDarkMode
        ? (isPrimaryLight ? 'text-[var(--product-primary-color)]' : 'text-white') // Dark mode & primary gelap = Putih
        : (isPrimaryLight ? 'text-slate-900' : 'text-[var(--product-primary-color)]'); // Light mode & primary terang = Hitam

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10 h-full'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => {
                            if (is_available) {
                                setProduct(p);
                                setProductAlert(p);
                            }
                        }}
                        className={`group flex flex-col items-center transition-all duration-500 ease-out 
                            ${is_available ? "cursor-pointer" : "cursor-not-allowed"}`}
                    >
                        {/* 1. Image Container (Editorial Style) */}
                        <div className={`relative w-full aspect-[3/4] rounded-[2rem] overflow-hidden mb-5 transition-all duration-700 transform 
                            ${is_available
                                ? `group-hover:-translate-y-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] group-hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] ${isDarkMode ? 'shadow-none' : ''}`
                                : "grayscale opacity-70"} 
                            ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}
                        >
                            {label && is_available && (
                                <div className={`absolute top-4 left-4 z-20 ${isDarkMode ? 'bg-white text-slate-900' : "bg-slate-900 text-white"} text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg`}>
                                    {label}
                                </div>
                            )}

                            {!is_available && (
                                <div className={`absolute inset-0 z-30 flex items-center justify-center ${isDarkMode ? "bg-black/50" : "bg-slate-900/40"} backdrop-blur-sm`}>
                                    <div className="bg-white/95 text-slate-900 font-black text-[11px] px-6 py-2.5 uppercase tracking-[0.3em] shadow-xl rounded-sm">
                                        Stok Habis
                                    </div>
                                </div>
                            )}

                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? "scale-100 group-hover:scale-110" : "scale-100"}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out 
                                        ${is_available ? "scale-100 group-hover:scale-110" : "scale-100"}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? "scale-100 group-hover:scale-110" : "scale-100"}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                            {is_available && (
                                <div className="absolute bottom-4 right-4 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                                    <div className={`p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                        }`}>
                                        <ShoppingCart size={18} strokeWidth={2.5} />
                                    </div>
                                </div>
                            )}
                            <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${is_available ? "bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100" : ""}`} />
                        </div>

                        {/* 2. Bold Editorial Text */}
                        <div className={`text-center w-full px-2 transition-opacity duration-500 ${!is_available ? "opacity-50" : ""}`}>
                            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-2`}>
                                {p?.category}
                            </p>
                            <h3 className={`font-black text-sm md:text-base uppercase leading-tight mb-3 line-clamp-2 transition-colors duration-300
                                ${is_available ? isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-slate-950" : "text-slate-400"}`}>
                                {p?.name}
                            </h3>

                            <div className="flex flex-col items-center">
                                {label ? (
                                    <span className="text-[11px] line-through text-slate-400 mb-0.5 font-medium">
                                        {formatIDR(p.price)}
                                    </span>
                                ) : <div className="h-4 mb-0.5" />}

                                {/* 🎨 COLOR DETECTOR: Harga di card otomatis nyesuain background */}
                                <p className={`font-black text-lg md:text-xl tracking-tight transition-colors duration-300
                                    ${!is_available ? "text-slate-400" : dynamicTextColor}`}>
                                    {formatIDR(finalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. Floating Modal Box via Portal */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-12 animate-in fade-in duration-300">

                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
                        onClick={closeModal}
                    />

                    <div className={`relative w-full max-w-5xl max-h-[90vh] md:max-h-[85vh] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-500
                        ${isDarkMode ? 'bg-[#0F172A] border border-slate-800' : 'bg-slate-50 border border-slate-200'}`}
                    >
                        <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${isDarkMode ? 'opacity-30' : 'opacity-[0.10]'}`}>
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="w-full h-full scale-[1.2] blur-[100px] bg-slate-500" />
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img src={selectedVariant?.image ?? product?.image} className="w-full h-full object-cover scale-[1.2] blur-[100px]" alt="" />
                            ) : (
                                <div className="w-full h-full scale-[1.2] blur-[100px] bg-slate-500" />
                            )}
                        </div>

                        <button
                            onClick={closeModal}
                            className={`absolute top-4 right-4 sm:top-6 sm:right-6 z-[100] p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 shadow-md
                                ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' : 'bg-white/60 text-slate-900 hover:bg-white border border-slate-200'}
                            `}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        <div className="relative w-full h-full p-6 sm:p-12 flex flex-col items-center text-center overflow-y-auto no-scrollbar space-y-12">

                            {/* Hero Image Section */}
                            <div className="relative mt-8 md:mt-4 shrink-0">
                                <div className={`w-56 h-56 sm:w-72 sm:h-72 rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-700 ease-out border-[6px] 
                                    ${isDarkMode ? "border-slate-800 shadow-black/50 bg-slate-800" : "border-white shadow-slate-200/50 bg-white"}`}>

                                    {!(selectedVariant?.image ?? product?.image) ? (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon icon="mynaui:image" className={`w-24 h-24 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                                        </div>
                                    ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                        <img src={selectedVariant?.image ?? product?.image} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-24 h-24 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                                        </div>
                                    )}

                                </div>

                                {/* 🎨 COLOR DETECTOR: Badge Best Pick text color otomatis dinamis */}
                                <div className={`absolute -bottom-5 -right-5 bg-[var(--product-primary-color)] ${isPrimaryLight ? 'text-slate-900' : 'text-white'} w-20 h-20 rounded-full flex items-center justify-center -rotate-12 font-black text-[11px] leading-tight shadow-xl uppercase tracking-wider border-4 border-transparent backdrop-blur-sm`}>
                                    <span className="text-center">Best<br />Pick</span>
                                </div>
                            </div>

                            {/* Title Section */}
                            <div className="space-y-4 w-full max-w-2xl shrink-0">
                                {/* 🎨 COLOR DETECTOR: Teks kategori pakai dynamicTextColor */}
                                <p className={`${dynamicTextColor} font-bold uppercase tracking-[0.4em] text-[10px]`}>
                                    {product?.category}
                                </p>
                                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-[1.1] md:leading-[0.9] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {product?.name}
                                </h2>
                            </div>

                            {/* Interactive Content Grid */}
                            <div className="w-full grid md:grid-cols-2 gap-10 md:gap-16 items-start pb-6">
                                {/* Left: Info */}
                                <div className="space-y-6 text-left">
                                    <div className="flex items-center gap-2 text-slate-400 border-b border-slate-200/10 pb-3">
                                        <Info size={16} strokeWidth={2.5} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Detail & Spesifikasi</span>
                                    </div>
                                    <ExpandableHTML
                                        htmlContent={product?.description}
                                        className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-sm leading-relaxed`}
                                    />
                                </div>

                                {/* Right: Actions */}
                                <div className="space-y-8">
                                    {product?.variants && product?.variants?.length > 0 ? (
                                        <div className="text-left">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 block text-center md:text-left">Pilih Gaya</span>
                                            <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : ''}

                                    {/* Summary Box */}
                                    <div className={`p-6 sm:p-8 rounded-[2rem] space-y-6 backdrop-blur-md border transition-colors
                                        ${isDarkMode ? 'bg-slate-800/60 border-white/10 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-xl'}`}>

                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kuantitas</span>
                                            {product?.is_qty ? <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} /> : <div className="h-[36px]" />}
                                        </div>

                                        <div className="flex flex-col items-center gap-1 py-2">
                                            {product?.discount_price ? (
                                                <span className="text-sm line-through text-slate-400 font-medium">
                                                    {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                                </span>
                                            ) : <div className="h-5" />}
                                            <div className={`text-4xl md:text-5xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * (product?.is_qty ? quantity : 1))}
                                            </div>
                                        </div>

                                        {/* 🎨 COLOR DETECTOR: Hover tombol berubah otomatis text-nya ngikutin terang/gelap primary color */}
                                        <button
                                            disabled={disableButton}
                                            onClick={() => addCart()}
                                            className={`w-full py-5 group/btn relative overflow-hidden rounded-[1.2rem] font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300
                                                ${isDarkMode
                                                    ? `bg-white text-slate-900 hover:bg-[var(--product-primary-color)] ${isPrimaryLight ? 'hover:text-slate-900' : 'hover:text-white'}`
                                                    : `bg-slate-900 text-white hover:bg-[var(--product-primary-color)] ${isPrimaryLight ? 'hover:text-slate-900' : 'hover:text-white'} hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]`
                                                } disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <ShoppingCart size={16} strokeWidth={2.5} />
                                                {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                                    ? 'STOK HABIS'
                                                    : 'TAMBAH KE TAS'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    )
}

export default Two;