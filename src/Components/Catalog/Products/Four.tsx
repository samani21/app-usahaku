"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Check, X, ArrowRight, Zap } from 'lucide-react';
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

const Four = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null)
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null)
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null)
    const [quantity, setQuantity] = useState<number>(1)

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
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
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
                        className={`group relative h-[400px] sm:h-[450px] rounded-3xl overflow-hidden transition-all duration-300 ease-out shadow-sm
                            ${isDarkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200"}
                            ${is_available
                                ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
                                : "cursor-not-allowed opacity-75"}`}
                    >
                        {/* Background Image with Gentle Zoom */}
                        <div className="absolute inset-0 h-2/3 overflow-hidden">
                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}>
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
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                            {/* Overlay for better blending */}
                            <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300
                                ${isDarkMode ? "from-slate-900 via-slate-900/40" : "from-white via-white/40"} to-transparent`} />
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                            {label && is_available ? (
                                <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
                                    {label}
                                </span>
                            ) : !is_available ? (
                                <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-md">
                                    Stok Habis
                                </span>
                            ) : <div />}

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-md
                                ${is_available
                                    ? "bg-white/80 text-slate-900 group-hover:bg-[var(--product-primary-color)] group-hover:text-white"
                                    : "bg-slate-200/50 text-slate-500"}`}>
                                {is_available ? <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform" /> : <X size={18} />}
                            </div>
                        </div>

                        {/* Bottom Content Area */}
                        <div className={`absolute bottom-0 left-0 right-0 p-5 sm:p-6 transition-all duration-300 z-10 flex flex-col justify-end h-1/2
                            ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>

                            <span className="text-xs font-semibold tracking-wider text-[var(--product-primary-color)] mb-1 block">
                                {p.category}
                            </span>

                            <h3 className={`text-lg sm:text-xl font-bold leading-tight mb-3 line-clamp-2
                                ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                {p?.name}
                            </h3>

                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    {label && is_available && (
                                        <span className={`text-xs line-through font-medium block mb-0.5
                                            ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                    <span className={`text-xl font-black tracking-tight 
                                        ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                        {formatIDR(finalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal Experience (Clean Split Layout) */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null);
                    setSelectedVariant(null);
                    setQuantity(1);
                }}
                isDarkMode={isDarkMode}
            >
                <div className="flex flex-col md:flex-row h-full">
                    {/* Visual Section */}
                    <div className={`md:w-5/12 relative overflow-hidden shrink-0 
                        ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>

                        {/* Kondisi Gambar Modal */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="w-full h-72 md:h-full flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="w-full h-72 md:h-full object-cover object-center"
                                alt={product?.name}
                            />
                        ) : (
                            <div className="w-full h-72 md:h-full flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        )}

                    </div>

                    {/* Controls Section */}
                    <div className={`md:w-7/12 p-6 sm:p-10 flex flex-col h-full overflow-y-auto no-scrollbar
                        ${isDarkMode ? "bg-slate-900" : "bg-white"}`}>

                        <div className="mb-6 flex-shrink-0">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap size={16} className="text-[var(--product-primary-color)] fill-current" />
                                <span className={`text-xs font-bold uppercase tracking-widest
                                    ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{product?.category}</span>
                            </div>

                            <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight
                                ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                {product?.name}
                            </h2>

                            {/* Price moved to content area for better visibility */}
                            <div className="flex flex-col gap-1 mb-6">
                                <p className={`text-3xl font-black text-[var(--product-primary-color)]`}>
                                    {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                </p>
                                {product?.discount_price ? (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">
                                            Hemat {Promo(product, selectedVariant)}
                                        </p>
                                        <p className={`text-sm font-semibold line-through 
                                            ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </p>
                                    </div>
                                ) : null}
                            </div>

                            <ExpandableHTML
                                htmlContent={product?.description}
                                className={`text-sm leading-relaxed mb-6
                                    ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                            />
                        </div>

                        <div className="space-y-6 flex-grow">
                            {product?.variants && product?.variants?.length > 0 && (
                                <div className="space-y-3">
                                    <p className={`text-xs font-bold uppercase tracking-wider
                                        ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Pilih Varian</p>
                                    <VariantPicker
                                        isStock={product?.is_stock}
                                        variants={product?.variants}
                                        selectedVariant={selectedVariant}
                                        setSelectedVariant={setSelectedVariant}
                                        isDarkMode={isDarkMode}
                                    />
                                </div>
                            )}

                            {product?.is_qty ? (
                                <div className="space-y-3">
                                    <p className={`text-xs font-bold uppercase tracking-wider
                                        ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Kuantitas</p>
                                    <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}
                        </div>

                        {/* Sticky Bottom Summary */}
                        <div className={`mt-8 pt-6 border-t flex flex-col gap-4 flex-shrink-0
                            ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-bold 
                                    ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Total Pembayaran</span>
                                <span className="text-2xl font-black text-[var(--product-primary-color)]">
                                    {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`group relative w-full py-4 overflow-hidden rounded-xl font-bold text-sm tracking-wide transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                    ${isDarkMode
                                        ? "bg-white text-slate-900 hover:bg-[var(--product-primary-color)] hover:text-white"
                                        : "bg-slate-900 text-white hover:bg-[var(--product-primary-color)]"}`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Masukkan Keranjang <Check size={18} strokeWidth={2.5} />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default Four;