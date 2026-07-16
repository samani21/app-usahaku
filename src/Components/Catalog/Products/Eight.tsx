"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { ShoppingBag, X, ChevronRight, Zap, ArrowRight, Info, ArrowUpRight } from 'lucide-react';
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

const Eight = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [productAlert, setProductAlert] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
    }, [product, selectedVariant]);

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
        <div>
            {/* Interactive Soft Bento Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 md:p-8'>
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
                            className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ease-out border shadow-sm
                                ${is_available
                                    ? "cursor-pointer hover:-translate-y-1 " + (isDarkMode
                                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-2xl'
                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl')
                                    : "cursor-not-allowed opacity-75 " + (isDarkMode ? 'bg-slate-900/50 border-slate-800/50' : 'bg-slate-50 border-slate-200')
                                }`}
                        >
                            {/* Image Canvas */}
                            <div className={`relative aspect-[4/5] overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>

                                {/* Kondisi Gambar Card */}
                                {!p?.image ? (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}>
                                        <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                ) : p.image.startsWith('https') ? (
                                    <img
                                        src={p.image}
                                        className={`w-full h-full object-cover transition-transform duration-500 ease-in-out
                                            ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}
                                        alt={p?.name}
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ease-in-out ${is_available ? "group-hover:scale-105" : "grayscale opacity-80"}`}>
                                        <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                    </div>
                                )}

                                {/* Floating Action Header */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                    {label && is_available ? (
                                        <div className="bg-[var(--product-primary-color)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                                            {label}
                                        </div>
                                    ) : !is_available ? (
                                        <div className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                                            Habis
                                        </div>
                                    ) : <div />}

                                    {is_available && (
                                        <div className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-md backdrop-blur-sm
                                            ${isDarkMode
                                                ? 'bg-white/10 text-white group-hover:bg-[var(--product-primary-color)] group-hover:text-white'
                                                : 'bg-white/80 text-slate-900 group-hover:bg-[var(--product-primary-color)] group-hover:text-white'}`}>
                                            <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none transition-opacity duration-300
                                    ${isDarkMode ? 'from-slate-900 via-slate-900/40 to-transparent' : 'from-black/70 via-black/20 to-transparent'}
                                    ${is_available ? "opacity-80 group-hover:opacity-100" : "opacity-90"}`}
                                />

                                {/* Info overlaid on image */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col z-10">
                                    <span className={`text-xs font-semibold tracking-wider mb-1
                                        ${is_available ? "text-[var(--product-primary-color)]" : "text-slate-400"}`}>
                                        {p.category}
                                    </span>

                                    <h3 className="text-lg font-bold leading-tight line-clamp-2 text-white mb-2">
                                        {p.name}
                                    </h3>

                                    <div className="flex items-end justify-between pt-2">
                                        <div className="flex flex-col">
                                            {label && is_available && (
                                                <span className="text-xs line-through opacity-75 font-medium text-white mb-0.5">
                                                    {formatIDR(p.price)}
                                                </span>
                                            )}
                                            <span className={`text-xl font-extrabold tracking-tight 
                                                ${is_available ? "text-white" : "text-slate-400"}`}>
                                                {formatIDR(finalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            <ModalWrapper
                activeModal={!!product}
                closeModal={() => { setProduct(null); setSelectedVariant(null); setQuantity(1); }}
                isDarkMode={isDarkMode}
            >
                <div className={`w-full flex flex-col lg:flex-row min-h-full overflow-hidden shadow-2xl 
                    ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>

                    {/* Media Section */}
                    <div className={`w-full lg:w-[45%] h-[40vh] lg:h-auto lg:min-h-screen relative shrink-0 flex items-center justify-center
                        ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>

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
                    </div>

                    {/* Controls Section */}
                    <div className={`w-full lg:w-[55%] flex flex-col z-10 ${isDarkMode ? "lg:border-l border-slate-800" : "lg:border-l border-slate-200"}`}>
                        <div className="p-6 md:p-10 flex-grow space-y-8">

                            {/* Header */}
                            <div className="space-y-3">
                                <span className={`text-xs font-bold uppercase tracking-widest ${isDarkMode ? 'text-[var(--product-primary-color)]' : 'text-[var(--product-primary-color)]'}`}>
                                    {product?.category}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                                    {product?.name}
                                </h2>
                            </div>

                            {/* Price Block */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl md:text-4xl font-black text-[var(--product-primary-color)] tracking-tighter">
                                        {formatIDR(selectedVariant?.final_price || product?.final_price || 0)}
                                    </span>
                                    {product?.discount_price ? (
                                        <span className={`text-lg font-semibold line-through ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {formatIDR(selectedVariant?.price || product?.price || 0)}
                                        </span>
                                    ) : ''}
                                </div>
                            </div>

                            {/* Description */}
                            <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <ExpandableHTML htmlContent={product?.description} />
                            </div>

                            {/* Interactive Selectors */}
                            <div className={`pt-6 space-y-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                {product?.variants && product?.variants?.length > 0 && (
                                    <div className="space-y-3">
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Pilih Variasi</p>
                                        <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                    </div>
                                )}

                                {product?.is_qty ? (
                                    <div className="space-y-3">
                                        <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kuantitas</p>
                                        <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>

                        {/* Sticky Bottom Summary */}
                        <div className={`p-6 md:p-10 pt-6 mt-auto border-t flex flex-col gap-4 ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"}`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Total</span>
                                <span className="text-2xl font-black tracking-tighter">
                                    {formatIDR((selectedVariant?.final_price || product?.final_price || 0) * quantity)}
                                </span>
                            </div>

                            <button
                                disabled={disableButton}
                                onClick={addCart}
                                className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                    ${isDarkMode
                                        ? 'bg-white text-slate-900 hover:bg-[var(--product-primary-color)] hover:text-white'
                                        : 'bg-slate-900 text-white hover:bg-[var(--product-primary-color)]'}`}
                            >
                                <ShoppingBag size={18} strokeWidth={2.5} /> Masukkan Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
        </div>
    );
};

export default Eight;