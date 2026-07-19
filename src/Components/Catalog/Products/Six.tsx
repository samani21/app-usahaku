"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import { Minus, Plus, ShoppingBag, X, ArrowUpRight, Maximize2 } from 'lucide-react';
import AlertWrapper from './AlertWrapper';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatIDR } from '@/types/FormtRupiah';
import ExpandableHTML from './ExpandableHTML';
import { getPromoDetails, Promo } from './PromoType';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { OutletsType } from '@/types/Admin/OutletType';
import { Icon } from '@iconify/react';

type Props = {
    products: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

const Six = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null);
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
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 p-4 md:p-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        className={`group relative flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
                            ${isDarkMode ? 'text-white' : 'text-zinc-900'}
                            ${!is_available ? 'opacity-50' : ''}`}
                    >
                        {/* Image Container with Studio Frame */}
                        <div className={`relative overflow-hidden transition-all duration-700
                            ${isDarkMode ? "bg-[#0a0a0a] border border-zinc-800" : "bg-zinc-50 border border-zinc-200"}
                            ${is_available ? "cursor-pointer group-hover:border-zinc-500" : "cursor-not-allowed grayscale"}`}>

                            {/* Promo Label */}
                            {label && is_available && (
                                <div className={`absolute top-4 right-4 z-20 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm
                                    ${isDarkMode ? "bg-white text-black" : "bg-zinc-900 text-white"}`}>
                                    <span>{label}</span>
                                </div>
                            )}

                            <div className="relative aspect-[4/5] overflow-hidden">
                                {/* Kondisi Gambar Card */}
                                {!p?.image ? (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.2s] ease-out ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'} ${is_available ? "group-hover:scale-105" : ""}`}>
                                        <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className={`w-full h-full object-cover transition-transform duration-[1.2s] ease-out
                                            ${is_available ? "group-hover:scale-105" : ""}`}
                                        alt={p.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.2s] ease-out ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-100'} ${is_available ? "group-hover:scale-105" : ""}`}>
                                        <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}`} />
                                    </div>
                                )}

                                {/* Overlay / Quick Action */}
                                <div
                                    onClick={() => {
                                        if (is_available) {
                                            setProduct(p);
                                            setProductAlert(p);
                                        }
                                    }}
                                    className={`absolute inset-0 transition-all duration-500 flex items-center justify-center z-10
                                        ${is_available
                                            ? "bg-black/0 group-hover:bg-black/20 backdrop-blur-none group-hover:backdrop-blur-[2px]"
                                            : "bg-transparent"}`}
                                >
                                    <div className={`px-8 py-3 flex items-center gap-3 font-bold text-xs tracking-[0.2em] uppercase transition-all duration-500 shadow-2xl
                                        ${is_available
                                            ? "bg-white text-black translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                                            : "bg-zinc-200 text-zinc-500 translate-y-0 opacity-100 border border-zinc-300"}`}>
                                        {is_available ? (
                                            <>View Item <ArrowUpRight size={16} strokeWidth={2.5} /></>
                                        ) : (
                                            <>Out of Stock <X size={16} strokeWidth={2.5} /></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Text Info - Architectural Layout */}
                        <div className="mt-5 flex flex-col gap-2 relative">
                            <div className="flex justify-between items-start gap-4">
                                <h3 className={`font-black text-lg md:text-xl uppercase tracking-tighter leading-none max-w-[70%] transition-colors
                                    ${is_available && isDarkMode ? "group-hover:text-zinc-300" : is_available && !isDarkMode ? "group-hover:text-zinc-600" : ""}`}>
                                    {p.name}
                                </h3>
                                <div className="flex flex-col items-end">
                                    {label && is_available && (
                                        <p className={`text-[10px] font-bold line-through mb-0.5 tracking-wider
                                            ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                            {formatIDR(p.price)}
                                        </p>
                                    )}
                                    <p className={`text-lg font-medium tracking-tight italic
                                        ${is_available ? "" : "line-through opacity-50"}`}>
                                        {formatIDR(finalPrice)}
                                    </p>
                                </div>
                            </div>

                            <div className={`flex items-center text-[10px] font-bold uppercase tracking-[0.2em] mt-1
                                ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                <span>{p.category}</span>
                                <span className={`h-[1px] flex-1 mx-4 ${isDarkMode ? "bg-zinc-800" : "bg-zinc-200"}`}></span>
                                <span>{is_available ? 'Available' : 'Unavailable'}</span>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal - Diperbaiki Scrolling & Split Layout-nya */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                isDarkMode={isDarkMode}
            >
                {/* Perbaikan utama ada di pembungkus bawah ini: 
                  Kita hapus `overflow-hidden` dan biarkan tinggi mengikuti konten di mobile,
                  namun di desktop tetap split-screen dan gambar sticky. 
                */}
                <div className={`w-full flex flex-col md:flex-row min-h-full ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-zinc-900'}`}>

                    {/* Left: Image (Sticky on Desktop) */}
                    <div className={`w-full md:w-[50%] h-[45vh] md:h-[85vh] md:sticky md:top-0 relative shrink-0 ${isDarkMode ? "bg-zinc-900" : "bg-zinc-100"}`}>
                        {/* Kondisi Gambar Modal */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt={product?.name}
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
                            </div>
                        )}
                    </div>

                    {/* Right: Info Panel (Flows naturally, allowing ModalWrapper to scroll it) */}
                    <div className={`w-full md:w-[50%] flex flex-col z-10 ${isDarkMode ? "md:border-l border-zinc-800" : "md:border-l border-zinc-200"}`}>

                        {/* Header Details */}
                        <div className="p-6 md:p-12 pb-6">
                            <div className={`flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase mb-4
                                ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                <span>Archive</span>
                                <span>/</span>
                                <span className={isDarkMode ? "text-zinc-300" : "text-zinc-600"}>{product?.category}</span>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                {product?.name}
                            </h2>

                            <div className="flex flex-col gap-1">
                                <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1
                                    ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Pricing</span>
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl md:text-4xl font-light tracking-tighter italic">
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </span>
                                    {product?.discount_price ? (
                                        <span className={`text-sm font-bold line-through mb-1.5
                                            ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={`px-6 md:px-12 py-6 border-y ${isDarkMode ? "border-zinc-800" : "border-zinc-100"}`}>
                            <ExpandableHTML
                                htmlContent={product?.description}
                                className={`text-sm leading-relaxed font-medium ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                            />
                        </div>

                        {/* Interactive UI (Variants & Quantity) */}
                        <div className="p-6 md:p-12 space-y-8 flex-grow">
                            {product?.variants && product?.variants?.length > 0 ? (
                                <div className="space-y-4">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.3em]
                                        ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Select Variant</span>
                                    <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}

                            {product?.is_qty ? (
                                <div className="space-y-4">
                                    <span className={`text-[9px] font-black uppercase tracking-[0.3em]
                                        ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Quantity</span>
                                    <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}
                        </div>

                        {/* Action Footer (Mengalir di bagian paling bawah) */}
                        <div className={`p-6 md:p-12 pt-6 border-t mt-auto ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}>
                            <div className="flex items-end justify-between mb-6">
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1
                                        ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Total</span>
                                    <span className="text-2xl md:text-3xl font-bold tracking-tighter italic">
                                        {formatIDR((selectedVariant?.final_price || (product?.final_price ?? 0)) * quantity)}
                                    </span>
                                </div>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full py-5 md:py-6 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isDarkMode ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                            >
                                ADD TO BAG <Maximize2 size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
}

export default Six;