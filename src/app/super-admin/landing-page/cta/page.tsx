"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, ShoppingBag, Loader2, ArrowLeft,
    Type, AlignLeft, MousePointerClick, MapPin,
    CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

// Import Utility Fetcher (SOP Production)
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';
import SuperAdminLayout from '../../Components/SuperAdminLayout';

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================
interface FormDataState {
    headline_1: string;
    headline_2: string;
    description: string;
    btn_primary: string;
    btn_secondary: string;
}

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'warning';
}

export default function EcommerceSectionSettings() {
    const router = useRouter();

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    const [formData, setFormData] = useState<FormDataState>({
        headline_1: 'E-commerce',
        headline_2: 'UMKM Lokal.',
        description: 'Temukan dan dukung berbagai produk unggulan dari UMKM yang ada di sekitar lokasi Anda. Belanja mudah, bisnis lokal berkembang.',
        btn_primary: 'Mulai Belanja',
        btn_secondary: 'Deteksi Lokasi Saya'
    });

    // Helper Toast
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ==========================================
    // FETCH DATA API
    // ==========================================
    useEffect(() => {
        const fetchEcommerceData = async () => {
            try {
                const result = await Get<{ success: boolean; data: any }>('super-admin/ecommerce-cta/show');

                if (result?.success && result.data) {
                    setFormData({
                        headline_1: result.data.headline_1 || '',
                        headline_2: result.data.headline_2 || '',
                        description: result.data.description || '',
                        btn_primary: result.data.btn_primary || '',
                        btn_secondary: result.data.btn_secondary || ''
                    });
                }
            } catch (error) {
                console.error("Kesalahan memuat data e-commerce:", error);
                showToast("Gagal memuat data dari server.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEcommerceData();
    }, []);

    // ==========================================
    // HANDLERS API
    // ==========================================
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await Post('super-admin/ecommerce-cta/update', formData);

            if (result) {
                showToast('Perubahan Bagian E-Commerce Berhasil Disimpan!', 'success');
            }
        } catch (error: any) {
            showToast('Gagal menyimpan perubahan. ' + (error?.message || ''), 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // ==========================================
    // RENDER LOADING STATE
    // ==========================================
    if (isLoading) {
        return (
            <SuperAdminLayout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="text-emerald-500 animate-spin" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat Pengaturan E-Commerce...</p>
                </div>
            </SuperAdminLayout>
        );
    }

    return (
        <SuperAdminLayout>
            {/* CUSTOM TOAST NOTIFICATION */}
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

            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* BAGIAN KIRI: FORM EDITOR */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">

                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                                Konfigurasi Teks & Tombol
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
                            {/* Input: Headline 1 & 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="sm:col-span-2">
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Type size={12} /> Konfigurasi Judul Utama
                                    </h3>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                        Teks Biasa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.headline_1}
                                        onChange={(e) => setFormData({ ...formData, headline_1: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                        placeholder="Contoh: E-commerce"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 mb-2 pl-4">
                                        Teks Highlight (Hijau)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.headline_2}
                                        onChange={(e) => setFormData({ ...formData, headline_2: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-emerald-200 bg-emerald-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-black text-emerald-700 shadow-sm"
                                        placeholder="Contoh: UMKM Lokal."
                                    />
                                </div>
                            </div>

                            {/* Input: Description */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                    <AlignLeft size={12} /> Deskripsi Ajakan (CTA)
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-6 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none leading-relaxed shadow-sm"
                                    placeholder="Jelaskan mengapa mereka harus belanja di sini..."
                                />
                            </div>

                            {/* Input: Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="sm:col-span-2">
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <MousePointerClick size={12} /> Konfigurasi Tombol Aksi
                                    </h3>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-2 pl-4">
                                        Tombol Utama (Hijau)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.btn_primary}
                                        onChange={(e) => setFormData({ ...formData, btn_primary: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                        placeholder="Cth: Mulai Belanja"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                        Tombol Sekunder (Gelap)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.btn_secondary}
                                        onChange={(e) => setFormData({ ...formData, btn_secondary: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                        placeholder="Cth: Deteksi Lokasi Saya"
                                    />
                                </div>
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
                    <div className="bg-slate-900 rounded-[2.5rem] border-[4px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[700px] animate-in fade-in zoom-in-95 duration-700 relative">

                        {/* Mockup Topbar (Dark Mode) */}
                        <div className="bg-slate-950 px-6 py-3 flex items-center gap-2 border-b border-slate-800 z-20 relative">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="ml-4 flex-1 h-5 bg-slate-800 rounded-full"></div>
                        </div>

                        {/* Background Effects identik dengan Landing Page Asli */}
                        <div className="absolute inset-0 opacity-40 pointer-events-none mt-12">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[#10B981]/50 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-600/30 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
                        </div>

                        {/* Area Konten Preview (Dark Theme CTA) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 flex flex-col justify-center text-center relative z-10">

                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto shadow-inner border border-white/20 mb-6">
                                <ShoppingBag size={32} />
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                                {formData.headline_1 || 'Headline'} <span className="text-emerald-400">{formData.headline_2 || 'Highlight'}</span>
                            </h2>

                            <p className="text-sm sm:text-base text-slate-300 mb-10 max-w-sm mx-auto font-medium leading-relaxed">
                                {formData.description || 'Deskripsi singkat mengenai aksi yang harus dilakukan pengunjung.'}
                            </p>

                            <div className="flex flex-col gap-4 max-w-xs mx-auto w-full">
                                {formData.btn_primary && (
                                    <button disabled className="w-full px-6 py-4 flex justify-center items-center rounded-xl bg-[#10B981] text-slate-900 font-bold text-sm shadow-xl opacity-90 cursor-not-allowed transition-transform">
                                        {formData.btn_primary}
                                    </button>
                                )}
                                {formData.btn_secondary && (
                                    <button disabled className="w-full px-6 py-4 rounded-xl bg-slate-800/50 backdrop-blur-md border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 opacity-90 cursor-not-allowed">
                                        <MapPin size={18} /> {formData.btn_secondary}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </SuperAdminLayout>
    );
}