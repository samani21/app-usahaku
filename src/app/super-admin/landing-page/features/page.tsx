"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, Loader2, Plus, Trash2, AlignLeft, Type, LayoutGrid, Link, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Icon } from '@iconify/react';

// Import Utility Fetcher (SOP Production)
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';
import SuperAdminLayout from '../../Components/SuperAdminLayout';
import { Feature, Items } from '@/app/home/Components/type';

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'warning';
}

// Daftar icon rekomendasi
const CURATED_ICONS = [
    { id: 'solar:smartphone-bold-duotone', label: 'HP / Gadget' },
    { id: 'solar:shield-check-bold-duotone', label: 'Keamanan' },
    { id: 'solar:bill-list-bold-duotone', label: 'Struk / Kasir' },
    { id: 'solar:graph-up-bold-duotone', label: 'Grafik Naik' },
    { id: 'solar:map-point-bold-duotone', label: 'Lokasi' },
    { id: 'solar:shop-bold-duotone', label: 'Toko' },
    { id: 'solar:box-bold-duotone', label: 'Produk' },
    { id: 'solar:wallet-bold-duotone', label: 'Dompet' },
    { id: 'solar:tag-price-bold-duotone', label: 'Harga' },
];

export default function FeaturesSectionSettings() {
    const router = useRouter();

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // State untuk Custom Toast Notification (Pengganti Alert)
    const [toast, setToast] = useState<ToastState | null>(null);

    const [formData, setFormData] = useState<Feature>({
        section_title: '',
        section_desc: '',
        items: []
    });

    // Helper untuk menampilkan Toast UI
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500); // Otomatis hilang setelah 3.5 detik
    };

    // ==========================================
    // FETCH DATA API (SAFE MOUNT PATTERN)
    // ==========================================
    useEffect(() => {
        let isMounted = true; // SOP: Cegah bug memory leak saat pindah halaman cepat

        const fetchFeatureData = async () => {
            try {
                const result = await Get<{ success: boolean; data: Feature }>('super-admin/feature/show');

                if (isMounted && result?.success && result.data) {
                    setFormData({
                        section_title: result.data.section_title || '',
                        section_desc: result.data.section_desc || '',
                        items: result.data.items || []
                    });
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Kesalahan jaringan saat memuat data:", error);
                    showToast("Gagal memuat data awal dari server.", "error");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchFeatureData();

        return () => {
            isMounted = false; // Cleanup saat unmount
        };
    }, []);

    // ==========================================
    // HANDLERS API
    // ==========================================
    const handleSave = async () => {
        // Validasi Frontend Cepat
        if (!formData.section_title.trim()) {
            showToast('Judul Bagian Fitur wajib diisi!', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const result = await Post('super-admin/feature/update', formData);

            if (result) {
                showToast('Perubahan berhasil disimpan & Live di Halaman Depan!', 'success');
            }
        } catch (error: any) {
            // Tangkap pesan spesifik dari Backend atau default
            const errorMsg = error?.response?.data?.message || error?.message || 'Terjadi kesalahan jaringan. Silakan coba lagi.';
            showToast(errorMsg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Handler Form Dinamis (Type-safe)
    const handleItemChange = (index: number, field: keyof Items, value: string) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        const newItem: Items = {
            id: Date.now(), // Unique ID sementara untuk React Key
            icon: 'solar:star-fall-bold-duotone',
            title: '',
            desc: ''
        };
        setFormData({ ...formData, items: [...formData.items, newItem] });
    };

    const removeItem = (index: number) => {
        if (formData.items.length <= 1) {
            showToast("Minimal harus ada 1 fitur yang ditampilkan.", "warning");
            return;
        }
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    // ==========================================
    // RENDER LOADING STATE
    // ==========================================
    if (isLoading) {
        return (
            <SuperAdminLayout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="text-emerald-500 animate-spin" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Menyiapkan Data Superadmin...</p>
                </div>
            </SuperAdminLayout>
        );
    }

    return (
        <SuperAdminLayout>
            <div className=" font-sans text-slate-800 pb-20 relative">

                {/* CUSTOM TOAST NOTIFICATION (PENGGANTI ALERT) */}
                {toast && (
                    <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
                        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                                'bg-amber-50 border-amber-200 text-amber-800'
                            }`}>
                            {toast.type === 'success' && <CheckCircle size={20} className="text-emerald-500" />}
                            {toast.type === 'error' && <XCircle size={20} className="text-rose-500" />}
                            {toast.type === 'warning' && <AlertCircle size={20} className="text-amber-500" />}
                            <span className="text-sm font-bold">{toast.message}</span>
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT (SPLIT LAYOUT) */}
                <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* BAGIAN KIRI: FORM EDITOR */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

                            {/* Overlay loading saat sedang nyimpan data */}
                            {isSaving && (
                                <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center">
                                    <Loader2 size={32} className="animate-spin text-emerald-500" />
                                </div>
                            )}

                            {/* 1. Pengaturan Header Fitur */}
                            <div className="mb-10">
                                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                                        Header Section
                                    </h2>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                    >
                                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                            Judul Bagian Fitur <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.section_title}
                                            onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
                                            className="w-full px-6 py-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800"
                                            placeholder="Contoh: Kekuatan di Balik UsahaKu"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                            <AlignLeft size={12} /> Deskripsi Singkat
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.section_desc}
                                            onChange={(e) => setFormData({ ...formData, section_desc: e.target.value })}
                                            className="w-full px-6 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none leading-relaxed"
                                            placeholder="Penjelasan singkat tentang fitur unggulan..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Pengaturan Daftar Fitur */}
                            <div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <LayoutGrid size={16} /> Daftar Fitur
                                    </h2>
                                    <button
                                        onClick={addItem}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 border border-emerald-200 shadow-sm"
                                    >
                                        <Plus size={12} strokeWidth={3} /> Tambah Fitur
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {formData.items.map((item, index) => (
                                        <div key={item.id} className="p-5 sm:p-6 bg-slate-50 rounded-[2rem] border border-slate-200 relative group transition-all hover:border-emerald-300 hover:shadow-md">

                                            {/* Kapsul Nomer */}
                                            <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black text-sm border-4 border-white shadow-sm z-10">
                                                {index + 1}
                                            </div>

                                            {/* Tombol Hapus */}
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="absolute top-4 right-4 p-2 bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 rounded-full border border-slate-200 transition-all active:scale-95 z-10"
                                                title="Hapus Fitur"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="space-y-6 pt-2">
                                                {/* Pilihan Ikon (Iconify) */}
                                                <div>
                                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Ikon Fitur (Iconify)</label>

                                                    {/* Quick Select */}
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {CURATED_ICONS.map((icon) => (
                                                            <button
                                                                key={icon.id}
                                                                onClick={() => handleItemChange(index, 'icon', icon.id)}
                                                                className={`p-2.5 rounded-full border transition-all active:scale-95 ${item.icon === icon.id
                                                                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                                                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                                                    }`}
                                                                title={icon.label}
                                                            >
                                                                <Icon icon={icon.id} width="20" height="20" />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {/* Custom Input */}
                                                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all w-full sm:w-11/12">
                                                        <div className="pl-3 pr-1 text-emerald-500 flex-shrink-0">
                                                            <Icon icon={item.icon || "line-md:question-circle"} width="20" height="20" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={item.icon}
                                                            onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
                                                            className="w-full bg-transparent border-none outline-none text-xs font-bold text-slate-700 placeholder-slate-400"
                                                            placeholder="Custom Iconify (cth: mdi:store)"
                                                        />
                                                        <a
                                                            href="https://icon-sets.iconify.design/"
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1 transition-colors"
                                                        >
                                                            Cari <Link size={10} />
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Judul Fitur */}
                                                <div>
                                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Judul Fitur <span className="text-rose-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={item.title}
                                                        onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                                                        className="w-full sm:w-11/12 px-5 py-3 rounded-full border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                                        placeholder="Contoh: Kasir Pintar (POS)"
                                                    />
                                                </div>

                                                {/* Deskripsi Fitur */}
                                                <div>
                                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Deskripsi Fitur</label>
                                                    <textarea
                                                        rows={2}
                                                        value={item.desc}
                                                        onChange={(e) => handleItemChange(index, 'desc', e.target.value)}
                                                        className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none shadow-sm leading-relaxed"
                                                        placeholder="Penjelasan singkat keunggulan fitur..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BAGIAN KANAN: LIVE PREVIEW */}
                    <div className="lg:col-span-6 lg:sticky lg:top-28">
                        <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 px-4 text-center lg:text-left">
                            Live Preview (Pratinjau Langsung)
                        </h2>

                        {/* Frame Preview Bergaya Window */}
                        <div className="bg-white rounded-[2.5rem] border-[4px] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col h-[700px] animate-in fade-in zoom-in-95 duration-700">

                            {/* Mockup Topbar */}
                            <div className="bg-slate-100 px-6 py-3 flex items-center gap-2 border-b border-slate-200 z-20 sticky top-0">
                                <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                <div className="ml-4 flex-1 h-5 bg-white rounded-full opacity-50"></div>
                            </div>

                            {/* Area Konten Preview (Bisa di-scroll) */}
                            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6 sm:p-10 relative">

                                {/* Header Section di Preview */}
                                <div className="text-center mb-10 max-w-md mx-auto relative z-10">
                                    <h2 className="text-[#10B981] font-bold tracking-widest uppercase text-[9px] mb-3">
                                        Fitur Skala Enterprise
                                    </h2>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                        {formData.section_title || 'Judul Kosong'}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {formData.section_desc || 'Deskripsi kosong.'}
                                    </p>
                                </div>

                                {/* Grid Fitur di Preview */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                                    {formData.items.map((item, idx) => (
                                        <div key={item.id} className="bg-[#FAFAFA] rounded-3xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:bg-white hover:border-emerald-100 transition-all">
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-emerald-500">
                                                    <Icon icon={item.icon || 'line-md:question-circle'} width="24" height="24" />
                                                </div>
                                                <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">
                                                    {item.title || 'Judul Fitur'}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-4">
                                                    {item.desc || 'Deskripsi belum diisi.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </SuperAdminLayout>
    );
}