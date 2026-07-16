"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { CircleCheckBig, Tag, ShoppingBag, Sparkles, ChevronRight } from 'lucide-react';
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

const Three = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
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

    const addCart = () => {
        if (handleCart) handleCart(product, selectedVariant, quantity);
        setProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    };

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity]);

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-16 h-full p-4 md:p-8
            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>

            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group flex flex-col items-center text-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                            ${is_available ? "cursor-pointer" : "cursor-not-allowed opacity-60 grayscale-[0.5]"}`}
                    >
                        {/* 1. Image Container (Playful Orbital Style) */}
                        <div className="relative mb-6">
                            {/* Decorative Glow (Hover) */}
                            {is_available && (
                                <div className="absolute inset-0 bg-[var(--product-primary-color)] rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110" />
                            )}

                            <div className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center overflow-hidden z-10 border-4 sm:border-[8px]
                                ${is_available
                                    ? "group-hover:-translate-y-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] group-hover:shadow-[0_30px_50px_-15px_rgba(0,0,0,0.25)]"
                                    : "shadow-sm"} 
                                ${isDarkMode
                                    ? "border-slate-800 bg-slate-900 group-hover:border-slate-700"
                                    : "border-white bg-slate-50 group-hover:border-slate-100"}`}
                            >
                                {/* Kondisi Gambar Lingkaran */}
                                {!p?.image ? (
                                    <div className={`w-full h-full flex items-center justify-center rounded-full transition-transform duration-700 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? "scale-105 group-hover:scale-110" : "scale-100"}`}>
                                        <Icon icon="mynaui:image" className={`w-16 h-16 sm:w-20 sm:h-20 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className={`w-full h-full object-cover transition-transform duration-700 
                                            ${is_available ? "scale-105 group-hover:scale-110" : "scale-100"}`}
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center rounded-full transition-transform duration-700 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? "scale-105 group-hover:scale-110" : "scale-100"}`}>
                                        <Icon icon={p.image} className={`w-16 h-16 sm:w-20 sm:h-20 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                )}

                                {/* Badge Diskon Bubbly */}
                                {label && is_available && (
                                    <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-rose-500 text-white text-[10px] sm:text-xs font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1 scale-100 group-hover:scale-110 transition-transform">
                                        <Sparkles size={12} /> {label}
                                    </div>
                                )}

                                {/* Sold Out Overlay */}
                                {!is_available && (
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-20">
                                        <span className={`text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl border-2 rotate-[-12deg]
                                            ${isDarkMode ? "bg-slate-800 text-white border-slate-700" : "bg-white text-slate-900 border-slate-200"}`}>
                                            Habis
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Content Area */}
                        <div className="flex flex-col items-center space-y-3 w-full px-2">
                            {/* Bubbly Category Pill */}
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full 
                                ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                {p.category}
                            </span>

                            <h3 className={`font-black text-sm sm:text-base leading-tight line-clamp-2 transition-colors duration-300
                                ${is_available
                                    ? isDarkMode ? "text-slate-100 group-hover:text-white" : "text-slate-800 group-hover:text-[var(--product-primary-color)]"
                                    : isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                                {p.name}
                            </h3>

                            {/* Price / Action Button Area */}
                            <div className="flex flex-col items-center w-full mt-1">
                                {label && is_available && (
                                    <span className={`text-[11px] line-through font-bold mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                        {formatIDR(p.price)}
                                    </span>
                                )}

                                <div className={`px-6 py-3 rounded-full font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 w-full max-w-[180px] group-hover:gap-3
                                    ${is_available
                                        ? isDarkMode
                                            ? "bg-[var(--product-primary-color)] text-white shadow-lg shadow-[var(--product-primary-color)]/20 hover:bg-white hover:text-slate-900"
                                            : "bg-[var(--product-primary-color)] text-white shadow-lg shadow-[var(--product-primary-color)]/20 hover:bg-slate-900"
                                        : isDarkMode
                                            ? "bg-slate-800 text-slate-500"
                                            : "bg-slate-200 text-slate-400"}`}>
                                    {is_available ? formatIDR(finalPrice) : "STOK KOSONG"}
                                    {is_available && <ChevronRight size={16} />}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. Modal Experience - Playful & Rounded Layout */}
            <ModalWrapper
                activeModal={product ? true : false}
                closeModal={() => {
                    setProduct(null)
                    setSelectedVariant(null)
                    setQuantity(1)
                }}
                isDarkMode={isDarkMode}
            >
                <div className={`flex flex-col md:flex-row h-full overflow-y-auto custom-scrollbar 
                    ${isDarkMode ? 'bg-[#0f0f11]' : 'bg-white'}`}>

                    {/* Visual / Left Side */}
                    <div className={`w-full md:w-5/12 p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden
                        ${isDarkMode ? "bg-slate-900/50" : "bg-slate-50/50"}`}>

                        {/* Background Aura */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--product-primary-color)] to-fuchsia-500 opacity-[0.08] blur-3xl" />

                        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center z-10">
                            {/* Outer Rings */}
                            <div className={`absolute inset-0 rounded-full border border-dashed animate-[spin_20s_linear_infinite] 
                                ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`} />
                            <div className={`absolute inset-4 rounded-full border animate-[spin_15s_linear_infinite_reverse]
                                ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`} />

                            {/* Kondisi Gambar Modal Lingkaran */}
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className={`w-[85%] h-[85%] rounded-full flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border-[8px] transition-all duration-500 ${isDarkMode ? "border-slate-800 bg-slate-800" : "border-white bg-slate-100"}`}>
                                    <Icon icon="mynaui:image" className={`w-24 h-24 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className={`w-[85%] h-[85%] rounded-full object-cover shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border-[8px] transition-all duration-500 
                                        ${isDarkMode ? "border-slate-800" : "border-white"}`}
                                    alt={product?.name}
                                />
                            ) : (
                                <div className={`w-[85%] h-[85%] rounded-full flex items-center justify-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border-[8px] transition-all duration-500 ${isDarkMode ? "border-slate-800 bg-slate-800" : "border-white bg-slate-100"}`}>
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-24 h-24 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                        </div>

                        {/* Service List Pill-style */}
                        {product?.service && product?.service?.length > 0 ? (
                            <div className="mt-10 w-full flex flex-wrap justify-center gap-2 z-10 px-4">
                                {product.service.map((s, i) => (
                                    <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border
                                        ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}>
                                        <CircleCheckBig size={14} className="text-emerald-500" />
                                        <span>{s?.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : ''}
                    </div>

                    {/* Content / Right Side */}
                    <div className={`w-full md:w-7/12 p-8 sm:p-12 flex flex-col h-full z-10
                        ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        <div className="space-y-8 flex-grow">

                            {/* Header & Promo Info */}
                            <div className="space-y-4">
                                <div className='flex items-center justify-between w-full'>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full 
                                        ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                                        {product?.is_service ? 'Layanan Jasa' : product?.category}
                                    </span>

                                    {product?.discount_price ? (
                                        <div className="bg-rose-500 flex items-center gap-1.5 text-[11px] text-white px-4 py-1.5 rounded-full font-black shadow-md shadow-rose-500/20">
                                            <Tag size={12} strokeWidth={2.5} />
                                            Hemat {Promo(product, selectedVariant)}
                                        </div>
                                    ) : ''}
                                </div>

                                <div>
                                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.1] mb-4">
                                        {product?.name}
                                    </h2>
                                </div>

                                {/* Price Section inside a Bubbly Box */}
                                <div className={`p-5 rounded-[1.5rem] flex items-center justify-between
                                    ${isDarkMode ? "bg-slate-800/50" : "bg-slate-50"}`}>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        Harga Satuan
                                    </span>
                                    <div className='flex items-end gap-3'>
                                        {product?.discount_price ? (
                                            <p className={`text-sm font-bold line-through mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                            </p>
                                        ) : ''}
                                        <p className="text-3xl font-black text-[var(--product-primary-color)]">
                                            {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className={`p-5 rounded-[1.5rem] border ${isDarkMode ? "border-slate-800 bg-slate-900/30" : "border-slate-100 bg-white"}`}>
                                <ExpandableHTML
                                    htmlContent={product?.description}
                                    className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                                />
                            </div>

                            {/* Selections */}
                            <div className="space-y-6 pt-2">
                                {product?.variants && product?.variants?.length > 0 && (
                                    <div className="space-y-4">
                                        <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Varian</p>
                                        <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                )}

                                {product?.is_qty ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Atur Jumlah</p>
                                            <p className={`text-[10px] font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Sisa Stok: {selectedVariant?.product_variant_stock ?? product?.stock}</p>
                                        </div>
                                        <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        {/* Bottom Sticky Action */}
                        <div className={`mt-10 pt-6 flex flex-col sm:flex-row items-center gap-6 border-t
                            ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <div className="flex flex-col w-full sm:w-auto">
                                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                    Total Pesanan
                                </span>
                                <span className="text-3xl font-black">
                                    {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`flex-1 w-full py-5 px-8 rounded-full font-black uppercase tracking-[0.1em] text-sm flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] shadow-lg
                                    ${isDarkMode
                                        ? "bg-[var(--product-primary-color)] text-white hover:bg-white hover:text-slate-900 shadow-[var(--product-primary-color)]/20"
                                        : "bg-[var(--product-primary-color)] text-white hover:bg-slate-900 shadow-[var(--product-primary-color)]/30"
                                    } disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none`}
                            >
                                <ShoppingBag size={20} strokeWidth={2.5} /> Pesan Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default Three;