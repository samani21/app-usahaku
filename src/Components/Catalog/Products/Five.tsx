"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingCart, X, Plus, Info } from 'lucide-react';
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

const Five = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
    }, [product, selectedVariant]);

    const mockItem = useMemo(() => ({
        name: productAlert?.name,
        image: productAlert?.image,
    }), [productAlert])

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
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 py-4 sm:py-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                // Efek Grid Staggered (Naik Turun)
                const staggerClass = i % 2 === 0 ? 'md:translate-y-6' : 'md:-translate-y-6';

                return (
                    <div
                        key={i}
                        onClick={() => {
                            if (is_available) {
                                setProduct(p);
                                setProductAlert(p);
                            }
                        }}
                        className={`group relative flex flex-col transition-all duration-700 ease-out p-3.5 sm:p-5 rounded-[1.5rem] 
                            ${is_available ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2' : 'cursor-not-allowed opacity-80'}
                            ${staggerClass}
                            ${isDarkMode ? 'bg-slate-900 shadow-black/40 border border-slate-800' : 'bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] border border-slate-100'}`}
                    >
                        {/* 1. Image Frame (Polaroid Aesthetic) */}
                        <div className={`relative aspect-[3/4] mb-6 overflow-hidden rounded-xl transition-all duration-500
                            ${!is_available ? 'opacity-80' : ''}
                            ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-110' : 'grayscale sepia-[0.3]'}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-out
                                        ${is_available ? 'group-hover:scale-110' : 'grayscale sepia-[0.3]'}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1.5s] ease-out ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${is_available ? 'group-hover:scale-110' : 'grayscale sepia-[0.3]'}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                </div>
                            )}

                            {/* Hover Action Overlay */}
                            <div className={`absolute inset-0 transition-all duration-500 flex items-center justify-center
                                ${is_available ? 'bg-black/0 group-hover:bg-black/30 backdrop-blur-[0px] group-hover:backdrop-blur-[2px]' : 'bg-slate-900/40 backdrop-blur-[1px]'}`}>

                                {is_available ? (
                                    <div className="w-14 h-14 rounded-full bg-white/90 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out flex items-center justify-center text-slate-900 shadow-xl">
                                        <Plus size={24} strokeWidth={2} />
                                    </div>
                                ) : (
                                    <span className={`font-serif italic text-sm tracking-[0.2em] px-5 py-2.5 rounded-sm border shadow-lg
                                        ${isDarkMode ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-900'}`}>
                                        Sold Out
                                    </span>
                                )}
                            </div>

                            {/* Minimalist Discount Badge */}
                            {label && is_available && (
                                <div className="absolute top-3 left-3 bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-md rounded-sm">
                                    {label}
                                </div>
                            )}
                        </div>

                        {/* 2. Text Content (Editorial Typography) */}
                        <div className="flex flex-col items-center text-center px-2 pb-2">
                            <span className={`text-[9px] font-bold uppercase tracking-[0.3em] mb-3 
                                ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {p.category}
                            </span>

                            <h3 className={`font-serif text-lg md:text-xl italic font-medium leading-snug mb-4 line-clamp-2 transition-colors duration-300
                                ${is_available
                                    ? isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-800 group-hover:text-slate-950'
                                    : isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                {p.name}
                            </h3>

                            <div className="mt-auto flex flex-col items-center gap-1.5">
                                <div className="h-4">
                                    {label && is_available && (
                                        <span className={`text-[11px] line-through font-medium tracking-wide
                                            ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {formatIDR(p.price)}
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm md:text-base font-black tracking-widest uppercase
                                    ${!is_available
                                        ? isDarkMode ? 'text-slate-600' : 'text-slate-400'
                                        : 'text-[var(--product-primary-color)]'}`}>
                                    {is_available ? formatIDR(finalPrice) : 'Unavailable'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. Modal Experience (Immersive Editorial Layout) */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => {
                    setProduct(null);
                    setSelectedVariant(null);
                    setQuantity(1);
                }}
                isDarkMode={isDarkMode}
            >
                <div className={`flex flex-col w-full h-full md:h-auto md:max-h-[85vh] overflow-y-auto no-scrollbar relative
                    ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>

                    {/* Hero Image Overlay Layout */}
                    <div className="relative w-full h-[45vh] md:h-[55vh] flex-shrink-0">
                        {/* Kondisi Gambar Modal */}
                        {!(selectedVariant?.image ?? product?.image) ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                            <img
                                src={selectedVariant?.image ?? product?.image}
                                className="w-full h-full object-cover"
                                alt={product?.name}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            </div>
                        )}

                        {/* Gradient penutup bawah agar lebih smooth menyatu dengan konten */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Overlapping Content Section */}
                    <div className={`relative -mt-16 md:-mt-24 z-10 mx-4 md:mx-12 mb-8 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 shadow-2xl flex flex-col items-center
                        ${isDarkMode ? "bg-slate-900/95 border border-slate-800" : "bg-white/95 border border-slate-100"} backdrop-blur-xl`}>

                        {/* Badge Category & Stock */}
                        <div className={`mb-8 px-4 py-2 rounded-full border flex items-center gap-3 shadow-sm
                            ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                            <div className="bg-[var(--product-primary-color)] text-white p-1.5 rounded-full">
                                <Info size={14} strokeWidth={2.5} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                                {product?.category} <span className="opacity-40 px-1">•</span> {product?.stock} In Stock
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl italic text-center leading-tight mb-8 max-w-3xl
                            ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            {product?.name}
                        </h2>

                        {/* Description */}
                        <div className="w-full max-w-2xl mb-12">
                            <ExpandableHTML
                                htmlContent={product?.description}
                                className={`text-center text-sm md:text-base leading-relaxed font-medium 
                                    ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
                            />
                        </div>

                        {/* Interactive Selections */}
                        <div className={`w-full max-w-2xl flex flex-col gap-10 py-10 border-y 
                            ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>

                            {product?.variants && product?.variants?.length > 0 ? (
                                <div className="flex flex-col items-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                        Pilih Edisi Varian
                                    </span>
                                    <VariantPicker isStock={product?.is_stock} variants={product?.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}

                            {product?.is_qty ? (
                                <div className="flex flex-col items-center">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                        Tentukan Jumlah
                                    </span>
                                    <QtySelector product={product} selectedVariant={selectedVariant} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                </div>
                            ) : ''}
                        </div>

                        {/* Total & Call to Action */}
                        <div className="w-full max-w-md flex flex-col items-center pt-10">
                            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                Total Keseluruhan
                            </p>

                            <div className="flex flex-col items-center mb-8">
                                {product?.discount_price ? (
                                    <span className={`text-sm line-through font-bold mb-1 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`}>
                                        {formatIDR((selectedVariant?.price ?? product?.price ?? 0) * quantity)}
                                    </span>
                                ) : ''}
                                <span className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--product-primary-color)]">
                                    {formatIDR((selectedVariant?.final_price ?? product?.final_price ?? 0) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full relative py-5 rounded-full overflow-hidden transition-all duration-300 active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed
                                    ${isDarkMode
                                        ? "bg-white text-slate-900 hover:bg-[var(--product-primary-color)] hover:text-white"
                                        : "bg-slate-900 text-white hover:bg-[var(--product-primary-color)] shadow-[0_15px_30px_rgba(0,0,0,0.15)]"}`}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3 font-bold uppercase text-xs tracking-[0.2em]">
                                    <ShoppingCart size={18} strokeWidth={2.5} /> Tambah Ke Tas
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    )
}

export default Five;