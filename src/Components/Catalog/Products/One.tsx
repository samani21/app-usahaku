"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import AlertWrapper from './AlertWrapper';
import { Check, ShoppingBag, Tag, X, Eye } from 'lucide-react';
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

const One = ({ products, isDarkMode, handleCart }: Props) => {
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
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        className={`group relative flex flex-col rounded-[24px] overflow-hidden transition-all duration-500 ease-out
                            ${is_available ? 'cursor-pointer hover:-translate-y-1.5' : 'cursor-not-allowed opacity-80'} 
                            ${isDarkMode
                                ? 'bg-[#1E293B]/40 hover:bg-[#1E293B]/80 border border-slate-800/60 ' + (is_available ? 'hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]' : '')
                                : 'bg-white border border-slate-100 ' + (is_available ? 'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]' : '')
                            }`}
                        onClick={() => {
                            if (is_available) {
                                setProduct(p);
                                setProductAlert(p);
                            }
                        }}
                    >
                        {/* 1. Image Container Premium */}
                        <div className={`relative aspect-[4/5] overflow-hidden ${isDarkMode ? "bg-slate-800/50" : 'bg-slate-50'}`}>
                            {/* Gradient Overlay bottom untuk kontras text jika ada */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Discount Badge */}
                            {label && is_available && (
                                <div className="absolute top-4 left-4 z-20 bg-rose-500/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 tracking-wide">
                                    <Tag size={12} strokeWidth={2.5} /> {label}
                                </div>
                            )}

                            {/* Out of Stock Badge Overlay */}
                            {!is_available && (
                                <div className={`absolute inset-0 z-20 flex items-center justify-center ${isDarkMode ? "bg-black/40" : "bg-white/40"} backdrop-blur-[2px]`}>
                                    <div className="bg-slate-900/90 text-white text-xs font-bold px-5 py-2.5 rounded-full tracking-widest uppercase shadow-xl">
                                        Stok Habis
                                    </div>
                                </div>
                            )}

                            {/* Hover Action Button */}
                            {is_available && (
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center">
                                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-full text-slate-900 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out shadow-xl">
                                        <Eye size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                            )}

                            {/* FIX: Kondisi Gambar Sesuai Request Baru */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-105' : 'grayscale-[0.8] brightness-90'}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transform transition-transform duration-700 ease-out
                                        ${is_available ? 'group-hover:scale-105' : 'grayscale-[0.8] brightness-90'}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transform transition-transform duration-700 ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-105' : 'grayscale-[0.8] brightness-90'}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}
                        </div>

                        {/* 2. Content Container */}
                        <div className={`p-4 md:p-5 flex flex-col flex-grow ${!is_available ? isDarkMode ? ':bg-transparent' : 'bg-slate-50' : ''}`}>
                            <div className="flex justify-between items-start mb-2.5">
                                <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors
                                    ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    {p.category}
                                </span>
                            </div>

                            <h3 className={`font-semibold text-sm md:text-base line-clamp-2 mb-3 leading-snug flex-grow transition-colors duration-300
                                ${!is_available ? 'text-slate-400' : isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-[var(--product-primary-color)]'}`}>
                                {p?.name}
                            </h3>

                            <div className="mt-auto pt-3 flex flex-col justify-end">
                                {/* Original Price */}
                                <div className="h-4 mb-0.5">
                                    {label && (
                                        <span className={`text-[11px] font-medium line-through ${isDarkMode ? 'text-slate-500' : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-end justify-between gap-2">
                                    <p className={`font-bold text-lg md:text-xl tracking-tight transition-colors
                                        ${is_available ? `${isDarkMode ? "text-white" : "text-slate-900"} group-hover:text-[var(--product-primary-color)]` : `${isDarkMode ? 'text-slate-600' : "text-slate-400"}`}`}>
                                        {formatIDR(finalPrice)}
                                    </p>

                                    {/* Shopping Bag Icon Button */}
                                    <div className={`hidden sm:flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300
                                        ${!is_available
                                            ? ` ${isDarkMode ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-300"}`
                                            : isDarkMode
                                                ? 'bg-slate-800 text-slate-300 group-hover:bg-[var(--product-primary-color)] group-hover:text-white'
                                                : 'bg-slate-50 text-slate-500 group-hover:bg-[var(--product-primary-color)] group-hover:text-white group-hover:shadow-md'}`}>
                                        <ShoppingBag size={16} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. Product Detail Modal */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null);
                    setSelectedVariant(null);
                    setQuantity(1);
                }}
                isDarkMode={isDarkMode}
            >
                <div className='flex flex-col md:flex-row h-full md:min-h-[600px] overflow-y-auto no-scrollbar'>
                    {/* Gallery Section */}
                    <div className={`md:w-1/2 relative ${isDarkMode ? "bg-[#0F172A]" : "bg-slate-50"}`}>

                        {/* FIX: Kondisi Gambar Modal Sesuai Request Baru */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="w-full h-full object-cover max-h-[450px] md:max-h-full"
                                alt={product?.name}
                            />
                        ) : (
                            <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                            </div>
                        )}

                        {/* Gradient atas untuk tombol close mobile */}
                        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent md:hidden" />
                    </div>

                    {/* Info Section */}
                    <div className="md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col h-full">
                        <div className='flex flex-wrap items-center gap-3 mb-5'>
                            <span className={`px-3.5 py-1 ${isDarkMode ? "bg-slate-800 text-slate-300 " : "bg-slate-100 text-slate-600"} text-[11px] font-bold rounded-full uppercase tracking-wider`}>
                                {product?.category}
                            </span>
                            {product?.discount_price ? (
                                <div className={`${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"} text-rose-500 px-3 py-1 rounded-full flex items-center font-bold text-[11px] gap-1.5 tracking-wider uppercase`}>
                                    <Tag size={12} strokeWidth={2.5} />
                                    <span>Hemat {Promo(product, selectedVariant)}</span>
                                </div>
                            ) : null}
                        </div>

                        <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 leading-tight tracking-tight ${isDarkMode ? " text-white" : " text-slate-900"}`}>
                            {product?.name}
                        </h2>

                        <div className="flex items-baseline gap-3 mb-8">
                            <p className="text-3xl md:text-4xl font-extrabold text-[var(--product-primary-color)] leading-none tracking-tighter">
                                {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                            </p>
                            {(product?.discount_price || selectedVariant?.discount_price) ? (
                                <p className={`text-lg md:text-xl font-medium ${isDarkMode ? "text-slate-500 " : " text-slate-400 "}line-through`}>
                                    {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                </p>
                            ) : ''}
                        </div>

                        <div className="space-y-8 flex-grow">
                            {product?.variants && product.variants.length > 0 && (
                                <div>
                                    <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                </div>
                            )}

                            <div>
                                <label className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-3 block`}>
                                    Deskripsi Produk
                                </label>
                                <ExpandableHTML
                                    htmlContent={product?.description}
                                    className={`${isDarkMode ? "text-slate-300" : "text-slate-600"} text-sm leading-relaxed`}
                                />
                            </div>
                        </div>

                        {/* Sticky Bottom Bar di Modal */}
                        <div className={`mt-8 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                            <div className='flex items-end justify-between mb-6'>
                                <div>
                                    <label className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-2 block`}>
                                        Atur Jumlah
                                    </label>
                                    {product?.is_qty ? (
                                        <QtySelector quantity={quantity} setQuantity={setQuantity} product={product} selectedVariant={selectedVariant} isDarkMode={isDarkMode} />
                                    ) : <div className="h-[42px]" />}
                                </div>

                                <div className="text-right">
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"} mb-1`}>
                                        Total Harga
                                    </p>
                                    <p className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                        {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                    </p>
                                </div>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full mb-4 group/btn relative overflow-hidden py-4 px-6 bg-[var(--product-primary-color)] text-white rounded-[20px] font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_8px_25px_-8px_var(--product-primary-color)] active:scale-[0.98] ${isDarkMode ? 'disabled:bg-slate-800 ' : "disabled:bg-slate-300"}disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <ShoppingBag size={18} strokeWidth={2.5} /> BELI SEKARANG
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default One;