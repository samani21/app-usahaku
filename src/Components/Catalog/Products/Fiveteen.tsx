"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Zap, ShoppingCart, X, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
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

const Fiveteen = ({ products, isDarkMode, handleCart }: Props) => {
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
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 p-4 md:p-8 
            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>

            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative flex flex-col items-center transition-all duration-500 ease-out
                            ${is_available ? "cursor-pointer hover:-translate-y-2" : "cursor-not-allowed opacity-60"}`}
                    >
                        {/* Promo Sticker */}
                        {label && is_available && (
                            <div className={`absolute top-0 right-4 z-20 bg-[var(--product-primary-color)] text-white text-[10px] font-black w-14 h-14 flex items-center justify-center text-center rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.3)] rotate-12 group-hover:-rotate-12 transition-transform duration-500 border-4 
                                ${isDarkMode ? "border-[#0f0f11]" : "border-white"}`}>
                                <span className="drop-shadow-md leading-tight">{label}</span>
                            </div>
                        )}

                        {/* Sold Out Stamped Label */}
                        {!is_available && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-zinc-900 text-white text-xs font-black px-6 py-2 rounded-xl uppercase tracking-[0.3em] shadow-2xl rotate-[-15deg] border-2 border-zinc-700 backdrop-blur-md">
                                Habis
                            </div>
                        )}

                        {/* Orbit Image Container */}
                        <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center p-3 mb-6">

                            {/* Rotating Dashed Ring (Visible on Hover) */}
                            <div className={`absolute inset-0 rounded-full border-[3px] border-dashed transition-all duration-[2s] ease-linear
                                ${is_available ? (isDarkMode ? "border-white/20 group-hover:rotate-180 group-hover:border-[var(--product-primary-color)]" : "border-black/10 group-hover:rotate-180 group-hover:border-[var(--product-primary-color)]") : "border-transparent"}`}
                            />

                            {/* Solid Inner Ring */}
                            <div className={`w-full h-full rounded-full p-2 transition-all duration-700
                                ${isDarkMode ? "bg-white/5" : "bg-black/5"}
                                ${is_available ? "group-hover:scale-95 group-hover:shadow-[0_0_40px_rgba(var(--product-primary-rgb),0.3)]" : ""}`}>

                                {/* Actual Image Canvas */}
                                <div className={`w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform duration-1000 bg-white flex items-center justify-center
                                    ${!is_available ? "grayscale" : "group-hover:scale-105"}`}>
                                    {/* Kondisi Gambar Card */}
                                    {!p?.image ? (
                                        <Icon icon="mynaui:image" className={`w-1/2 h-1/2 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                    ) : p.image.startsWith('https') ? (
                                        <img
                                            src={p?.image}
                                            className="w-full h-full object-cover"
                                            alt={p.name}
                                        />
                                    ) : (
                                        <Icon icon={p.image} className={`w-1/2 h-1/2 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                    )}
                                </div>
                            </div>

                            {/* Floating Action Icon */}
                            {is_available && (
                                <div className={`absolute bottom-2 right-6 p-4 rounded-full shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500
                                    ${isDarkMode ? "bg-white text-black" : "bg-slate-900 text-white"}`}>
                                    <ShoppingCart size={20} strokeWidth={2.5} />
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="text-center w-full px-4 space-y-3">
                            <div className="space-y-1">
                                {p?.category ? (
                                    <span className={`text-[10px] font-black tracking-[0.3em] uppercase
                                        ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
                                        {p?.category}
                                    </span>
                                ) : ''}
                                <h3 className={`text-xl font-black uppercase italic leading-none tracking-tighter line-clamp-2 transition-colors
                                    ${is_available && isDarkMode ? 'group-hover:text-zinc-300' : is_available && !isDarkMode ? 'group-hover:text-slate-600' : ''}`}>
                                    {p?.name}
                                </h3>
                            </div>

                            <div className="flex flex-col items-center justify-center">
                                {label && is_available && (
                                    <span className={`text-[11px] line-through font-bold mb-0.5 tracking-widest
                                        ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`}>
                                        {formatIDR(p.price)}
                                    </span>
                                )}
                                <p className={`text-2xl sm:text-3xl font-black tracking-tighter italic
                                    ${!is_available ? "text-zinc-500" : "text-[var(--product-primary-color)]"}`}>
                                    {formatIDR(finalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal - Modern Split View (Scroll Fixed) */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col lg:flex-row min-h-full
                    ${isDarkMode ? 'bg-[#0f0f11] text-white' : 'bg-white text-slate-900'}`}>

                    {/* Left: Sticky Image Showcase */}
                    <div className={`w-full lg:w-[45%] h-[45vh] sm:h-[55vh] lg:h-auto lg:min-h-[100dvh] lg:sticky lg:top-0 relative shrink-0 flex items-center justify-center p-8 sm:p-12
                        ${isDarkMode ? "bg-[#18181b]" : "bg-slate-50"}`}>

                        {/* Abstract Background Elements */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
                            <div className="w-[120%] aspect-square rounded-full border-[1px] border-dashed border-current opacity-5 animate-[spin_60s_linear_infinite]" />
                            <div className="absolute w-[80%] aspect-square rounded-full border-[1px] border-current opacity-5" />
                        </div>

                        <div className={`relative w-full max-w-md aspect-square rounded-full border-8 shadow-2xl z-10 overflow-hidden
                            ${isDarkMode ? "border-zinc-800 bg-[#121212]" : "border-white bg-slate-100"}`}>
                            {/* Kondisi Gambar Modal */}
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className="w-full h-full flex items-center justify-center transition-transform duration-1000 hover:scale-110">
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center transition-transform duration-1000 hover:scale-110">
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}
                        </div>

                        {product?.discount_price ? (
                            <div className="absolute top-8 left-8 bg-[var(--product-primary-color)] text-white px-6 py-2.5 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl rotate-[-5deg] z-20">
                                Hemat {Promo(product, selectedVariant)}
                            </div>
                        ) : ''}
                    </div>

                    {/* Right: Scrollable Order Details */}
                    <div className="w-full lg:w-[55%] flex flex-col z-10">
                        <div className="p-6 sm:p-10 lg:p-16 flex-grow space-y-10">

                            {/* Product Header */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={14} className="text-[var(--product-primary-color)]" />
                                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
                                        {product?.category || 'Collection'}
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter leading-[0.85] uppercase">
                                    {product?.name}
                                </h2>
                                <div className="h-1.5 w-20 bg-[var(--product-primary-color)] rounded-full mt-4" />
                            </div>

                            {/* Price & Description */}
                            <div className="space-y-8">
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
                                        Harga Satuan
                                    </span>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-4xl sm:text-5xl font-black tracking-tighter italic text-[var(--product-primary-color)] drop-shadow-sm">
                                            {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                        </span>
                                        {product?.discount_price ? (
                                            <span className={`text-lg sm:text-xl line-through font-bold italic ${isDarkMode ? "text-zinc-600" : "text-slate-400"}`}>
                                                {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                            </span>
                                        ) : ''}
                                    </div>
                                </div>

                                <div className={`p-6 rounded-[2rem] border ${isDarkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-sm"}`}>
                                    <ExpandableHTML
                                        htmlContent={product?.description}
                                        className={`text-sm leading-relaxed font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                                    />
                                </div>
                            </div>

                            {/* Configuration Panel */}
                            <div className={`space-y-8 pt-8 border-t border-dashed ${isDarkMode ? "border-zinc-800" : "border-slate-200"}`}>
                                {product?.variants && product?.variants?.length > 0 ? (
                                    <div className="space-y-4">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                            Pilih Konfigurasi
                                        </p>
                                        <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}

                                {product?.is_qty ? (
                                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-[2rem] border
                                        ${isDarkMode ? "bg-black/50 border-white/5" : "bg-slate-50 border-slate-200"}`}>
                                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                            Tentukan Kuantitas
                                        </span>
                                        <QtySelector quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} product={product} selectedVariant={selectedVariant} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        {/* Action Footer (Sticky at bottom of content) */}
                        <div className={`p-6 sm:p-10 lg:p-16 pt-6 mt-auto border-t flex flex-col gap-6
                            ${isDarkMode ? "bg-[#0f0f11] border-white/10" : "bg-white border-slate-200"}`}>

                            <div className="flex items-center justify-between px-2">
                                <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${isDarkMode ? "text-zinc-500" : "text-slate-400"}`}>
                                    Grand Total
                                </span>
                                <span className="text-3xl sm:text-4xl font-black italic tracking-tighter">
                                    {formatIDR((selectedVariant?.final_price || (product?.final_price ?? 0)) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full group relative overflow-hidden py-5 sm:py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs sm:text-sm shadow-2xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isDarkMode
                                        ? "bg-white text-zinc-900 hover:bg-[var(--product-primary-color)] hover:text-white"
                                        : "bg-zinc-900 text-white hover:bg-[var(--product-primary-color)]"}`}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    <Zap size={18} fill="currentColor" />
                                    Amankan Pesanan
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </button>
                        </div>
                    </div>

                </div>
            </ModalWrapper>
        </div>
    );
};

export default Fiveteen;