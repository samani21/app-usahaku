"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Tag, X, ArrowRight } from 'lucide-react';
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

const Thirteen = ({ products, isDarkMode, handleCart }: Props) => {
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

    const currentPrice = selectedVariant?.price ?? product?.price ?? 0;
    const currentFinalPrice = selectedVariant?.final_price ?? product?.final_price ?? 0;
    const currentDiscount = currentPrice - currentFinalPrice;

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity])

    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 p-4 md:p-8 
            ${isDarkMode ? 'text-zinc-100' : 'text-slate-900'}`}>

            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`text-center group flex flex-col items-center transition-all duration-700 ease-out
                            ${is_available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                    >
                        {/* Frame Gambar Minimalis - Editorial Style */}
                        <div className={`aspect-[4/5] w-full mb-8 overflow-hidden relative transition-all duration-700
                            ${isDarkMode ? "bg-[#121214]" : "bg-slate-50"} 
                            ${is_available ? "group-hover:shadow-2xl" : ""}`}>

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] ${is_available ? "group-hover:scale-105" : "opacity-30 grayscale"}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] 
                                        ${is_available ? "group-hover:scale-105" : "opacity-30 grayscale"}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[2s] ease-[cubic-bezier(0.25,1,0.5,1)] ${is_available ? "group-hover:scale-105" : "opacity-30 grayscale"}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {/* Decorative Border Frame (Muncul saat hover) */}
                            {is_available && (
                                <div className={`absolute inset-4 border transition-all duration-1000 pointer-events-none opacity-0 group-hover:opacity-20 scale-95 group-hover:scale-100
                                    ${isDarkMode ? 'border-white' : 'border-black'}`} />
                            )}

                            {/* Label Status */}
                            {label && is_available ? (
                                <div className={`absolute top-0 right-0 px-5 py-2.5 text-[9px] tracking-[0.25em] font-medium uppercase z-10 shadow-sm
                                    ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {label}
                                </div>
                            ) : !is_available && (
                                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className={`text-[10px] tracking-[0.4em] uppercase font-light border-y py-2 px-6
                                        ${isDarkMode ? 'border-white/20 bg-black/40 text-white' : 'border-black/20 bg-white/60 text-black'}`}>
                                        Archived
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Info Produk - Tipografi Renggang */}
                        {p.category ? (
                            <p className={`text-[9px] sm:text-[10px] tracking-[0.5em] uppercase mb-3 transition-opacity duration-500
                                ${is_available ? "opacity-40 group-hover:opacity-80" : "opacity-30"}`}>
                                {p.category}
                            </p>
                        ) : ''}

                        <h3 className={`text-base sm:text-lg font-light tracking-[0.15em] uppercase leading-relaxed mb-4 line-clamp-1 w-full px-4
                            ${!is_available ? "opacity-50" : ""}`}>
                            {p.name}
                        </h3>

                        {/* Decorative Line Separator */}
                        <div className={`h-px transition-all duration-700 ease-out mb-4
                            ${isDarkMode ? 'bg-white' : 'bg-black'}
                            ${is_available ? "w-8 opacity-20 group-hover:w-16 group-hover:opacity-50" : "w-4 opacity-10"}`}
                        />

                        {/* Price Display */}
                        <div className="flex flex-col items-center gap-1.5 mt-auto">
                            {label && is_available && (
                                <span className={`text-[9px] line-through tracking-widest uppercase
                                    ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`}>
                                    {formatIDR(p.price)}
                                </span>
                            )}
                            <span className={`font-medium text-sm tracking-widest uppercase
                                ${!is_available ? "opacity-30 font-light" : ""}`}>
                                {is_available ? formatIDR(finalPrice) : "Out of Stock"}
                            </span>
                        </div>
                    </div>
                );
            })}

            {/* Modal - Editorial Layout (Scroll Fixed: Image Right Desktop, Top Mobile) */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null)
                    setSelectedVariant(null)
                    setQuantity(1)
                }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col md:flex-row-reverse min-h-full font-sans
                    ${isDarkMode ? 'bg-[#0f0f11] text-zinc-100' : 'bg-[#fafafa] text-slate-900'}`}>

                    {/* Bagian Kanan: Visual Frame (Sticky di Desktop) */}
                    <div className={`w-full md:w-1/2 h-[50vh] md:h-auto md:min-h-[100dvh] md:sticky md:top-0 relative shrink-0 overflow-hidden
                        ${isDarkMode ? "bg-[#18181b]" : "bg-zinc-100"}`}>

                        {/* Kondisi Gambar Modal */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] ease-out hover:scale-105"
                                alt={product?.name}
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-500' : 'text-slate-400'}`} />
                            </div>
                        )}

                        {/* Kategori yang dioverlay asimetris seperti desain majalah */}
                        {product?.category ? (
                            <div className={`hidden md:block absolute top-16 left-0 -ml-1 px-8 py-3 shadow-xl tracking-[0.3em] text-xs font-light uppercase border-y
                                ${isDarkMode ? "bg-[#0f0f11]/90 border-white/10 backdrop-blur-md" : 'bg-white/90 border-black/10 backdrop-blur-md'}`}>
                                {product?.category}
                            </div>
                        ) : ''}

                        {product?.discount_price ? (
                            <div className={`absolute top-6 right-6 px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl
                                ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                -{Promo(product, selectedVariant)}
                            </div>
                        ) : ''}
                    </div>

                    {/* Bagian Kiri: Detail Informasi (Scrollable Area) */}
                    <div className="w-full md:w-1/2 p-6 sm:p-10 md:p-16 flex flex-col justify-between">

                        <div className="space-y-12">
                            {/* Header Info */}
                            <div className="space-y-6 text-center md:text-left">
                                {product?.category ? (
                                    <span className="md:hidden text-[10px] font-medium uppercase tracking-[0.4em] opacity-50 block">
                                        {product?.category}
                                    </span>
                                ) : ''}
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-[0.1em] uppercase leading-tight">
                                    {product?.name}
                                </h2>
                                <div className={`w-12 h-px mx-auto md:mx-0 ${isDarkMode ? 'bg-white/30' : 'bg-black/30'}`} />
                            </div>

                            {/* Harga & Status Block (Bento-style Minimalist) */}
                            <div className={`p-8 border ${isDarkMode ? "bg-[#18181b] border-white/10" : "bg-white border-black/10"}`}>
                                <div className="space-y-3 text-center md:text-left">
                                    <p className="text-[9px] font-medium uppercase tracking-[0.3em] opacity-40">Detail Harga</p>

                                    <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4">
                                        <span className="text-2xl sm:text-3xl font-medium tracking-widest uppercase">
                                            {formatIDR(currentFinalPrice)}
                                        </span>
                                        {currentDiscount > 0 ? (
                                            <span className="text-sm opacity-40 line-through tracking-widest uppercase">
                                                {formatIDR(currentPrice)}
                                            </span>
                                        ) : ''}
                                    </div>

                                    {currentDiscount > 0 ? (
                                        <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1.5 border text-[9px] font-medium uppercase tracking-widest
                                            ${isDarkMode ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-emerald-500/20 text-emerald-600 bg-emerald-50'}`}>
                                            <Tag size={12} />
                                            Save {formatIDR(currentDiscount)} {product?.percent_discount && `(${Promo(product, selectedVariant)})`}
                                        </div>
                                    ) : ''}
                                </div>
                            </div>

                            {/* Deskripsi Produk */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40 text-center md:text-left">Description</h4>
                                <div className={`text-sm opacity-70 leading-loose font-light text-center md:text-left mx-auto md:mx-0 max-w-lg`}>
                                    <ExpandableHTML htmlContent={product?.description} />
                                </div>
                            </div>

                            {/* Spesifikasi & Input */}
                            <div className={`py-10 border-y space-y-10 ${isDarkMode ? "border-white/10" : "border-black/10"}`}>
                                {product?.variants && product?.variants?.length > 0 ? (
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40 text-center md:text-left">Variants</h4>
                                        <VariantPicker
                                            isStock={product?.is_stock}
                                            variants={product?.variants}
                                            selectedVariant={selectedVariant}
                                            setSelectedVariant={setSelectedVariant}
                                            isDarkMode={isDarkMode}
                                        />
                                    </div>
                                ) : ''}

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4">
                                    {product?.is_qty ? (
                                        <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-4">
                                            <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40">Quantity</h4>
                                            <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : ''}

                                    <div className="text-center sm:text-right w-full sm:w-auto">
                                        <h4 className="text-[10px] font-medium uppercase tracking-[0.3em] opacity-40 mb-3">Subtotal</h4>
                                        <p className="text-xl font-medium tracking-widest uppercase">
                                            {formatIDR((currentFinalPrice) * quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="mt-12">
                            <button
                                disabled={disableButton}
                                onClick={() => addCart()}
                                className={`w-full py-6 font-light uppercase tracking-[0.3em] text-xs transition-all duration-500 flex items-center justify-center gap-3 border disabled:opacity-30 disabled:cursor-not-allowed
                                    ${isDarkMode
                                        ? "bg-white text-black border-white hover:bg-transparent hover:text-white"
                                        : "bg-black text-white border-black hover:bg-transparent hover:text-black"}`}
                            >
                                Process Order <ArrowRight size={16} strokeWidth={1} />
                            </button>
                        </div>
                    </div>

                </div>
            </ModalWrapper>
        </div>
    )
}

export default Thirteen;