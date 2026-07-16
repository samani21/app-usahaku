"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
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
                            {/* Promo Label */}
                            {label && is_available && (
                                <div className={`absolute top-4 left-4 z-20 ${isDarkMode ? 'bg-white text-slate-900' : "bg-slate-900 text-white"} text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg`}>
                                    {label}
                                </div>
                            )}

                            {/* Refined Sold Out Badge */}
                            {!is_available && (
                                <div className={`absolute inset-0 z-30 flex items-center justify-center ${isDarkMode ? "bg-black/50" : "bg-slate-900/40"} backdrop-blur-sm`}>
                                    <div className="bg-white/95 text-slate-900 font-black text-[11px] px-6 py-2.5 uppercase tracking-[0.3em] shadow-xl rounded-sm">
                                        Stok Habis
                                    </div>
                                </div>
                            )}

                            {/* Card Image Handling */}
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

                            {/* Floating Quick Action */}
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

                                <p className={`font-black text-lg md:text-xl tracking-tight transition-colors duration-300
                                    ${!is_available ? "text-slate-400" : "text-[var(--product-primary-color)]"}`}>
                                    {formatIDR(finalPrice)}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. Immersive Modal Experience */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null)
                    setSelectedVariant(null)
                    setQuantity(1)
                }}
                isDarkMode={isDarkMode}
            >
                {/* Dynamic Background Blur */}
                <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${isDarkMode ? 'opacity-20' : 'opacity-[0.07]'}`}>
                    {!(selectedVariant?.image ?? product?.image) ? (
                        <div className="w-full h-full scale-[1.2] blur-[80px] bg-slate-500" />
                    ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                        <img src={selectedVariant?.image ?? product?.image} className="w-full h-full object-cover scale-[1.2] blur-[80px]" alt="" />
                    ) : (
                        <div className="w-full h-full scale-[1.2] blur-[80px] bg-slate-500" />
                    )}
                </div>

                <div className="relative w-full h-full p-6 sm:p-12 flex flex-col items-center text-center max-w-5xl mx-auto space-y-12 overflow-y-auto no-scrollbar">

                    {/* Hero Image Section */}
                    <div className="relative mt-4">
                        <div className={`w-56 h-56 sm:w-72 sm:h-72 rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-700 ease-out border-[6px] 
                            ${isDarkMode ? "border-slate-800 shadow-black/50 bg-slate-800" : "border-white shadow-slate-200/50 bg-slate-50"}`}>

                            {/* Modal Hero Image Handling */}
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
                        {/* Decorative Badge */}
                        <div className="absolute -bottom-5 -right-5 bg-[var(--product-primary-color)] text-white w-20 h-20 rounded-full flex items-center justify-center -rotate-12 font-black text-[11px] leading-tight shadow-xl uppercase tracking-wider border-4 border-transparent backdrop-blur-sm">
                            <span className="text-center">Best<br />Pick</span>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="space-y-4 w-full max-w-2xl">
                        <p className={`text-[var(--product-primary-color)] font-bold uppercase tracking-[0.4em] text-[10px]`}>
                            {product?.category}
                        </p>
                        <h2 className={`text-4xl sm:text-6xl font-black tracking-tighter uppercase leading-[0.9] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {product?.name}
                        </h2>
                    </div>

                    {/* Interactive Content Grid */}
                    <div className="w-full grid md:grid-cols-2 gap-10 md:gap-16 items-start pb-8">
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
                                ${isDarkMode ? 'bg-slate-800/40 border-white/5 shadow-2xl' : 'bg-white/60 border-slate-200 shadow-xl'}`}>

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

                                <button
                                    disabled={disableButton}
                                    onClick={() => addCart()}
                                    className={`w-full py-5 group/btn relative overflow-hidden rounded-[1.2rem] font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300
                                        ${isDarkMode
                                            ? "bg-white text-slate-900 hover:bg-[var(--product-primary-color)] hover:text-white"
                                            : "bg-slate-900 text-white hover:bg-[var(--product-primary-color)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
                                        } disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed`}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <ShoppingCart size={16} strokeWidth={2.5} /> Tambah ke Tas
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default Two;