"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, ChevronRight, Zap, ArrowRight, Info } from 'lucide-react';
import AlertWrapper from './AlertWrapper';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatIDR } from '@/types/FormtRupiah';
import ExpandableHTML from './ExpandableHTML';
import { getPromoDetails, Promo } from './PromoType';
import { OutletsType } from '@/types/Admin/OutletType';
import { Icon } from '@iconify/react';

type Props = {
    products: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

const Sevent = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
    }, [product, selectedVariant]);

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
    }, [selectedVariant, quantity])

    return (
        <div>
            {/* Interactive Soft Bento Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 max-w-7xl mx-auto p-4 md:p-8'>
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
                            className={`group relative p-4 sm:p-5 rounded-[2.5rem] transition-all duration-500 ease-out border shadow-sm
                                ${is_available
                                    ? 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl'
                                    : 'cursor-not-allowed opacity-75 grayscale-[0.4] hover:shadow-none'
                                } 
                                ${isDarkMode
                                    ? 'bg-[#18181B] hover:bg-[#27272A] border-white/5 shadow-black/50'
                                    : 'bg-white hover:bg-slate-50 border-slate-100 shadow-slate-200/50'
                                }`}
                        >
                            {/* Floating Image Section (Inner Bento) */}
                            <div className={`relative h-64 md:h-72 w-full mb-6 rounded-[2rem] overflow-hidden shadow-inner transition-colors
                                ${isDarkMode ? "bg-[#09090B]" : "bg-slate-100"}`}>

                                {/* Kondisi Gambar Card */}
                                {!p?.image ? (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${is_available ? 'group-hover:scale-105' : ''}`}>
                                        <Icon icon="mynaui:image" className="w-20 h-20 opacity-30 text-slate-400" />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out
                                            ${is_available ? 'group-hover:scale-105' : ''}`}
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${is_available ? 'group-hover:scale-105' : ''}`}>
                                        <Icon icon={p.image} className="w-20 h-20 opacity-30 text-slate-400" />
                                    </div>
                                )}

                                {/* Promo Label (Glassmorphism Pill) */}
                                {label && is_available && (
                                    <div className="absolute top-4 left-4 bg-rose-500 backdrop-blur-md border border-white/40 text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg z-10">
                                        <Zap size={12} fill="currentColor" /> {label}
                                    </div>
                                )}

                                {/* Sold Out Overlay Badge */}
                                {!is_available && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-10">
                                        <div className="bg-white/95 text-slate-900 px-5 py-2.5 rounded-[1rem] text-[11px] font-black uppercase tracking-widest shadow-2xl">
                                            Habis Terjual
                                        </div>
                                    </div>
                                )}

                                {/* Hover Gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500
                                    ${isDarkMode ? 'from-black/50 to-transparent' : 'from-slate-900/20 to-transparent'}`} />
                            </div>

                            {/* Detailed Text Section */}
                            <div className={`px-2 space-y-4 ${!is_available ? 'opacity-60' : ''}`}>
                                <div className="space-y-1.5">
                                    <p className={`text-[10px] font-bold uppercase tracking-[0.25em] 
                                        ${is_available ? 'text-[var(--product-primary-color)]' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {p.category}
                                    </p>
                                    <h3 className={`text-xl font-black leading-tight line-clamp-1 tracking-tight
                                        ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {p.name}
                                    </h3>
                                </div>

                                <div className={`flex items-center justify-between pt-4 border-t border-dashed 
                                    ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>

                                    <div className="flex flex-col">
                                        {label && is_available && (
                                            <span className={`text-[11px] font-bold line-through mb-0.5 tracking-wide
                                                ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                {formatIDR(p.price)}
                                            </span>
                                        )}
                                        <p className={`text-2xl font-black tracking-tighter ${!is_available ? 'line-through' : ''}
                                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {formatIDR(finalPrice)}
                                        </p>
                                    </div>

                                    {/* Action Button (Soft Pill) */}
                                    <div className={`h-12 w-12 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 shadow-md
                                        ${!is_available
                                            ? isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-400'
                                            : isDarkMode
                                                ? 'bg-white text-black group-hover:scale-110'
                                                : 'bg-slate-900 text-white group-hover:scale-110'}`}>
                                        {is_available ? <ChevronRight size={22} strokeWidth={2.5} /> : <X size={20} strokeWidth={2.5} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col md:flex-row min-h-full 
                    ${isDarkMode ? 'bg-[#18181B] text-white' : 'bg-white text-slate-900'}`}>

                    {/* Hero Image Section (Sticky on Desktop) */}
                    <div className={`w-full md:w-1/2 p-4 sm:p-6 md:p-8 h-[45vh] md:h-auto md:min-h-[85vh] relative shrink-0 
                        ${isDarkMode ? "bg-[#09090B]" : "bg-slate-50"}`}>

                        <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-inner">
                            {/* Kondisi Gambar Modal */}
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full object-cover"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
                                </div>
                            )}

                            {/* Floating App-like Icon */}
                            <div className="absolute top-6 right-6 h-12 w-12 rounded-full bg-black/20 backdrop-blur-xl flex items-center justify-center border border-white/30 text-white shadow-lg">
                                <ShoppingBag size={20} strokeWidth={2.5} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Order Detail Section */}
                    <div className="w-full md:w-1/2 flex flex-col z-10">
                        <div className="p-6 md:p-12 flex-grow space-y-8">

                            {/* Title & Price Header */}
                            <div className="space-y-4">
                                {product?.category ? (
                                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border 
                                        ${isDarkMode ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                        <Info size={14} strokeWidth={2.5} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {product.category}
                                        </span>
                                    </div>
                                ) : ''}

                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-4">
                                    {product?.name}
                                </h2>

                                <div className="flex flex-col gap-1 pt-2">
                                    <div className="flex items-end gap-3">
                                        <p className="text-4xl font-black text-[var(--product-primary-color)] tracking-tighter">
                                            {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                        </p>
                                        {product?.discount_price ? (
                                            <p className={`text-sm font-bold line-through mb-1.5
                                                ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <hr className={`border-dashed ${isDarkMode ? "border-slate-800" : "border-slate-200"}`} />

                            {/* Description */}
                            <div className={`text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                <ExpandableHTML htmlContent={product?.description} />
                            </div>

                            {/* Variants Selection */}
                            {product?.variants && product?.variants?.length > 0 ? (
                                <div className="space-y-4">
                                    <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Pilih Variasi</p>
                                    <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}

                            {product?.is_qty ? (
                                <div className="space-y-4">
                                    <p className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Kuantitas</p>
                                    <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}
                        </div>

                        {/* Sticky Bottom Summary */}
                        <div className={`p-6 md:p-12 pt-6 border-t mt-auto flex flex-col gap-6 ${isDarkMode ? "border-white/10" : "border-slate-100"}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                    Total Keseluruhan
                                </span>
                                <span className="text-3xl font-black tracking-tighter">
                                    {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isDarkMode
                                        ? 'bg-white text-black hover:bg-[var(--product-primary-color)] hover:text-white'
                                        : 'bg-slate-900 text-white hover:bg-[var(--product-primary-color)] shadow-[0_15px_30px_rgba(0,0,0,0.15)]'}`}
                            >
                                Konfirmasi Pesanan <ChevronRight size={18} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
}

export default Sevent;