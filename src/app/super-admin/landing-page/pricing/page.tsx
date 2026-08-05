"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, DollarSign, Loader2, ArrowLeft,
    CheckCircle2, Plus, Trash2, Sparkles,
    GripVertical, Clock, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';

// Import Utility Fetcher (SOP Production)
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';
import SuperAdminLayout from '../../Components/SuperAdminLayout';

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================
interface FormDataState {
    trial_days: string | number;
    trial_features: string[];
    original_price: string | number;
    pro_price: string | number;
    pro_features: string[];
}

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'warning';
}

export default function PricingSectionSettings() {
    const router = useRouter();

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    // Sub-tab untuk switch form Trial / Pro
    const [activePlanTab, setActivePlanTab] = useState<'trial' | 'pro'>('pro');

    const [formData, setFormData] = useState<FormDataState>({
        trial_days: '14',
        trial_features: ['Buka 100% Semua Fitur Aplikasi'],
        original_price: '50000',
        pro_price: '35000',
        pro_features: ['Amankan Akses Seluruh Fitur (Permanen)']
    });

    // Helper Toast (Pengganti Alert)
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ==========================================
    // FETCH DATA API (SAFE MOUNT PATTERN)
    // ==========================================
    useEffect(() => {
        let isMounted = true; // SOP: Mencegah error memori saat user pindah halaman cepat

        const fetchPricingData = async () => {
            try {
                const result = await Get<{ success: boolean; data: any }>('super-admin/pricing/show');

                if (isMounted && result?.success && result.data) {
                    setFormData({
                        trial_days: result.data.trial_days || '14',
                        trial_features: result.data.trial_features || [],
                        original_price: result.data.original_price || '50000',
                        pro_price: result.data.pro_price || '35000',
                        pro_features: result.data.pro_features || []
                    });
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Kesalahan jaringan saat memuat data:", error);
                    showToast("Gagal memuat data pengaturan harga dari server.", "error");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchPricingData();

        return () => {
            isMounted = false; // Cleanup jika komponen ditutup
        };
    }, []);

    // ==========================================
    // HANDLERS API
    // ==========================================
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await Post('super-admin/pricing/update', formData);

            if (result) {
                showToast('Perubahan Paket Harga Berhasil Disimpan & Live!', 'success');
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Terjadi kesalahan jaringan. Silakan coba lagi.';
            showToast('Gagal menyimpan perubahan. ' + errorMsg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Handler Dinamis untuk Features (Bisa untuk Trial / Pro)
    const handleFeatureChange = (type: 'trial' | 'pro', index: number, value: string) => {
        const key = type === 'trial' ? 'trial_features' : 'pro_features';
        const newFeatures = [...formData[key]];
        newFeatures[index] = value;
        setFormData({ ...formData, [key]: newFeatures });
    };

    const addFeature = (type: 'trial' | 'pro') => {
        const key = type === 'trial' ? 'trial_features' : 'pro_features';
        setFormData({ ...formData, [key]: [...formData[key], ''] });
    };

    const removeFeature = (type: 'trial' | 'pro', index: number) => {
        const key = type === 'trial' ? 'trial_features' : 'pro_features';
        if (formData[key].length <= 1) {
            showToast("Minimal harus ada 1 keuntungan yang ditampilkan.", "warning");
            return;
        }
        const newFeatures = formData[key].filter((_, i) => i !== index);
        setFormData({ ...formData, [key]: newFeatures });
    };

    // Helpers Formatting
    const formatRibuan = (numStr: string | number) => {
        const num = typeof numStr === 'string' ? parseInt(numStr) : numStr;
        if (isNaN(num)) return "0";
        return num >= 1000 ? (num / 1000) + 'k' : num.toString();
    };

    const formatRupiahFull = (numStr: string | number) => {
        const num = typeof numStr === 'string' ? parseInt(numStr) : numStr;
        if (isNaN(num)) return "0";
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // ==========================================
    // RENDER LOADING STATE
    // ==========================================
    if (isLoading) {
        return (
            <SuperAdminLayout>
                <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={40} className="text-emerald-500 animate-spin" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat Pengaturan Harga...</p>
                </div>
            </SuperAdminLayout>
        );
    }

    return (
        <SuperAdminLayout>
            {/* CUSTOM TOAST UI */}
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

            <div className=" py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

                        {/* Overlay loading saat nyimpan data */}
                        {isSaving && (
                            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center">
                                <Loader2 size={32} className="animate-spin text-emerald-500" />
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                                Form Pengaturan Harga
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

                        {/* Segmented Control (Pill Switcher) */}
                        <div className="flex bg-slate-100 p-1.5 rounded-full mb-8 relative">
                            <button
                                onClick={() => setActivePlanTab('trial')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${activePlanTab === 'trial' ? 'text-slate-800 shadow-sm bg-white' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <Clock size={14} /> Gratis Trial
                            </button>
                            <button
                                onClick={() => setActivePlanTab('pro')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 z-10 ${activePlanTab === 'pro' ? 'text-emerald-700 shadow-sm bg-white' : 'text-slate-400 hover:text-emerald-600'}`}
                            >
                                <Sparkles size={14} /> Mitra UMKM
                            </button>
                        </div>

                        {/* FORM: PAKET TRIAL */}
                        {activePlanTab === 'trial' && (
                            <div className="animate-in fade-in duration-300 space-y-8">
                                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                        Durasi Uji Coba (Hari)
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="number"
                                            value={formData.trial_days}
                                            onChange={(e) => setFormData({ ...formData, trial_days: e.target.value })}
                                            className="w-full pl-6 pr-14 py-3 rounded-full border border-slate-200 bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-500/10 transition-all outline-none text-sm font-bold text-slate-700 shadow-sm"
                                        />
                                        <span className="absolute right-6 text-slate-400 font-bold text-xs uppercase tracking-widest">Hari</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                                            Keuntungan Uji Coba
                                        </h3>
                                        <button onClick={() => addFeature('trial')} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 shadow-sm">
                                            <Plus size={12} strokeWidth={3} /> Tambah
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.trial_features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 group">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 cursor-grab active:cursor-grabbing"><GripVertical size={14} /></div>
                                                <div className="relative flex-1">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><CheckCircle2 size={16} /></span>
                                                    <input type="text" value={feature} onChange={(e) => handleFeatureChange('trial', index, e.target.value)} className="w-full pl-11 pr-5 py-3 rounded-full border border-slate-200 bg-white focus:border-slate-400 focus:ring-4 focus:ring-slate-500/10 transition-all outline-none text-sm font-bold text-slate-700 shadow-sm" />
                                                </div>
                                                <button onClick={() => removeFeature('trial', index)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100" title="Hapus"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FORM: PAKET PRO */}
                        {activePlanTab === 'pro' && (
                            <div className="animate-in fade-in duration-300 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-emerald-50/50 rounded-[2rem] border border-emerald-100">
                                    <div>
                                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Harga Coret (Asli)</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-400 font-bold text-xs">Rp</span>
                                            <input type="number" value={formData.original_price} onChange={(e) => setFormData({ ...formData, original_price: e.target.value })} className="w-full pl-10 pr-5 py-3 rounded-full border border-slate-200 bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-sm font-bold text-slate-600 shadow-sm" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-2 pl-4">Harga Promo (Final)</label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-emerald-500 font-bold text-xs">Rp</span>
                                            <input type="number" value={formData.pro_price} onChange={(e) => setFormData({ ...formData, pro_price: e.target.value })} className="w-full pl-10 pr-5 py-3 rounded-full border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-black text-emerald-700 shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                                        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Keuntungan Mitra UMKM</h3>
                                        <button onClick={() => addFeature('pro')} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-full text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 border border-emerald-200 shadow-sm">
                                            <Plus size={12} strokeWidth={3} /> Tambah
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.pro_features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3 group">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 cursor-grab active:cursor-grabbing"><GripVertical size={14} /></div>
                                                <div className="relative flex-1">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500"><CheckCircle2 size={16} /></span>
                                                    <input type="text" value={feature} onChange={(e) => handleFeatureChange('pro', index, e.target.value)} className="w-full pl-11 pr-5 py-3 rounded-full border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-700 shadow-sm" />
                                                </div>
                                                <button onClick={() => removeFeature('pro', index)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100" title="Hapus"><Trash2 size={14} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BAGIAN KANAN: LIVE PREVIEW */}
                <div className="lg:col-span-6 lg:sticky lg:top-28">
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 px-4 text-center lg:text-left">
                        Live Preview (Pratinjau Langsung)
                    </h2>

                    <div className="bg-white rounded-[2.5rem] border-[4px] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col h-[700px] animate-in fade-in zoom-in-95 duration-700">
                        <div className="bg-slate-100 px-6 py-3 flex items-center gap-2 border-b border-slate-200 z-20 sticky top-0">
                            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <div className="ml-4 flex-1 h-5 bg-white rounded-full opacity-50"></div>
                        </div>

                        <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar p-6 sm:p-10 flex flex-col items-center justify-center relative">

                            {/* PREVIEW: KARTU TRIAL */}
                            {activePlanTab === 'trial' && (
                                <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col transform transition-all animate-in fade-in zoom-in-95">
                                    <div className="mb-6 border-b border-slate-100 pb-6">
                                        <div className="inline-block px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-[10px] font-bold tracking-widest uppercase mb-4">
                                            Uji Coba Penuh
                                        </div>
                                        <h4 className="text-2xl font-black text-slate-900 mb-2">Gratis Trial</h4>
                                        <p className="text-xs font-medium text-slate-500 leading-relaxed">Buktikan sendiri kehebatan sistem kami.</p>
                                    </div>
                                    <div className="mb-8 flex items-baseline gap-1.5">
                                        <span className="text-5xl font-black text-slate-900 tracking-tight">Rp 0</span>
                                        <span className="text-sm font-bold text-slate-400">/ {formData.trial_days} Hari</span>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-grow">
                                        {formData.trial_features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle2 size={18} className="text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                                <span className="text-slate-600 font-semibold text-sm leading-snug">{feature || 'Keuntungan kosong'}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button disabled className="w-full py-3.5 flex justify-center items-center rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 bg-slate-100 opacity-90 cursor-not-allowed mt-auto border border-slate-200">
                                        Mulai Trial Sekarang
                                    </button>
                                </div>
                            )}

                            {/* PREVIEW: KARTU PRO */}
                            {activePlanTab === 'pro' && (
                                <div className="w-full max-w-sm relative p-[2px] rounded-[2.5rem] bg-gradient-to-b from-[#10B981] via-emerald-600 to-slate-800 shadow-2xl shadow-emerald-900/20 flex flex-col transform transition-all animate-in fade-in zoom-in-95">
                                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-[#10B981] to-emerald-400 text-white text-[10px] font-black tracking-widest px-5 py-1.5 rounded-full shadow-lg z-10 border border-emerald-300/30">
                                        PILIHAN TERBAIK
                                    </div>
                                    <div className="bg-slate-950 rounded-[calc(2.5rem-2px)] p-8 h-full relative overflow-hidden flex flex-col">
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none"></div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-6 border-b border-slate-800 pb-6">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold tracking-widest uppercase mb-4">
                                                    <Sparkles size={12} /> Profesional
                                                </div>
                                                <h4 className="text-2xl font-black text-white mb-2">Mitra UMKM</h4>
                                                <p className="text-xs font-medium text-slate-400 leading-relaxed">Amankan data usaha Anda & buka keran penghasilan tambahan.</p>
                                            </div>
                                            <div className="mb-8">
                                                {formData.original_price && formData.original_price !== '0' && (
                                                    <div className="text-slate-500 line-through text-sm font-bold mb-1 decoration-red-500/70 decoration-2">
                                                        Rp {formatRupiahFull(formData.original_price)}
                                                    </div>
                                                )}
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200 tracking-tight">
                                                        Rp {formatRibuan(formData.pro_price)}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-400">/ bln</span>
                                                </div>
                                            </div>
                                            <ul className="space-y-4 mb-8 flex-grow">
                                                {formData.pro_features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                                                        <span className="text-slate-300 font-semibold text-sm leading-snug">{feature || 'Keuntungan kosong'}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button disabled className="w-full py-3.5 flex justify-center items-center rounded-2xl font-black text-xs uppercase tracking-widest text-slate-900 bg-gradient-to-r from-[#10B981] to-emerald-400 opacity-90 cursor-not-allowed mt-auto shadow-lg shadow-emerald-500/20">
                                                Lanjutkan Berlangganan
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </SuperAdminLayout>
    );
}