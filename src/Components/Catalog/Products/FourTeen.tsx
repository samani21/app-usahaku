"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Minus, Plus, ShoppingBag, X, Tag, ArrowRight, Check } from 'lucide-react';
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

const Fourteen = ({ products, isDarkMode, handleCart }: Props) => {
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

    const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
    const currentFinalPrice = selectedVariant?.final_price ?? product?.final_price ?? 0;
    const currentDiscount = currentPrice - currentFinalPrice;

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity]);

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 p-4 md:p-8 
            ${isDarkMode ? 'text-zinc-100' : 'text-slate-800'}`}>

            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative flex flex-col rounded-[2rem] p-3 transition-all duration-500
                            ${is_available
                                ? `cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]
                                   ${isDarkMode ? 'bg-[#18181b] border border-white/5 hover:border-white/10' : 'bg-white border border-slate-100 hover:border-slate-200 shadow-sm'}`
                                : `cursor-not-allowed opacity-60 grayscale-[0.5]
                                   ${isDarkMode ? 'bg-[#121212] border border-white/5' : 'bg-slate-50 border border-slate-100'}`
                            }`}
                    >
                        {/* Image Section - Minimalist Floating Style */}
                        <div className={`relative aspect-square rounded-[1.5rem] overflow-hidden mb-5
                            ${isDarkMode ? 'bg-[#0f0f11]' : 'bg-slate-100/50'}`}>

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${is_available ? "group-hover:scale-110" : ""}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] 
                                        ${is_available ? "group-hover:scale-110" : ""}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] ${is_available ? "group-hover:scale-110" : ""}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {/* Elegant Gradient Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Status Badge - Pill Style */}
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                                {is_available ? (
                                    label && (
                                        <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                                            {label}
                                        </div>
                                    )
                                ) : (
                                    <div className="bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-3 py-1.5 rounded-full">
                                        Sold Out
                                    </div>
                                )}

                                {/* Hover Action Icon */}
                                {is_available && (
                                    <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
                                        <ArrowRight size={14} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Section - Clean Typography */}
                        <div className="px-2 pb-2 flex-1 flex flex-col">
                            <div className="flex items-center gap-1.5 mb-2">
                                <Tag size={12} className={isDarkMode ? "text-zinc-500" : "text-slate-400"} />
                                <span className={`text-[10px] font-medium tracking-widest uppercase
                                    ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                    {p.category || 'Product'}
                                </span>
                            </div>

                            <h3 className={`font-semibold text-lg leading-snug tracking-tight line-clamp-2 transition-colors duration-300 mb-4
                                ${is_available ? "group-hover:text-[var(--product-primary-color)]" : ""}`}>
                                {p.name}
                            </h3>

                            <div className="mt-auto flex items-end justify-between">
                                <div className="flex flex-col">
                                    {label && is_available && (
                                        <span className={`text-[11px] line-through font-medium mb-0.5
                                            ${isDarkMode ? 'text-zinc-600' : 'text-slate-400'}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                    <p className="text-xl font-bold tracking-tight">
                                        {formatIDR(finalPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal - Luxury Editorial Layout */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col md:flex-row min-h-full font-sans selection:bg-[var(--product-primary-color)] selection:text-white
                    ${isDarkMode ? 'bg-[#0a0a0a] text-zinc-100' : 'bg-white text-slate-800'}`}>

                    {/* Visual Section - Edge to Edge on Mobile, Padded on Desktop */}
                    <div className={`w-full md:w-[45%] lg:w-[50%] h-[50vh] md:h-auto md:min-h-[100dvh] md:sticky md:top-0 relative flex items-center justify-center overflow-hidden
                        ${isDarkMode ? "bg-[#121212]" : "bg-slate-50"}`}>

                        {/* Background Blur Effect */}
                        {(selectedVariant?.image ?? product?.image)?.startsWith('https') && (
                            <div
                                className="absolute inset-0 bg-cover bg-center opacity-30 blur-3xl scale-110"
                                style={{ backgroundImage: `url(${selectedVariant?.image ?? product?.image})` }}
                            />
                        )}

                        {/* Main Image */}
                        <div className="relative w-full h-full p-0 md:p-8 lg:p-12">
                            {/* Kondisi Gambar Modal */}
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className={`w-full h-full flex items-center justify-center md:rounded-[2rem] shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-200'}`}>
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full object-cover md:object-contain md:rounded-[2rem] shadow-2xl transition-all duration-700"
                                    alt={product?.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center md:rounded-[2rem] shadow-2xl transition-all duration-700 ${isDarkMode ? 'bg-[#18181b]' : 'bg-slate-200'}`}>
                                    <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {/* Floating Discount Badge */}
                            {product?.discount_price ? (
                                <div className="absolute top-4 left-4 md:top-12 md:left-12 bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full font-semibold text-xs tracking-wide shadow-xl flex items-center gap-2 border border-slate-100">
                                    <span className="w-2 h-2 rounded-full bg-[var(--product-primary-color)] animate-pulse" />
                                    Save {Promo(product, selectedVariant)}
                                </div>
                            ) : ''}
                        </div>
                    </div>

                    {/* Info Section - Lots of Whitespace & Soft Borders */}
                    <div className="w-full md:w-[55%] lg:w-[50%] flex flex-col z-10">
                        <div className="p-8 sm:p-12 lg:p-16 flex-grow space-y-12">

                            {/* Header */}
                            <div className="space-y-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase
                                    ${isDarkMode ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                                    {product?.category || 'Collection'}
                                </span>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]">
                                    {product?.name}
                                </h2>

                                <div className="flex items-baseline gap-4 pt-2">
                                    <span className="text-3xl font-light tracking-tight">
                                        {formatIDR(currentFinalPrice)}
                                    </span>
                                    {currentDiscount > 0 ? (
                                        <span className="text-lg opacity-40 line-through font-light">
                                            {formatIDR(currentPrice)}
                                        </span>
                                    ) : ''}
                                </div>
                            </div>

                            {/* Description */}
                            <div className={`text-sm leading-relaxed font-light
                                ${isDarkMode ? "text-zinc-400" : "text-slate-500"}`}>
                                <ExpandableHTML htmlContent={product?.description} />
                            </div>

                            {/* Options Area */}
                            <div className="space-y-10 pt-4">
                                {product?.variants && product?.variants?.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium tracking-wide">Select Variant</p>
                                        </div>
                                        <VariantPicker
                                            isStock={product?.is_stock}
                                            variants={product?.variants}
                                            selectedVariant={selectedVariant}
                                            setSelectedVariant={setSelectedVariant}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                ) : ''}

                                {product?.is_qty ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-medium tracking-wide">Quantity</p>
                                            <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                                {selectedVariant?.product_variant_stock ?? product?.stock} Available
                                            </p>
                                        </div>
                                        <QtySelector
                                            product={product}
                                            selectedVariant={selectedVariant}
                                            quantity={quantity}
                                            setQuantity={setQuantity}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        {/* Checkout Footer - Fixed to bottom */}
                        <div className={`p-8 sm:p-12 lg:p-16 pt-8 mt-auto border-t flex flex-col gap-6
                            ${isDarkMode ? "bg-[#0a0a0a] border-white/5" : "bg-white border-slate-100"}`}>

                            <div className="flex justify-between items-end">
                                <span className={`text-xs font-medium ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>Subtotal</span>
                                <span className="text-2xl font-bold tracking-tight">
                                    {formatIDR(currentFinalPrice * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full py-5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                    ${isDarkMode
                                        ? "bg-white text-black hover:bg-zinc-200"
                                        : "bg-slate-900 text-white hover:bg-[var(--product-primary-color)]"}`}
                            >
                                <ShoppingBag size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default Fourteen;