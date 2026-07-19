"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Check, Plus, ShoppingBag, Zap, X, ShoppingCart, Sparkles } from 'lucide-react';
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

const Eleven = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
    }, [product, selectedVariant]);

    const mockItem = useMemo(() => {
        return {
            name: product?.name,
            price: product?.final_price,
            image: product?.image,
            category: product?.category,
            quantity: quantity
        }
    }, [product, quantity]);

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
    const currentDiscount = currentPrice - currentFinalPrice;

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity]);

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 p-4 md:p-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative p-[6px] rounded-[2.5rem] transition-all duration-500 ease-out h-[380px] sm:h-[420px] flex flex-col shadow-xl
                            ${is_available
                                ? "bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-amber-400 cursor-pointer hover:shadow-2xl hover:-translate-y-2"
                                : "bg-slate-300 cursor-not-allowed opacity-80 grayscale"}`}
                    >
                        {/* Animated Gradient Glow Effect */}
                        {is_available && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform group-hover:translate-x-full rounded-[2.5rem]" />
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-5 left-5 right-5 flex justify-between z-20 pointer-events-none">
                            {label && is_available ? (
                                <div className="bg-rose-500 backdrop-blur-md border border-white/40 text-white px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg flex items-center gap-1.5">
                                    <Sparkles size={12} fill="currentColor" /> {label}
                                </div>
                            ) : !is_available ? (
                                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white/80 px-3 py-1.5 rounded-full font-black uppercase tracking-widest text-[9px] shadow-lg">
                                    Sold Out
                                </div>
                            ) : <div />}
                        </div>

                        {/* Inner Glass Card */}
                        <div className={`h-full w-full rounded-[2.2rem] p-4 flex flex-col justify-between transition-colors duration-500 relative z-10 backdrop-blur-xl border
                            ${isDarkMode ? 'bg-[#0f0f11]/90 border-white/10 text-white' : 'bg-white/95 border-white/50 text-slate-900'}
                            ${!is_available ? 'opacity-80' : ''}`}>

                            {/* Image Container */}
                            <div className={`relative w-full h-44 sm:h-48 shrink-0 rounded-[1.5rem] overflow-hidden transition-all duration-500 shadow-inner
                                ${is_available ? (isDarkMode ? "bg-zinc-800" : "bg-slate-100") : "bg-slate-200"}`}>

                                {/* Kondisi Gambar Card */}
                                {!p?.image ? (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${is_available ? 'group-hover:scale-110' : 'opacity-50'}`}>
                                        <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out
                                            ${is_available ? 'group-hover:scale-110' : 'opacity-50'}`}
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${is_available ? 'group-hover:scale-110' : 'opacity-50'}`}>
                                        <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    </div>
                                )}

                                {/* Internal Quick Action Icon */}
                                {is_available && (
                                    <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 shadow-lg">
                                        <Plus size={20} strokeWidth={2.5} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-1 pt-4 justify-between">
                                <div className="space-y-1.5">
                                    {p?.category && (
                                        <span className={`text-[9px] font-black tracking-[0.3em] uppercase
                                            ${is_available
                                                ? 'text-[var(--product-primary-color)]'
                                                : isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                            {p?.category}
                                        </span>
                                    )}
                                    <h3 className={`font-black text-lg md:text-xl leading-tight line-clamp-2 tracking-tighter transition-colors duration-300
                                        ${is_available ? 'group-hover:text-[var(--product-primary-color)]' : ''}`}>
                                        {p?.name}
                                    </h3>
                                </div>

                                <div className="flex items-end justify-between mt-2 pt-3 border-t border-dashed border-current/10">
                                    <div className="flex flex-col">
                                        {label && is_available && (
                                            <p className={`text-[10px] line-through font-bold mb-0.5
                                                ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                                {formatIDR(p?.price ?? 0)}
                                            </p>
                                        )}
                                        <p className={`text-2xl font-black italic tracking-tighter
                                            ${!is_available ? 'line-through opacity-50' : ''}`}>
                                            {formatIDR(finalPrice)}
                                        </p>
                                    </div>

                                    {is_available && (
                                        <div className={`p-2.5 rounded-xl transition-all duration-300
                                            ${isDarkMode ? 'bg-white/10 text-white group-hover:bg-[var(--product-primary-color)]' : 'bg-slate-100 text-slate-900 group-hover:bg-[var(--product-primary-color)] group-hover:text-white'}`}>
                                            <ShoppingBag size={18} strokeWidth={2.5} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal - Vibrant Glass & Native Scroll Fix */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null);
                    setSelectedVariant(null);
                    setQuantity(1);
                }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col md:flex-row min-h-full
                    ${isDarkMode ? 'bg-[#0f0f11] text-white' : 'bg-white text-slate-900'}`}>

                    {/* Visual Section - Sticky Desktop, Flow Mobile */}
                    <div className={`w-full md:w-[50%] lg:w-[45%] h-[40vh] md:h-auto md:min-h-[100dvh] md:sticky md:top-0 relative shrink-0 overflow-hidden
                        ${isDarkMode ? "bg-zinc-900" : "bg-slate-100"}`}>

                        {/* Kondisi Gambar Modal */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                alt=""
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        )}

                        {/* Decorative Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/20 mix-blend-overlay pointer-events-none" />

                        {product?.discount_price ? (
                            <div className="absolute top-6 left-6 bg-gradient-to-r from-pink-500 to-amber-400 text-white px-5 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl border border-white/20">
                                Hemat {Promo(product, selectedVariant)}
                            </div>
                        ) : ''}
                    </div>

                    {/* Content Section - Flow natural & Scrollable */}
                    <div className="w-full md:w-[50%] lg:w-[55%] p-6 md:p-10 lg:p-14 flex flex-col z-10">
                        <div className="flex-grow space-y-8">

                            {/* Product Title Header */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                        ${isDarkMode ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
                                        {product?.category}
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] uppercase">
                                    {product?.name}
                                </h2>
                            </div>

                            {/* Description HTML */}
                            <div className={`text-sm leading-relaxed font-medium
                                ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                <ExpandableHTML htmlContent={product?.description} />
                            </div>

                            {/* Bento Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-5 rounded-[2rem] border transition-colors ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        Harga Unit
                                    </span>
                                    <div className="text-2xl sm:text-3xl font-black tracking-tighter text-[var(--product-primary-color)]">
                                        {formatIDR(currentFinalPrice)}
                                    </div>
                                    {product?.discount_price ? (
                                        <div className={`text-sm line-through font-bold mt-1 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                                            {formatIDR(currentPrice)}
                                        </div>
                                    ) : ""}
                                </div>
                                {
                                    product?.is_stock ?
                                        <div className={`p-5 rounded-[2rem] border transition-colors ${isDarkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>
                                            <span className={`text-[10px] font-black uppercase tracking-widest block mb-1.5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                Stok
                                            </span>
                                            <div className="text-2xl sm:text-3xl font-black tracking-tighter flex items-center gap-2">
                                                <Check size={24} className="text-emerald-500 shrink-0" strokeWidth={3} />
                                                <span className="truncate">{selectedVariant?.product_variant_stock ?? product?.stock}</span>
                                            </div>
                                        </div> : ''
                                }
                            </div>

                            {/* Selectors Area */}
                            <div className="space-y-8 py-8 border-t border-dashed border-current/20">
                                {product?.variants && product?.variants?.length > 0 && (
                                    <div className="space-y-4">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            Pilihan Variasi
                                        </p>
                                        <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                )}

                                {product && product?.is_qty ? (
                                    <div className="space-y-4">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            Tentukan Jumlah
                                        </p>
                                        <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className={`mt-8 pt-8 border-t flex flex-col gap-6
                            ${isDarkMode ? "border-white/10" : "border-slate-200"}`}>

                            <div className="flex items-center justify-between px-2">
                                <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Total Harga
                                </span>
                                <span className="text-4xl font-black tracking-tighter italic text-[var(--product-primary-color)]">
                                    {formatIDR(currentFinalPrice * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={() => addCart()}
                                className={`w-full py-5 md:py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isDarkMode
                                        ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:opacity-90 hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)]"
                                        : "bg-slate-900 text-white hover:bg-[var(--product-primary-color)] hover:shadow-xl"}`}
                            >
                                <ShoppingCart size={20} strokeWidth={2.5} /> Konfirmasi Order
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default Eleven;