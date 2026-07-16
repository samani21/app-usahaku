"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Check, MoveUpRight, Lock, ShieldCheck } from 'lucide-react';
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

const Ten = ({ products, isDarkMode, handleCart }: Props) => {
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
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 md:p-8 max-w-7xl mx-auto auto-rows-[220px] md:auto-rows-[260px]'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                // Pola Bento Box: Kartu pertama dari setiap kelipatan 5 akan membesar
                const isLarge = i % 5 === 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative rounded-[2rem] overflow-hidden transition-all duration-500 ease-out flex flex-col justify-end
                            ${isLarge ? "col-span-2 row-span-2" : "col-span-2 row-span-1"}
                            ${is_available
                                ? `cursor-pointer ${isDarkMode ? "shadow-md hover:shadow-2xl hover:-translate-y-1" : "shadow-md hover:shadow-xl hover:-translate-y-1"}`
                                : "cursor-not-allowed opacity-80"
                            }`}
                    >
                        {/* Background Image (Absolute Full Bleed) */}
                        <div className={`absolute inset-0 overflow-hidden ${isDarkMode ? "bg-slate-900" : "bg-slate-100"}`}>
                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ease-out ${is_available ? "group-hover:scale-105" : "grayscale opacity-75"}`}>
                                    <Icon icon="mynaui:image" className={`w-24 h-24 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-700 ease-out 
                                        ${is_available ? "group-hover:scale-105" : "grayscale opacity-75"}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ease-out ${is_available ? "group-hover:scale-105" : "grayscale opacity-75"}`}>
                                    <Icon icon={p.image} className={`w-24 h-24 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            )}
                        </div>

                        {/* Smooth Gradient Overlay for Readability */}
                        <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 pointer-events-none
                            ${isDarkMode ? "from-slate-900 via-slate-900/30 to-transparent" : "from-black/80 via-black/20 to-transparent"} 
                            ${is_available ? "opacity-80 group-hover:opacity-90" : "opacity-90"}`}
                        />

                        {/* Top Layer - Badges & Icons */}
                        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-10">
                            {label && is_available ? (
                                <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                    {label}
                                </span>
                            ) : !is_available ? (
                                <span className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                    Sold Out
                                </span>
                            ) : <div />}

                            <div className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm
                                ${is_available
                                    ? "bg-white/20 text-white opacity-0 group-hover:opacity-100 group-hover:bg-[var(--product-primary-color)]"
                                    : "bg-slate-900/50 text-white/70 opacity-100"}`}>
                                {is_available ? <MoveUpRight size={18} /> : <Lock size={16} />}
                            </div>
                        </div>

                        {/* Sold Out Frosted Glass Overlay */}
                        {!is_available && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="bg-black/30 backdrop-blur-md px-6 py-2 rounded-2xl border border-white/20">
                                    <span className="text-white font-bold text-sm tracking-widest uppercase">Stok Habis</span>
                                </div>
                            </div>
                        )}

                        {/* Bottom Layer - Content */}
                        <div className="relative z-10 p-5 md:p-6 text-white w-full">
                            <div className={`flex flex-col ${isLarge ? "gap-1.5" : "gap-1"}`}>
                                <p className={`text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5 drop-shadow-md
                                    ${is_available ? "text-[var(--product-primary-color)]" : "text-slate-300"}`}>
                                    {p.category}
                                </p>

                                <h3 className={`font-extrabold leading-tight tracking-tight drop-shadow-lg line-clamp-2
                                    ${isLarge ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}>
                                    {p.name}
                                </h3>

                                <div className={`flex items-end gap-3 mt-1 ${isLarge ? "mt-2" : ""}`}>
                                    <p className={`font-black drop-shadow-lg tracking-tight
                                        ${isLarge ? "text-2xl md:text-3xl" : "text-xl"} 
                                        ${is_available ? "text-white" : "text-slate-300 line-through"}`}>
                                        {formatIDR(finalPrice)}
                                    </p>

                                    {isLarge && label && is_available && (
                                        <span className="text-sm line-through opacity-70 font-medium drop-shadow-md pb-0.5">
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Modal - Modern Reversed Flow (Scroll Fixed) */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null);
                    setSelectedVariant(null);
                    setQuantity(1);
                }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col md:flex-row-reverse min-h-full 
                    ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>

                    {/* Visual Section - Sticky on Desktop, naturally on top for Mobile */}
                    <div className={`w-full md:w-[45%] h-[40vh] md:h-auto md:min-h-screen md:sticky md:top-0 shrink-0 relative overflow-hidden
                        ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>

                        {/* Kondisi Gambar Modal */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="absolute inset-0 w-full h-full object-cover"
                                alt={product?.name}
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        )}
                    </div>

                    {/* Content Section - Flows natively, scrollable on Desktop */}
                    <div className={`w-full md:w-[55%] flex flex-col z-10 ${isDarkMode ? "md:border-r border-slate-800" : "md:border-r border-slate-200"}`}>

                        <div className="p-6 md:p-10 flex-grow space-y-8">
                            {/* Product Header */}
                            <div className="space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                        ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                                        {product?.category}
                                    </span>
                                    {product?.discount_price ? (
                                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider">
                                            HEMAT {Promo(product, selectedVariant)}
                                        </span>
                                    ) : ''}
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                                    {product?.name}
                                </h2>
                            </div>

                            {/* Description Box */}
                            <div className={`text-sm leading-relaxed 
                                ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                <ExpandableHTML htmlContent={product?.description} />
                            </div>

                            {/* Quick Stats (Bento Style Info) */}
                            <div className={`grid grid-cols-2 gap-4 py-6 border-y 
                                ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
                                <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <span className={`text-xs font-bold uppercase tracking-wider block mb-2
                                        ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Harga Normal</span>
                                    <div className="text-xl font-black tracking-tight text-[var(--product-primary-color)]">
                                        {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                    </div>
                                    {product?.discount_price ? (
                                        <div className={`text-xs line-through font-medium mt-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                        </div>
                                    ) : ''}
                                </div>
                                {
                                    product?.is_stock &&
                                    <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                        <span className={`text-xs font-bold uppercase tracking-wider block mb-2
                                        ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Ketersediaan</span>
                                        <div className="text-xl font-black tracking-tight flex items-center gap-2">
                                            <Check size={18} className="text-emerald-500" strokeWidth={3} />
                                            {selectedVariant?.product_variant_stock ?? product?.stock} <span className="text-xs font-bold opacity-50">Unit</span>
                                        </div>
                                    </div>
                                }
                            </div>

                            {/* Selectors Area */}
                            <div className="space-y-6">
                                {product?.variants && product?.variants?.length > 0 ? (
                                    <div className="space-y-3">
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Varian Pilihan</p>
                                        <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}

                                {product && product?.is_qty ? (
                                    <div className="space-y-3">
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kuantitas</p>
                                        <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className={`p-6 md:p-10 pt-6 mt-auto border-t flex flex-col gap-4
                            ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-white"}`}>

                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Total Pesanan
                                </span>
                                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    {formatIDR((selectedVariant?.final_price || (product?.final_price ?? 0)) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={() => addCart()}
                                className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                                    ${isDarkMode
                                        ? "bg-white text-slate-900 hover:bg-[var(--product-primary-color)] hover:text-white"
                                        : "bg-[var(--product-primary-color)] text-white hover:opacity-90"}`}
                            >
                                <ShieldCheck size={18} strokeWidth={2.5} /> Konfirmasi Pesanan
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
}

export default Ten;