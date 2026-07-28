"use client"

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Image as ImageIcon,
    Film,
    Store,
    MoreHorizontal,
    ShoppingBag,
    Tag,
    Megaphone,
    Check,
    UploadCloud,
    Search,
    Zap,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import MainLayout from '@/Components/Layout/MainLayout';
import { Post } from '@/utils/Post';
import Alert from '@/Components/Alert';
import { AlertType } from '@/types/Alert';
import { Get } from '@/utils/Get';
import { PostsType, ProductsType, PromosType } from './type';
import { formatImage } from '@/utils/formatImage';
import { formatIDR } from '@/types/FormtRupiah';
import { BusinessType } from '@/types/Admin/BusinessType';
import Loading from '@/Components/Loading';
import { Icon } from '@iconify/react';

type Props = {
    onClose: () => void;
    editPost: PostsType | null;
}

const CreateOrUpdatePostView = ({ onClose, editPost }: Props) => {
    const [loading, setLoading] = useState<boolean>(true);

    // --- State Form ---
    const [postType, setPostType] = useState<'promo' | 'informasi'>('promo');
    const [caption, setCaption] = useState('');

    // Media State 
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [activePromoId, setActivePromoId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- State Submit & Alert ---
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [products, setProducts] = useState<ProductsType[]>([]);
    const [promos, setPromos] = useState<PromosType[]>([]);
    const [business, setBusiness] = useState<BusinessType | null>(null);

    useEffect(() => {
        if (editPost) {
            setPostType(editPost?.is_promo ? "promo" : "informasi");
            setCaption(editPost?.caption || '');

            if (editPost?.media_type) {
                setMediaType(editPost?.media_type as 'image' | 'video');
            }
            if (editPost?.media) {
                setMediaPreview(formatImage(editPost?.media) ?? null)
            }
            if (editPost?.products?.length > 0) {
                const productsId = editPost.products.map((p) => p.id);
                setSelectedProducts(productsId);
            }
        }
    }, [editPost]);

    useEffect(() => {
        getPromo();
    }, []);

    const getPromo = async () => {
        try {
            const res = await Get<{ success: boolean, data: { products: ProductsType[], promos: PromosType[], business: BusinessType } }>('client/posts/show-products');
            if (res?.success) {
                setProducts(res?.data?.products || []);
                setPromos(res?.data?.promos || []);
                setBusiness(res?.data?.business)
            }
        } catch (e: any) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // --- Handlers Upload Media ---
    const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        // Fallback: Jika user membatalkan pilihan file di dialog windows/mac
        if (!file) return;

        // Validasi Ukuran File (Maksimal 15MB)
        const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB dalam bytes
        if (file.size > MAX_FILE_SIZE) {
            setShowAlert({ type: 'error', message: 'Ukuran file maksimal adalah 15MB!', isOpen: true });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Mencegah memory leak dari object URL lama
        if (mediaPreview && !mediaPreview.startsWith('http')) {
            URL.revokeObjectURL(mediaPreview);
        }

        setMediaFile(file);
        setMediaPreview(URL.createObjectURL(file));
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
    };

    const toggleProduct = (productId: number) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
        setActivePromoId(null);
    };

    const handleApplyPromo = (promo: typeof promos[0]) => {
        if (activePromoId === promo.id) {
            setActivePromoId(null);
            setSelectedProducts([]);
            setCaption('');
        } else {
            setActivePromoId(promo.id);
            setSelectedProducts(promo.products);
            setCaption(promo.name_promo);
        }
    };

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    // --- Filter Produk ---
    const filteredProducts = useMemo(() => {
        if (searchQuery != '') {
            return products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return products;
    }, [products, searchQuery]);

    // --- SUBMIT HANDLER ---
    const handleSubmit = async () => {
        if (!caption && !mediaFile && !mediaPreview && selectedProducts.length === 0) {
            setShowAlert({ type: 'error', message: 'Konten postingan tidak boleh kosong!', isOpen: true });
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('type', postType);
            if (caption) formData.append('caption', caption);
            if (mediaFile) formData.append('media', mediaFile);

            if (selectedProducts?.length > 0) {
                selectedProducts.forEach((id, i) => {
                    formData.append(`product_ids[${i}]`, id.toString());
                });
            }
            const url = editPost ? `client/posts/${editPost?.id}` : "client/posts";
            const res = await Post(url, formData);

            if (res) {
                onClose();
            }
        } catch (e: any) {
            setShowAlert({ type: 'error', message: 'Gagal menerbitkan postingan: ' + e.message, isOpen: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loading />

    return (
        <MainLayout>
            <div className="w-full animate-in fade-in duration-300 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                {editPost ? "Edit Postingan" : "Buat Postingan Baru"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Buat pengumuman atau promo menarik untuk pelanggan Anda.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- BAGIAN KIRI: FORM EDITOR --- */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col gap-6 h-fit">

                        {/* --- Pilihan Tipe Postingan --- */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2">Tipe Postingan</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setPostType('promo')}
                                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-black text-xs transition-all active:scale-95 ${postType === 'promo' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/50'}`}
                                >
                                    <Tag size={16} /> Promo Produk
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPostType('informasi')}
                                    className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 font-black text-xs transition-all active:scale-95 ${postType === 'informasi' ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm' : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50/50'}`}
                                >
                                    <Megaphone size={16} /> Informasi Biasa
                                </button>
                            </div>
                        </div>

                        {/* Upload Gambar / Video Utama */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2 flex items-center justify-between">
                                <span>Media Utama</span>
                                <span className="text-[9px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Maks 15MB</span>
                            </label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                            >
                                {mediaPreview ? (
                                    <>
                                        {mediaType === 'video' ? (
                                            <video
                                                src={mediaPreview}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-slate-900"
                                                autoPlay muted loop playsInline
                                            />
                                        ) : (
                                            <img
                                                src={mediaPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                            <span className="bg-white px-5 py-2.5 rounded-full text-slate-800 text-xs font-bold flex items-center gap-2 shadow-xl active:scale-95 transition-transform">
                                                <UploadCloud size={16} className="text-emerald-500" /> Ganti Media
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-slate-400 flex flex-col items-center group-hover:text-emerald-500 transition-colors">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ImageIcon size={28} />
                                            <span className="text-slate-300">/</span>
                                            <Film size={28} />
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">Klik untuk upload Gambar/Video</span>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleMediaUpload}
                                accept="image/*,video/*"
                                className="hidden"
                            />
                        </div>

                        {/* Caption Textarea */}
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2">Caption Postingan</label>
                            <textarea
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                rows={5}
                                placeholder={postType === 'promo' ? "Tulis caption promosi yang menarik..." : "Tulis pengumuman atau informasi..."}
                                className="w-full bg-white border border-slate-200 text-sm font-bold text-slate-800 p-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none leading-relaxed custom-scrollbar"
                            />
                        </div>

                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col gap-1 border-t border-slate-100 pt-6">
                                <label className="text-[10px] uppercase tracking-widest font-extrabold text-slate-500 pl-2">Tautkan Produk Promo</label>
                            </div>

                            {/* Shortcut Promo Capsule */}
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-3xl space-y-3">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Zap size={14} className="text-amber-500" />
                                    <p className="text-[11px] font-bold">Shortcut Promo (Pilih Otomatis)</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {promos.map((promo) => (
                                        <button
                                            key={promo.id}
                                            type="button"
                                            onClick={() => handleApplyPromo(promo)}
                                            className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 border ${activePromoId === promo.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'}`}
                                        >
                                            {promo.name_promo}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Kolom Pencarian Produk */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Atau cari & pilih produk manual..."
                                    className="w-full text-xs font-bold text-slate-800 pl-11 pr-4 py-3.5 bg-white border border-slate-200 focus:border-emerald-500 rounded-full outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                                />
                            </div>

                            {/* List Produk */}
                            <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => {
                                        const isSelected = selectedProducts.includes(product.id);
                                        return (
                                            <div
                                                key={product.id}
                                                onClick={() => toggleProduct(product.id)}
                                                className={`group flex items-center justify-between gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-300 ${isSelected ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5'}`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                    <div className={`shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'border-2 border-slate-300 group-hover:border-emerald-400'}`}>
                                                        {isSelected && <Check size={14} strokeWidth={3} />}
                                                    </div>
                                                    {
                                                        product.image?.startsWith('usahaku') ?
                                                            <img src={formatImage(product.image)} alt={product.name} className="shrink-0 w-12 h-12 rounded-xl object-cover border border-slate-100" />
                                                            :
                                                            <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-100">
                                                                <Icon icon={product?.image || 'mynaui:image'} className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform duration-500" />
                                                            </div>
                                                    }
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-black text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                                                            {product.name}
                                                        </h4>
                                                        {product.promo_value && (
                                                            <span className="inline-block mt-0.5 text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-rose-100/50">
                                                                Potongan {product?.promo_type === 'percentage' ? product.promo_value + "%" : formatIDR(product.promo_value)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end shrink-0 pl-2">
                                                    {product?.promo_value && (
                                                        <span className="text-[10px] text-slate-400 line-through font-medium mb-0.5">
                                                            {formatRupiah(product.price)}
                                                        </span>
                                                    )}
                                                    <span className="text-sm font-black text-emerald-600">
                                                        {formatRupiah(product.final_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400">Produk tidak ditemukan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center gap-2 py-4 mt-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black uppercase tracking-widest text-xs rounded-full shadow-xl shadow-slate-900/10 transition-all active:scale-95 hover:-translate-y-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Sedang Memproses...
                                </>
                            ) : (
                                editPost ? "Simpan Perubahan" : "Terbitkan Postingan"
                            )}
                        </button>
                    </div>

                    {/* --- BAGIAN KANAN: LIVE PREVIEW --- */}
                    <div className="flex flex-col">
                        <div className="mb-4">
                            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2 pl-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Preview
                            </h3>
                        </div>

                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden w-full max-w-lg mx-auto">
                            {/* Header Post */}
                            <div className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-3">
                                    {
                                        business?.logo_url ?
                                            <img
                                                src={formatImage(business?.logo_url ?? '')}
                                                alt="Avatar"
                                                className="w-10 h-10 rounded-full object-cover border border-slate-100"
                                            /> : <Store size={24} />
                                    }
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-black text-slate-900 leading-none">{business?.name || "Toko Anda"}</h3>
                                            {postType === 'promo' ? (
                                                <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Promo</span>
                                            ) : (
                                                <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">Info</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1.5 font-bold">
                                            <Store size={12} />
                                            <span>Baru saja</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            {/* Caption */}
                            {caption && (
                                <div className="px-5 pb-4">
                                    <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                                        {caption}
                                    </p>
                                </div>
                            )}
                            {/* Main Media Preview */}
                            {mediaPreview && (
                                <div className="w-full px-2">
                                    {mediaType === 'video' ? (
                                        <video
                                            src={mediaPreview}
                                            controls
                                            playsInline
                                            className="w-full max-h-[400px] object-cover rounded-3xl bg-slate-900"
                                        />
                                    ) : (
                                        <img
                                            src={mediaPreview}
                                            alt="Post media"
                                            className="w-full max-h-[400px] object-cover rounded-3xl"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Tautan Produk Terkait (Promo) */}
                            {selectedProducts.length > 0 && (
                                <div className="mt-4 p-4">
                                    <div className="flex items-center gap-2 mb-3 px-1">
                                        <ShoppingBag size={14} className="text-emerald-500" />
                                        <h4 className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">Produk Terkait</h4>
                                    </div>

                                    <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-1">
                                        {selectedProducts.map(id => {
                                            const product = products.find(p => p.id === id);
                                            if (!product) return null;
                                            return (
                                                <div key={product.id} className="min-w-[140px] max-w-[140px] bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex-shrink-0 relative group">
                                                    {product.promo_value && (
                                                        <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                                                            Promo
                                                        </div>
                                                    )}
                                                    <div className="w-full p-1.5">
                                                        <div className="w-full aspect-[4/3] bg-slate-100 relative rounded-xl overflow-hidden">
                                                            {
                                                                product.image?.startsWith('usahaku') ?
                                                                    <img src={formatImage(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                    : <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                                        <Icon icon={product?.image || 'mynaui:image'} className="w-8 h-8 text-slate-300 group-hover:scale-110 transition-transform duration-500" />
                                                                    </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="px-2.5 pb-3 pt-1">
                                                        <h5 className="text-[12px] font-black text-slate-800 line-clamp-2 leading-tight min-h-[34px]">
                                                            {product.name}
                                                        </h5>
                                                        <div className="mt-1.5">
                                                            {product.promo_value && (
                                                                <p className="text-[9px] font-bold text-slate-400 line-through decoration-rose-500/50 mb-0.5">
                                                                    {formatRupiah(product.price)}
                                                                </p>
                                                            )}
                                                            <p className="text-[13px] font-black text-emerald-600">
                                                                {formatRupiah(product.final_price)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAlert?.isOpen && (
                <Alert
                    type={showAlert.type}
                    message={showAlert.message}
                    onClose={() => setShowAlert(null)}
                />
            )}
        </MainLayout>
    );
};

export default CreateOrUpdatePostView;