"use client"

import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Save,
    Tag,
    Percent,
    Calendar,
    ShoppingBag,
    Info,
    CheckCircle2,
    Circle,
    LayoutGrid,
    ShoppingCart,
    ArrowRight,
    CheckSquare,
    Zap,
    Loader2
} from 'lucide-react';
import MainLayout from '@/Components/Layout/MainLayout';
import Loading from '@/Components/Loading';
import { Get } from '@/utils/Get';
import { ItemProduct, ProductPromoType, ProductVariantPromoType, PromoType } from './type';
import { Post } from '@/utils/Post';
import Alert from '@/Components/Alert';
import { AlertType } from '@/types/Alert';
import { formatImage } from '@/utils/formatImage';

// Tipe data untuk menyimpan konfigurasi masing-masing item
type PromoConfig = {
    type: 'percentage' | 'nominal';
    value: string;
};

type Props = {
    onClose: () => void;
    editPromo: PromoType | null;
}

export default function CreateOrUpdatePromo({ onClose, editPromo }: Props) {
    // --- STATE FORM GLOBAL ---
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [namePromo, setNamePromo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- STATE PROMO GLOBAL (Berlaku Jika Potongan Checkout) ---
    const [isGlobal, setIsGlobal] = useState<boolean>(true);
    const [globalPromoType, setGlobalPromoType] = useState<'percentage' | 'nominal'>('percentage');
    const [globalPromoValue, setGlobalPromoValue] = useState<string>('');

    // --- STATE PROMO SPESIFIK & PENGATURAN CEPAT (BULK) ---
    const [bulkPromoType, setBulkPromoType] = useState<'percentage' | 'nominal'>('percentage');
    const [bulkPromoValue, setBulkPromoValue] = useState<string>('');
    const [itemConfigs, setItemConfigs] = useState<Record<string, PromoConfig>>({});
    const [itemProduct, setItemProduct] = useState<ItemProduct[]>([]);

    useEffect(() => {
        getProduct()
    }, [])

    useEffect(() => {
        if (editPromo) {
            setNamePromo(editPromo?.name_promo)
            setStartDate(editPromo?.start_date ?? '')
            setEndDate(editPromo?.end_date ?? '')

            // Set Global/Specific logic based on promo type
            if (editPromo?.type === 'percentage' || editPromo?.type === 'nominal') {
                setIsGlobal(true);
                setGlobalPromoType(editPromo.type as 'percentage' | 'nominal');
                setGlobalPromoValue(String(editPromo.value));
            } else {
                setIsGlobal(false);
            }

            // Populate specific items if exist
            setItemConfigs(prev => {
                const next = { ...prev };
                editPromo?.products?.forEach((p: ProductPromoType) => {
                    const key = `P_${p.product_id}`;
                    if (p.variants && p.variants?.length > 0) {
                        p.variants.forEach((v: ProductVariantPromoType) => {
                            if (!next[`V_${v.variant_id}`]) {
                                next[`V_${v.variant_id}`] = { type: v?.type as 'percentage' | 'nominal', value: String(v?.value) };
                            }
                        });
                    }
                    next[key] = { type: p?.type as 'percentage' | 'nominal', value: String(p?.value) };
                })
                return next;
            });
        }
    }, [editPromo])

    const getProduct = async () => {
        try {
            const res = await Get<{ success: boolean, data: ItemProduct[] }>('client/promo/get-products')
            if (res?.success) {
                setItemProduct(res?.data)
            }
        } catch {
            setShowAlert({ type: 'error', message: 'Gagal mengambil data produk', isOpen: true });
        } finally {
            setLoading(false);
        }
    }

    // --- HELPER FORMAT ---
    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const formatCurrencyInput = (val: string) => {
        if (!val) return "";
        const numericStr = String(val).replace(/[^0-9]/g, "");
        return numericStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // --- LOGIKA KALKULASI PREVIEW ---
    const calculatePreview = (originalPrice: number, type: 'percentage' | 'nominal', valueStr: string) => {
        const val = Number(valueStr) || 0;
        let finalPrice = originalPrice;
        let cutValue = '';

        if (type === 'percentage') {
            const discount = (originalPrice * val) / 100;
            finalPrice = Math.max(0, originalPrice - discount);
            cutValue = val > 0 ? `Diskon ${val}%` : '';
        } else {
            finalPrice = Math.max(0, originalPrice - val);
            cutValue = val > 0 ? `-Rp ${val.toLocaleString('id-ID')}` : '';
        }

        return { finalPrice, cutValue };
    };

    // --- HANDLER SELEKSI ITEM SPESIFIK ---
    const toggleProduct = (prod: any) => {
        setItemConfigs(prev => {
            const next = { ...prev };
            if (prod.variants && prod.variants?.length > 0) {
                const allSelected = prod.variants.every((v: any) => next[`V_${v.id}`]);
                if (allSelected) {
                    prod.variants.forEach((v: any) => delete next[`V_${v.id}`]);
                } else {
                    prod.variants.forEach((v: any) => {
                        if (!next[`V_${v.id}`]) next[`V_${v.id}`] = { type: bulkPromoType, value: bulkPromoValue };
                    });
                }
            } else {
                const key = `P_${prod.id}`;
                if (next[key]) delete next[key];
                else next[key] = { type: bulkPromoType, value: bulkPromoValue };
            }
            return next;
        });
    };

    const toggleVariant = (varId: number) => {
        setItemConfigs(prev => {
            const next = { ...prev };
            const key = `V_${varId}`;
            if (next[key]) delete next[key];
            else next[key] = { type: bulkPromoType, value: bulkPromoValue };
            return next;
        });
    };

    const updateItemConfig = (key: string, field: 'type' | 'value', val: string) => {
        setItemConfigs(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: val }
        }));
    };

    // --- HANDLER PENGATURAN CEPAT (BULK APPLY) ---
    const applyBulkConfig = () => {
        setItemConfigs(prev => {
            const next = { ...prev };
            Object.keys(next).forEach(key => {
                next[key] = { type: bulkPromoType, value: bulkPromoValue };
            });
            return next;
        });
    };

    // --- SUBMIT HANDLER ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!namePromo) {
            setShowAlert({ type: 'error', message: 'Nama promo wajib diisi!', isOpen: true });
            return;
        }
        if (isGlobal && !globalPromoValue) {
            setShowAlert({ type: 'error', message: 'Besaran nilai promo global wajib diisi!', isOpen: true });
            return;
        }

        setIsSubmitting(true);

        try {
            let processedProducts: any[] = [];

            if (!isGlobal) {
                processedProducts = itemProduct.map(p => {
                    if (p.variants && p?.variants?.length > 0) {
                        const selectedVars = p.variants.filter(v => itemConfigs[`V_${v.id}`]);
                        if (selectedVars.length === 0) return null;

                        return {
                            id: p.id,
                            variants: selectedVars.map(v => {
                                const conf = itemConfigs[`V_${v.id}`];
                                return {
                                    id: v.id,
                                    promo_type: conf.type,
                                    promo_value: Number(conf.value),
                                };
                            })
                        };
                    } else {
                        const conf = itemConfigs[`P_${p.id}`];
                        if (!conf) return null;
                        return {
                            id: p.id,
                            promo_type: conf.type,
                            promo_value: Number(conf.value),
                        };
                    }
                }).filter(Boolean);

                if (processedProducts.length === 0) {
                    setShowAlert({ type: 'error', message: 'Harap pilih setidaknya 1 produk/varian dan masukkan nilainya!', isOpen: true });
                    setIsSubmitting(false);
                    return;
                }
            }

            const payload = {
                name_promo: namePromo,
                value: isGlobal ? Number(globalPromoValue) : 0,
                type: isGlobal ? globalPromoType : 'mixed_specific',
                status: 1,
                start_date: startDate || null,
                end_date: endDate || null,
                products: processedProducts
            };

            const url = editPromo ? `client/promo/${editPromo?.id}` : 'client/promo'
            const res = await Post(url, payload);

            if (res) {
                onClose();
            }
        } catch (e: any) {
            setShowAlert({ type: 'error', message: 'Gagal menyimpan promo: ' + e.message, isOpen: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loading />
    }

    return (
        <MainLayout>
            <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">

                {/* --- HEADER --- */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{editPromo ? "Edit" : "Buat"} Promo Baru</h2>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Atur detail potongan harga dan masa berlaku promo.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- KOLOM KIRI (Informasi Utama) --- */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Card Detail Promo */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                    <Tag size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">Detail Promo</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nama Promo</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Diskon Kemerdekaan"
                                        value={namePromo}
                                        onChange={(e) => setNamePromo(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                {/* Form Value Global */}
                                {isGlobal && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tipe Promo</label>
                                            <div className="relative">
                                                <select
                                                    value={globalPromoType}
                                                    onChange={(e) => setGlobalPromoType(e.target.value as 'percentage' | 'nominal')}
                                                    className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all shadow-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="percentage">Persentase (%)</option>
                                                    <option value="nominal">Nominal (Rp)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Besaran Nilai</label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                    {globalPromoType === 'percentage' ? <Percent size={16} /> : <span className="text-sm font-bold">Rp</span>}
                                                </div>
                                                <input
                                                    type={globalPromoType === 'percentage' ? "number" : "text"}
                                                    placeholder={globalPromoType === 'percentage' ? "15" : "15.000"}
                                                    value={globalPromoType === 'percentage' ? globalPromoValue : formatCurrencyInput(globalPromoValue)}
                                                    onChange={(e) => {
                                                        const val = globalPromoType === 'percentage' ? e.target.value : e.target.value.replace(/[^0-9]/g, "");
                                                        setGlobalPromoValue(val);
                                                    }}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all shadow-sm"
                                                    required={isGlobal}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Target Produk */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <h3 className="font-bold text-slate-800 text-lg">Target Berlaku</h3>
                                </div>
                            </div>

                            {/* Pilihan Potongan Checkout vs Spesifik */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div
                                    onClick={() => setIsGlobal(true)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isGlobal ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <ShoppingCart size={24} className={isGlobal ? 'text-emerald-500' : 'text-slate-400'} />
                                        {isGlobal ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-slate-300" />}
                                    </div>
                                    <h4 className={`font-bold ${isGlobal ? 'text-emerald-700' : 'text-slate-700'}`}>Potongan di Checkout</h4>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">Berlaku otomatis ke total keranjang.</p>
                                </div>
                                <div
                                    onClick={() => setIsGlobal(false)}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${!isGlobal ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <LayoutGrid size={24} className={!isGlobal ? 'text-blue-500' : 'text-slate-400'} />
                                        {!isGlobal ? <CheckCircle2 size={20} className="text-blue-500" /> : <Circle size={20} className="text-slate-300" />}
                                    </div>
                                    <h4 className={`font-bold ${!isGlobal ? 'text-blue-700' : 'text-slate-700'}`}>Produk Spesifik</h4>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">Pilih & atur beda nilai tiap produk/varian.</p>
                                </div>
                            </div>

                            {/* List Produk (Hanya tampil jika bukan global/checkout) */}
                            {!isGlobal && (
                                <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">

                                    {/* --- PENGATURAN CEPAT (BULK APPLY) --- */}
                                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Zap size={16} className="text-amber-500" />
                                            <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">Pengaturan Cepat</p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 items-end">
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                                <div>
                                                    <select
                                                        value={bulkPromoType}
                                                        onChange={(e) => setBulkPromoType(e.target.value as 'percentage' | 'nominal')}
                                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                                                    >
                                                        <option value="percentage">Persentase (%)</option>
                                                        <option value="nominal">Nominal (Rp)</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        type={bulkPromoType === 'percentage' ? "number" : "text"}
                                                        value={bulkPromoType === 'percentage' ? bulkPromoValue : formatCurrencyInput(bulkPromoValue)}
                                                        onChange={(e) => {
                                                            const val = bulkPromoType === 'percentage' ? e.target.value : e.target.value.replace(/[^0-9]/g, "");
                                                            setBulkPromoValue(val);
                                                        }}
                                                        placeholder="Nilai promo..."
                                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={applyBulkConfig}
                                                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all active:scale-95 whitespace-nowrap shadow-md shadow-slate-900/10"
                                            >
                                                Terapkan Semua
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                            *Nilai ini akan otomatis diterapkan ke produk yang baru Anda centang, atau klik tombol di atas untuk mengubah semua produk yang sudah dicentang saat ini.
                                        </p>
                                    </div>
                                    <div className="max-h-[450px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                        {itemProduct.map((prod) => {
                                            const hasVariants = !!prod.variants && prod?.variants?.length > 0;

                                            // Evaluasi seleksi parent
                                            let isParentSelected = false;
                                            let isParentIndeterminate = false;

                                            if (hasVariants) {
                                                const selectedVarsCount = prod.variants!.filter(v => itemConfigs[`V_${v.id}`]).length;
                                                isParentSelected = selectedVarsCount === prod.variants!.length && selectedVarsCount > 0;
                                                isParentIndeterminate = selectedVarsCount > 0 && selectedVarsCount < prod.variants!.length;
                                            } else {
                                                isParentSelected = !!itemConfigs[`P_${prod.id}`];
                                            }

                                            return (
                                                <div
                                                    key={prod.id}
                                                    className={`flex flex-col rounded-2xl border-2 transition-all overflow-hidden ${isParentSelected || isParentIndeterminate ? 'border-emerald-300 shadow-sm' : 'border-slate-100 bg-slate-50'}`}
                                                >
                                                    {/* Header Produk / Parent */}
                                                    <div
                                                        onClick={() => toggleProduct(prod)}
                                                        className={`flex flex-row items-center justify-between p-3 cursor-pointer transition-colors ${isParentSelected || isParentIndeterminate ? 'bg-white' : 'hover:bg-slate-100'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-5 h-5 shrink-0 flex items-center justify-center text-emerald-500">
                                                                {isParentSelected ? <CheckCircle2 size={20} /> : isParentIndeterminate ? <CheckSquare size={18} className="text-emerald-400" /> : <Circle size={20} className="text-slate-300" />}
                                                            </div>
                                                            <img src={formatImage(prod.image)} alt={prod.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-800">{prod.name}</h4>
                                                                {!hasVariants && (
                                                                    <p className="text-[10px] font-medium text-slate-500 line-through">{formatRupiah(prod.price!)}</p>
                                                                )}
                                                                {hasVariants && (
                                                                    <p className="text-[10px] font-medium text-slate-500">{prod.variants!.length} Varian Tersedia</p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Jika TIDAK punya varian & dipilih -> Input & Preview Harga */}
                                                        {!hasVariants && isParentSelected && (
                                                            <div className="flex flex-col items-end gap-1" onClick={e => e.stopPropagation()}>
                                                                <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                                                    <select
                                                                        value={itemConfigs[`P_${prod.id}`]?.type || 'percentage'}
                                                                        onChange={(e) => updateItemConfig(`P_${prod.id}`, 'type', e.target.value)}
                                                                        className="w-12 py-1 text-xs font-bold text-center bg-white border border-slate-200 rounded-md outline-none"
                                                                    >
                                                                        <option value="percentage">%</option>
                                                                        <option value="nominal">Rp</option>
                                                                    </select>
                                                                    <input
                                                                        type={itemConfigs[`P_${prod.id}`]?.type === 'percentage' ? "number" : "text"}
                                                                        value={itemConfigs[`P_${prod.id}`]?.type === 'percentage' ? (itemConfigs[`P_${prod.id}`]?.value || '') : formatCurrencyInput(itemConfigs[`P_${prod.id}`]?.value || '')}
                                                                        onChange={(e) => {
                                                                            const type = itemConfigs[`P_${prod.id}`]?.type || 'percentage';
                                                                            const val = type === 'percentage' ? e.target.value : e.target.value.replace(/[^0-9]/g, "");
                                                                            updateItemConfig(`P_${prod.id}`, 'value', val);
                                                                        }}
                                                                        placeholder="0"
                                                                        className="w-24 py-2 px-3 text-sm font-bold text-right bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 touch-manipulation shadow-sm"
                                                                    />
                                                                </div>

                                                                {Number(itemConfigs[`P_${prod.id}`]?.value) > 0 && (
                                                                    <p className="text-sm font-black text-emerald-600">
                                                                        {formatRupiah(calculatePreview(prod.price!, itemConfigs[`P_${prod.id}`].type, itemConfigs[`P_${prod.id}`].value).finalPrice)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Daftar Varian (Jika punya varian) */}
                                                    {hasVariants && (
                                                        <div className="bg-slate-50/50 border-t border-slate-100 flex flex-col gap-px">
                                                            {prod.variants!.map(v => {
                                                                const key = `V_${v.id}`;
                                                                const isSelected = !!itemConfigs[key];
                                                                const conf = itemConfigs[key] || { type: 'percentage', value: '' };
                                                                const preview = calculatePreview(v.price, conf.type, conf.value);

                                                                return (
                                                                    <div key={v.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 pl-11 transition-colors ${isSelected ? 'bg-white' : 'hover:bg-slate-100'}`}>
                                                                        <div
                                                                            onClick={() => toggleVariant(v.id)}
                                                                            className="flex items-center gap-2 cursor-pointer w-full sm:w-auto mb-2 sm:mb-0"
                                                                        >
                                                                            <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                                                                                {isSelected ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-300" />}
                                                                            </div>
                                                                            <span className="text-xs font-bold text-slate-700">{v.name}</span>
                                                                            <span className={`text-[10px] ml-1 font-medium ${isSelected && Number(conf.value) > 0 ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
                                                                                {formatRupiah(v.price)}
                                                                            </span>
                                                                        </div>

                                                                        {/* Input & Preview untuk Varian */}
                                                                        {isSelected && (
                                                                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pl-6 sm:pl-0">
                                                                                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                                                                                    <select
                                                                                        value={conf.type}
                                                                                        onChange={(e) => updateItemConfig(key, 'type', e.target.value)}
                                                                                        className="w-12 py-1 text-xs font-bold text-center bg-white border border-slate-200 rounded-md outline-none"
                                                                                    >
                                                                                        <option value="percentage">%</option>
                                                                                        <option value="nominal">Rp</option>
                                                                                    </select>
                                                                                    <input
                                                                                        type={conf.type === 'percentage' ? "number" : "text"}
                                                                                        value={conf.type === 'percentage' ? conf.value : formatCurrencyInput(conf.value)}
                                                                                        onChange={(e) => {
                                                                                            const val = conf.type === 'percentage' ? e.target.value : e.target.value.replace(/[^0-9]/g, "");
                                                                                            updateItemConfig(key, 'value', val);
                                                                                        }}
                                                                                        placeholder="0"
                                                                                        className="w-24 py-2 px-3 text-sm font-bold text-right bg-white border border-slate-200 rounded-lg outline-none focus:border-emerald-500 touch-manipulation shadow-sm"
                                                                                    />
                                                                                </div>

                                                                                <p className="text-sm font-black text-emerald-600 w-20 text-right">
                                                                                    {Number(conf.value) > 0 ? formatRupiah(preview.finalPrice) : '-'}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* --- KOLOM KANAN (Masa Berlaku & Submit) --- */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Card Masa Berlaku */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                                    <Calendar size={20} />
                                </div>
                                <h3 className="font-bold text-slate-800 text-lg">Masa Berlaku</h3>
                            </div>

                            <div className="space-y-5">
                                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex gap-3 items-start">
                                    <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                        Kosongkan tanggal mulai jika promo berlaku dari sekarang, dan kosongkan tanggal berakhir jika promo tidak memiliki batas waktu (selamanya).
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tanggal Berakhir</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-bold text-slate-800 outline-none transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button Card */}
                        <div className="bg-slate-900 rounded-[2rem] p-6 sm:p-8 shadow-2xl shadow-slate-900/20 text-center relative overflow-hidden border border-slate-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                            <h4 className="text-white font-black text-lg mb-2 relative z-10">Sudah Selesai?</h4>
                            <p className="text-slate-400 text-xs mb-6 font-medium relative z-10">Promo akan langsung aktif jika tanggal mulai mencakup hari ini.</p>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 relative z-10"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" /> Sedang Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Simpan Promo
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
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
}