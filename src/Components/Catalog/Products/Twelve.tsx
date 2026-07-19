"use client"
import ModalWrapper from './ModalWrapper';
import { useEffect, useMemo, useState } from 'react';
import QtySelector from './QtySelector';
import VariantPicker from './VariantPicker';
import { Check, Clock, Plus, ShoppingCart, Tag, Zap } from 'lucide-react';
import AlertWrapper from './AlertWrapper';
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

const Twelve = ({ products, isDarkMode, handleCart }: Props) => {
    const [product, setProduct] = useState<ProductsType | null>(null);
    const [selectedVariant, setSelectedVariant] = useState<Variants | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const disableButton = useMemo(() => {
        if (!product) return true;
        return product?.variants?.length > 0 && !selectedVariant;
    }, [product, selectedVariant]);

    useEffect(() => {
        if (product) {
            // Jika modal aktif (product tidak null), kunci scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Jika modal tutup, kembalikan scroll
            document.body.style.overflow = 'unset';
        }

        // Cleanup function untuk memastikan scroll kembali normal jika komponen unmount
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
    const discountPercent = Math.round((currentDiscount / currentPrice) * 100);

    useEffect(() => {
        if (selectedVariant?.product_variant_stock && selectedVariant?.product_variant_stock < quantity) {
            setQuantity(selectedVariant?.product_variant_stock);
        }
    }, [selectedVariant, quantity])

    return (
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  h-full'>
            {products?.map((p, i) => {
                const { finalPrice, label } = getPromoDetails(p);
                const is_available = p?.is_stock === false ? true : (p?.product_stock ?? 0) > 0;

                return (
                    <div
                        key={i}
                        onClick={() => is_available && setProduct(p)}
                        className={`relative h-80 group flex items-center justify-center transition-all ${is_available ? "cursor-pointer" : "cursor-not-allowed"
                            }`}
                    >
                        {/* Layer Dekoratif Belakang */}
                        <div className={`absolute inset-10 rounded-[2.5rem] rotate-12 transition-all duration-500 
                ${is_available
                                ? "bg-rose-400 opacity-20 group-hover:rotate-0"
                                : "bg-slate-300 opacity-10 rotate-0"}`}
                        />
                        <div className={`absolute inset-10 rounded-[2.5rem] -rotate-6 transition-all duration-500 
                ${is_available
                                ? "bg-indigo-400 opacity-20 group-hover:rotate-0"
                                : "bg-slate-400 opacity-10 rotate-0"}`}
                        />

                        {/* Kartu Utama */}
                        <div className={`relative w-[85%] sm:w-48 h-64 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 
                ${is_available ? "group-hover:-translate-y-8" : "grayscale opacity-80"} 
                ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>

                            {/* Badge Status (Promo atau Sold Out) */}
                            {is_available ? (
                                label && (
                                    <div className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg">
                                        {label}
                                    </div>
                                )
                            ) : (
                                <div className="absolute top-3 left-3 z-10 bg-slate-700 text-white text-[9px] font-black px-2 py-0.5 rounded-lg">
                                    SOLD OUT
                                </div>
                            )}

                            {/* Kondisi Gambar Card */}
                            {!p?.image ? (
                                <div className={`w-full h-3/5 flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${!is_available ? "opacity-50" : ""}`}>
                                    <Icon icon="mynaui:image" className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            ) : p.image.startsWith('https') ? (
                                <img
                                    src={p.image}
                                    className={`w-full h-3/5 object-cover ${!is_available ? "opacity-50" : ""}`}
                                    alt={p.name}
                                />
                            ) : (
                                <div className={`w-full h-3/5 flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} ${!is_available ? "opacity-50" : ""}`}>
                                    <Icon icon={p.image} className={`w-16 h-16 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            <div className="p-4 text-center">
                                <div className={!is_available ? "opacity-40" : ""}>
                                    {p.category ? (
                                        <span className="text-[10px] font-black uppercase opacity-40 block mb-0.5">{p.category}</span>
                                    ) : ''}
                                    <h3 className="font-bold text-sm truncate uppercase italic tracking-tight mb-1">{p.name}</h3>
                                </div>

                                <div className="flex flex-col items-center">
                                    {is_available ? (
                                        <>
                                            {label && (
                                                <span className="text-[9px] line-through opacity-30 font-bold -mb-1">
                                                    {formatIDR(p.price)}
                                                </span>
                                            )}
                                            <p className="font-black text-base text-[var(--product-primary-color)] drop-shadow-sm">
                                                {formatIDR(finalPrice)}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="font-black text-sm text-slate-500 italic mt-1">
                                            Tidak Tersedia
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            <ModalWrapper
                activeModal={product ? true : false}
                closeModal={() => {
                    setProduct(null)
                    setSelectedVariant(null)
                    setQuantity(1)
                }}
                isDarkMode={isDarkMode}>
                <div className="w-full p-6 sm:p-14 flex flex-col gap-10 overflow-auto overflow-x-hidden no-scrollbar">
                    <div className={`flex flex-col sm:flex-row justify-between sm:items-center pb-8 border-b ${isDarkMode ? "border-slate-800" : "border-slate-200"} gap-4`}>
                        <div className="space-y-1">
                            <h2 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase leading-none">{product?.name}</h2>
                            {product?.category && <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 italic">{product?.category}</p>}
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-black text-[var(--product-primary-color)] italic tracking-tighter">
                                    {formatIDR(currentFinalPrice)}
                                </span>
                                {currentDiscount > 0 ? (
                                    <div className="flex items-center sm:justify-end gap-2">
                                        <span className="text-md sm:text-xl font-bold opacity-30 line-through italic">{formatIDR(currentPrice)}</span>
                                        <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-1 rounded-lg">-{discountPercent}%</span>
                                    </div>
                                ) : ''}
                            </div>
                        </div>
                    </div>

                    {/* Konten: Gambar & Deskripsi */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                        {/* Kolom Gambar */}
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group aspect-[4/3] md:aspect-video lg:aspect-square">
                            {/* Kondisi Gambar Modal */}
                            {!(selectedVariant?.image ?? product?.image) ? (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Icon icon="mynaui:image" className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            ) : (selectedVariant?.image ?? product?.image ?? '').startsWith('https') ? (
                                <img
                                    src={selectedVariant?.image ?? product?.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt=""
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Icon icon={selectedVariant?.image ?? product?.image??'mynaui:image'} className={`w-32 h-32 opacity-30 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                </div>
                            )}

                            {currentDiscount > 0 ? (
                                <div className="absolute top-6 text-[10px] left-6 bg-rose-600 text-white px-5 py-2 rounded-2xl font-black italic shadow-xl flex items-center gap-2">
                                    <Tag size={16} /> HEMAT {formatIDR(currentDiscount)}
                                </div>
                            ) : ''}
                        </div>

                        {/* Kolom Deskripsi */}
                        <div className="space-y-8">
                            {product?.description ? (
                                <div className={`p-8 rounded-[2.5rem] ${isDarkMode ? "bg-slate-800/50 border border-white/5" : "bg-slate-50 border border-black/5"} space-y-4`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                                            <Tag size={18} />
                                        </div>
                                        <h4 className="font-black text-xs uppercase tracking-widest opacity-40 italic">Informasi Produk</h4>
                                    </div>
                                    <ExpandableHTML
                                        htmlContent={product?.description}
                                        className="text-sm md:text-base leading-relaxed opacity-60 italic font-medium"
                                    // maxHeight='max-h-[120px]'
                                    />
                                </div>
                            ) : ''}
                            {/* Kontrol: Varian, Qty, Total */}
                            <div className={`p-8 rounded-[2.5rem] border ${isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white shadow-sm"} space-y-8`}>
                                {product?.variants && product?.variants?.length > 0 ? (
                                    <VariantPicker
                                        isStock={product?.is_stock}
                                        variants={product?.variants}
                                        selectedVariant={selectedVariant}
                                        setSelectedVariant={setSelectedVariant}
                                        isDarkMode={isDarkMode}
                                    />
                                ) : <div></div>}

                                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                                    {product?.is_qty ? (
                                        <QtySelector selectedVariant={selectedVariant} product={product} quantity={quantity} setQuantity={setQuantity} isDarkMode={isDarkMode} />
                                    ) : <div></div>}
                                    <div className="text-left sm:text-right">
                                        <p className={`text-[10px] font-black uppercase opacity-40 tracking-widest mb-1 ${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>Subtotal</p>
                                        <p className="text-2xl font-black italic tracking-tighter">
                                            {formatIDR(currentFinalPrice * quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <button
                                disabled={disableButton}
                                onClick={() => addCart()}
                                className="w-full py-6 md:py-8 bg-[var(--product-primary-color)] text-white rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-sm md:text-base shadow-2xl shadow-[var(--product-primary-color)]/20 hover:scale-[1.02] transition-all active:scale-95 disabled:bg-gray-600 flex items-center justify-center gap-4"
                            >
                                Pesan Sekarang
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes timer {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />

        </div>
    )
}

export default Twelve