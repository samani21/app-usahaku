"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, Zap, Lock, Plus } from 'lucide-react';
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

const Nine = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
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

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity])

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 p-4 md:p-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative flex h-40 sm:h-48 md:h-56 rounded-3xl overflow-hidden transition-all duration-300 border shadow-sm
                            ${is_available
                                ? `cursor-pointer ${isDarkMode
                                    ? 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:shadow-xl hover:-translate-y-1'
                                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1'}`
                                : `cursor-not-allowed opacity-75 ${isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-slate-50 border-slate-200'}`
                            }`}
                    >
                        {/* Image Side */}
                        <div className={`w-[40%] sm:w-[45%] h-full relative overflow-hidden shrink-0 border-r
                            ${isDarkMode ? "bg-slate-800 border-slate-800" : "bg-slate-100 border-slate-200"}`}>

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-500 ease-in-out
                                        ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                            {/* Promo Label */}
                            {label && is_available && (
                                <div className="absolute top-3 left-3 bg-[var(--product-primary-color)] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md tracking-wide z-10">
                                    {label}
                                </div>
                            )}

                            {/* Sold Out Overlay for Image */}
                            {!is_available && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                                    <span className="text-white font-bold text-xs uppercase tracking-widest border border-white/50 py-1 px-3 rounded-md bg-black/40">Habis</span>
                                </div>
                            )}
                        </div>

                        {/* Content Side */}
                        <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                            <div className={!is_available ? "opacity-60" : ""}>
                                <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                                    <span className={`h-1.5 rounded-full transition-all duration-300
                                        ${is_available ? "w-3 bg-[var(--product-primary-color)] group-hover:w-6" : "w-3 bg-slate-400"}`}></span>
                                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider 
                                        ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {p.category}
                                    </span>
                                </div>
                                <h3 className={`font-bold text-base sm:text-lg md:text-xl leading-tight line-clamp-2
                                    ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {p.name}
                                </h3>
                            </div>

                            <div className="flex items-end justify-between mt-3">
                                <div className={`flex flex-col ${!is_available ? "opacity-60" : ""}`}>
                                    {label && is_available && (
                                        <span className={`text-xs line-through font-medium mb-0.5
                                            ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                    <p className={`font-extrabold text-lg sm:text-xl md:text-2xl tracking-tight
                                        ${is_available ? "text-[var(--product-primary-color)]" : isDarkMode ? "text-slate-500 line-through" : "text-slate-400 line-through"}`}>
                                        {is_available ? formatIDR(finalPrice) : 'Unavailable'}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className={`hidden h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-xl md:flex items-center justify-center transition-all duration-300 border
                                    ${!is_available
                                        ? isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-400 border-slate-200'
                                        : isDarkMode
                                            ? 'bg-transparent border-slate-600 text-white group-hover:bg-[var(--product-primary-color)] group-hover:border-[var(--product-primary-color)]'
                                            : 'bg-transparent border-slate-300 text-slate-900 group-hover:bg-[var(--product-primary-color)] group-hover:text-white group-hover:border-[var(--product-primary-color)]'
                                    }`}>
                                    {is_available ? <Plus size={20} strokeWidth={2.5} /> : <Lock size={18} />}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col lg:flex-row min-h-full shadow-2xl relative
                    ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>

                    {/* Visual Frame Section */}
                    <div className={`w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 h-[45vh] sm:h-[55vh] lg:h-auto lg:min-h-screen lg:sticky lg:top-0 shrink-0 flex items-center justify-center relative
                        ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}>

                        {/* Soft Atmospheric Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-[var(--product-primary-color)]/10 blur-[80px] pointer-events-none rounded-full" />

                        <div className="relative w-full h-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden z-10 shadow-xl">
                            {/* Kondisi Gambar Modal */}
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full object-cover transition-transform duration-500"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {product?.discount_price ? (
                                <div className="absolute top-4 left-4 bg-[var(--product-primary-color)] text-white px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg">
                                    Diskon {Promo(product, selectedVariant)}
                                </div>
                            ) : ''}
                        </div>
                    </div>

                    {/* Order Details Section */}
                    <div className={`w-full lg:w-1/2 flex flex-col z-10 ${isDarkMode ? "lg:border-l border-slate-800" : "lg:border-l border-slate-200"}`}>
                        <div className="p-6 sm:p-8 lg:p-12 flex-grow space-y-8">
                            <div className="space-y-3">
                                <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-[var(--product-primary-color)]' : 'text-[var(--product-primary-color)]'}`}>
                                    {product?.category}
                                </span>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                    {product?.name}
                                </h2>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl md:text-4xl font-black text-[var(--product-primary-color)] tracking-tighter">
                                        {formatIDR(selectedVariant?.final_price || product?.final_price || 0)}
                                    </span>
                                    {product?.discount_price ? (
                                        <span className={`text-lg font-semibold line-through ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {formatIDR(selectedVariant?.price || product?.price || 0)}
                                        </span>
                                    ) : ''}
                                </div>
                            </div>

                            <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <ExpandableHTML htmlContent={product?.description} />
                            </div>

                            <div className={`pt-6 space-y-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                {product?.variants && product?.variants.length > 0 && (
                                    <div className="space-y-3">
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Variasi</p>
                                        <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                )}

                                {product?.is_qty ? (
                                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="space-y-1">
                                            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Kuantitas</p>
                                        </div>
                                        <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        <div className={`p-6 sm:p-8 lg:p-12 pt-6 mt-auto border-t flex flex-col gap-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total</span>
                                <span className="text-2xl font-black tracking-tighter">
                                    {formatIDR((selectedVariant?.final_price || product?.final_price || 0) * quantity)}
                                </span>
                            </div>
                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                    ${isDarkMode
                                        ? 'bg-white text-slate-900 hover:bg-[var(--product-primary-color)] hover:text-white'
                                        : 'bg-slate-900 text-white hover:bg-[var(--product-primary-color)]'}`}
                            >
                                <ShoppingBag size={18} strokeWidth={2.5} /> Masukkan Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default Nine;