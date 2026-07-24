"use client"
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, X, Sparkles, ChevronRight } from 'lucide-react';
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
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    
    const [mounted, setMounted] = useState(false);
    const [isPrimaryLight, setIsPrimaryLight] = useState(false);

    // 🎨 YIQ COLOR DETECTOR (Diperketat)
    useEffect(() => {
        setMounted(true);
        const checkPrimaryColor = () => {
            if (typeof document !== 'undefined') {
                const rootStyle = getComputedStyle(document.documentElement);
                const primaryColor = rootStyle.getPropertyValue('--product-primary-color').trim();
                
                if (primaryColor) {
                    let r = 0, g = 0, b = 0;
                    if (primaryColor.startsWith('#')) {
                        const hex = primaryColor.replace('#', '');
                        r = parseInt(hex.substring(0, 2), 16) || 0;
                        g = parseInt(hex.substring(2, 4), 16) || 0;
                        b = parseInt(hex.substring(4, 6), 16) || 0;
                    } else if (primaryColor.startsWith('rgb')) {
                        const match = primaryColor.match(/\d+/g);
                        if (match && match.length >= 3) {
                            r = parseInt(match[0], 10);
                            g = parseInt(match[1], 10);
                            b = parseInt(match[2], 10);
                        }
                    }
                    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
                    setIsPrimaryLight(yiq >= 128);
                }
            }
        };
        setTimeout(checkPrimaryColor, 50);
    }, []);

    // 🛡️ ANTI-NABRAK LOGIC (Clash Detector)
    const isClashingLight = !isDarkMode && isPrimaryLight;
    const isClashingDark = isDarkMode && !isPrimaryLight;
    
    // Border fallback kalau background tombol nabrak sama background layar
    const clashBorderClass = isClashingLight ? 'border border-slate-200' : isClashingDark ? 'border border-slate-700' : 'border border-transparent';
    // Teks harga fallback kalau warna utama nabrak sama background layar
    const priceTextColor = isClashingLight ? 'text-slate-900' : isClashingDark ? 'text-white' : 'text-[var(--product-primary-color)]';
    // Teks tombol otomatis kontras hitam/putih
    const buttonTextColor = isPrimaryLight ? 'text-slate-900' : 'text-white';

    const disableButton = useMemo(() => {
        if (!product) return true;
        if (product?.variants && product.variants.length > 0 && !selectedVariant) return true;
        
        if (product.is_stock !== false) {
            if (selectedVariant) {
                if ((selectedVariant.product_variant_stock ?? 0) < 1) return true;
            } else {
                if ((product.product_stock ?? 0) < 1) return true;
            }
        }
        return false;
    }, [product, selectedVariant]);

    useEffect(() => {
        document.body.style.overflow = product ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [product]);

    const closeModal = () => {
        setProduct(null);
        setSelectedVariant(null);
        setQuantity(1);
    }

    const addCart = () => {
        if (handleCart) handleCart(product, selectedVariant, quantity);
        closeModal();
    };

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity])

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-8'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`group relative flex flex-col p-2.5 sm:p-3 transition-all duration-500 rounded-[2rem] 
                            ${isDarkMode ? 'bg-[#1a1a1c] hover:bg-[#222225]' : 'bg-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)] border border-slate-100'}
                            ${!is_available ? 'opacity-60 grayscale-[0.3] cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <div className={`relative aspect-square overflow-hidden rounded-[1.5rem] transition-all duration-500
                            ${isDarkMode ? "bg-[#0f0f11]" : "bg-slate-50"}`}>
                            
                            {label && is_available && (
                                <div className={`absolute top-3 left-3 z-20 px-3 py-1.5 text-[10px] font-bold tracking-wide rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md
                                    ${isDarkMode ? 'bg-black/50 text-white border border-white/10' : 'bg-white/70 text-slate-900 border border-black/5'}`}>
                                    <Sparkles size={12} className={priceTextColor} />
                                    <span>{label}</span>
                                </div>
                            )}

                            {!p?.image ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ease-out ${is_available ? "group-hover:scale-105" : ""}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-full object-cover transition-transform duration-700 ease-out
                                        ${is_available ? "group-hover:scale-105" : ""}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 ease-out ${is_available ? "group-hover:scale-105" : ""}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {!is_available && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                    <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wider">
                                        Habis
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col mt-4 px-2 pb-2">
                            <span className={`text-[10px] font-semibold tracking-wider uppercase mb-1
                                ${isDarkMode ? "text-slate-100" : "text-slate-400"}`}>
                                {p.category}
                            </span>
                            
                            <h3 className={`font-bold text-sm sm:text-base leading-tight line-clamp-2 mb-4
                                ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                                {p.name}
                            </h3>

                            <div className="mt-auto flex items-end justify-between">
                                <div className="flex flex-col">
                                    {label && is_available && (
                                        <p className={`text-[10px] font-medium line-through mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                            {formatIDR(p.price)}
                                        </p>
                                    )}
                                    <p className={`text-base sm:text-lg font-black tracking-tight ${priceTextColor}`}>
                                        {formatIDR(finalPrice)}
                                    </p>
                                </div>
                                
                                {is_available && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                        ${isDarkMode ? 'bg-slate-800 text-white group-hover:bg-slate-700' : 'bg-slate-100 text-slate-900 group-hover:bg-slate-200'}`}>
                                        <ChevronRight size={16} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* MODAL PORTAL */}
            {mounted && product && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-2 sm:p-6 lg:p-8 animate-in fade-in duration-300">
                    
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-md cursor-pointer transition-opacity" onClick={closeModal} />

                    <div className={`relative w-full md:max-w-5xl h-[92vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-500
                        ${isDarkMode ? 'bg-[#151517] border border-white/5' : 'bg-white border border-slate-100'}`}>
                        
                        <button onClick={closeModal} className={`absolute top-5 right-5 z-[100] p-2.5 rounded-full backdrop-blur-xl transition-transform active:scale-90
                            ${isDarkMode ? 'bg-black/40 text-white hover:bg-black/60 border border-white/10' : 'bg-white/60 text-slate-900 hover:bg-white/90 border border-black/5 shadow-sm'}`}>
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* LEFT: Image */}
                        <div className={`w-full md:w-[45%] h-[40vh] md:h-full relative shrink-0 p-4 md:p-8 
                            ${isDarkMode ? "bg-[#0f0f11]" : "bg-slate-50"}`}>
                            
                            <div className={`w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner
                                ${isDarkMode ? "bg-[#1a1a1c]" : "bg-white"}`}>
                                {!(selectedVariant?.image ?? product?.image) ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon icon="mynaui:image" className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                    </div>
                                ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                    <img
                                        src={selectedVariant?.image ?? product?.image}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt={product?.name}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon icon={selectedVariant?.image ?? product?.image ?? 'mynaui:image'} className={`w-32 h-32 opacity-20 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Content */}
                        <div className={`w-full overflow-auto md:w-[55%] flex flex-col h-full z-10 
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            
                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 sm:p-8 lg:p-10 pb-50 md:pb-10">
                                
                                {/* 🛠️ BUG FIXED: Badge kategori sekarang aman dari bentrok/hilang karena Hex color */}
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-[10px] font-bold tracking-widest uppercase border
                                    ${isDarkMode ? "bg-white/5 border-white/10 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                    <Sparkles size={12} className={priceTextColor} />
                                    <span>{product?.category}</span>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6">
                                    {product?.name}
                                </h2>

                                <div className="md:flex flex-col gap-1 mb-8">
                                    <div className="md:flex items-end gap-3">
                                        <p className={`text-4xl md:text-5xl font-black tracking-tighter ${priceTextColor}`}>
                                            {formatIDR(selectedVariant?.final_price ?? product?.final_price ?? 0)}
                                        </p>
                                        {product?.discount_price ? (
                                            <span className={`text-sm font-semibold line-through mb-1.5
                                                ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                                                {formatIDR(selectedVariant?.price ?? product?.price ?? 0)}
                                            </span>
                                        ) : null}
                                    </div>
                                </div>

                                {/* Deskripsi Aman */}
                                {product?.description ? (
                                    <div className="mb-8">
                                        <ExpandableHTML
                                            htmlContent={product.description}
                                            className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}
                                        />
                                    </div>
                                ) : null}

                                <div className={`py-6 space-y-8 border-t ${isDarkMode ? "border-white/5" : "border-black/5"}`}>
                                    
                                    {/* Varian Aman */}
                                    {product?.variants && product.variants.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[11px] font-bold uppercase tracking-wider
                                                    ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Pilih Varian</span>
                                            </div>
                                            <VariantPicker isStock={product?.is_stock} variants={product.variants} selectedVariant={selectedVariant} setSelectedVariant={setSelectedVariant} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}

                                    {/* Qty Aman */}
                                    {product?.is_qty ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[11px] font-bold uppercase tracking-wider
                                                    ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Jumlah</span>
                                                {product?.is_stock !== false && (
                                                    <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        Sisa stok: {selectedVariant?.product_variant_stock ?? product?.product_stock}
                                                    </span>
                                                )}
                                            </div>
                                            <QtySelector quantity={quantity} product={product} selectedVariant={selectedVariant} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Sticky Action Modal */}
                            <div className={`absolute md:relative bottom-0 left-0 right-0 p-6 md:p-8 shrink-0 backdrop-blur-xl border-t 
                                ${isDarkMode ? "border-white/5 bg-[#151517]/80" : "border-black/5 bg-white/80"}`}>
                                
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`text-sm font-semibold
                                        ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Total Pembayaran</span>
                                    <span className={`text-2xl font-black ${priceTextColor}`}>
                                        {formatIDR((selectedVariant?.final_price || (product?.final_price ?? 0)) * quantity)}
                                    </span>
                                </div>
                                
                                <button
                                    disabled={disableButton}
                                    onClick={addCart}
                                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                                        bg-[var(--product-primary-color)] ${buttonTextColor} ${clashBorderClass}`}
                                >
                                    <ShoppingBag size={18} strokeWidth={2.5} />
                                    {product.is_stock !== false && ((selectedVariant ? selectedVariant.product_variant_stock : product.product_stock) ?? 0) < 1
                                        ? 'STOK HABIS' 
                                        : 'MASUKKAN KERANJANG'}
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Six;