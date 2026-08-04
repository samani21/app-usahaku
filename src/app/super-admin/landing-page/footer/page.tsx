"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, Loader2, ArrowLeft,
    Facebook, Twitter, Instagram,
    Type, Link as LinkIcon, MessageCircle,
    LayoutPanelTop, ToggleLeft, ToggleRight, Rocket,
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
    brand_name: string;
    brand_highlight: string;
    brand_desc: string;
    social_fb: string;
    social_tw: string;
    social_ig: string;
    copyright: string;
    show_fab: boolean;
    fab_text: string;
}

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'warning';
}

export default function FooterSectionSettings() {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    const [formData, setFormData] = useState<FormDataState>({
        brand_name: 'Usaha',
        brand_highlight: 'Ku',
        brand_desc: 'Merancang ulang cara Anda berbisnis. Ekosistem digital cerdas untuk pengusaha modern dan afiliator.',
        social_fb: 'https://facebook.com/usahaku',
        social_tw: 'https://twitter.com/usahaku',
        social_ig: 'https://instagram.com/usahaku',
        copyright: 'UsahaKu Inc. Hak Cipta Dilindungi.',
        show_fab: true,
        fab_text: 'E-commerce UMKM'
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
        const fetchFooterData = async () => {
            try {
                const result = await Get<{ success: boolean; data: any }>('super-admin/footer/show');

                if (result?.success && result.data) {
                    setFormData({
                        brand_name: result.data.brand_name || '',
                        brand_highlight: result.data.brand_highlight || '',
                        brand_desc: result.data.brand_desc || '',
                        social_fb: result.data.social_fb || '',
                        social_tw: result.data.social_tw || '',
                        social_ig: result.data.social_ig || '',
                        copyright: result.data.copyright || '',
                        show_fab: result.data.show_fab ?? true,
                        fab_text: result.data.fab_text || 'E-commerce UMKM'
                    });
                }
            } catch (error) {
                console.error("Kesalahan memuat data footer:", error);
                showToast("Gagal memuat data dari server.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFooterData();
    }, []);

    // ==========================================
    // HANDLERS API
    // ==========================================
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await Post('super-admin/footer/update', formData);

            if (result) {
                showToast('Perubahan Footer & Global Berhasil Disimpan!', 'success');
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
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Memuat Pengaturan Footer...</p>
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


            <div className=" py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* BAGIAN KIRI: FORM EDITOR */}
                <div className="lg:col-span-6 space-y-6">

                    {/* KARTU 1: BRANDING & TEKS */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                                Identitas Brand
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Nama Brand</label>
                                    <input
                                        type="text"
                                        value={formData.brand_name}
                                        onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 mb-2 pl-4">Highlight Nama</label>
                                    <input
                                        type="text"
                                        value={formData.brand_highlight}
                                        onChange={(e) => setFormData({ ...formData, brand_highlight: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-emerald-200 bg-emerald-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-black text-emerald-700"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Deskripsi Footer</label>
                                <textarea
                                    rows={3}
                                    value={formData.brand_desc}
                                    onChange={(e) => setFormData({ ...formData, brand_desc: e.target.value })}
                                    className="w-full px-6 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Teks Hak Cipta (Copyright)</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-5 text-slate-400 font-medium text-sm">&copy; {new Date().getFullYear()}</span>
                                    <input
                                        type="text"
                                        value={formData.copyright}
                                        onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                                        className="w-full pl-20 pr-5 py-3.5 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KARTU 2: SOSIAL MEDIA & FAB */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <LinkIcon size={16} /> Tautan & Aksesoris
                        </h2>

                        <div className="space-y-6">
                            {/* Social Links */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Facebook size={18} /></div>
                                    <input type="text" value={formData.social_fb} onChange={(e) => setFormData({ ...formData, social_fb: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link Facebook" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center shrink-0"><Twitter size={18} /></div>
                                    <input type="text" value={formData.social_tw} onChange={(e) => setFormData({ ...formData, social_tw: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link Twitter (X)" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0"><Instagram size={18} /></div>
                                    <input type="text" value={formData.social_ig} onChange={(e) => setFormData({ ...formData, social_ig: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link Instagram" />
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* FAB Settings */}
                            <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Tombol Melayang (FAB)</h4>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold mt-0.5">Pojok Kanan Bawah</p>
                                    </div>
                                    <button
                                        onClick={() => setFormData({ ...formData, show_fab: !formData.show_fab })}
                                        className={`transition-colors duration-300 ${formData.show_fab ? 'text-emerald-500' : 'text-slate-300'}`}
                                    >
                                        {formData.show_fab ? <ToggleRight size={36} strokeWidth={1.5} /> : <ToggleLeft size={36} strokeWidth={1.5} />}
                                    </button>
                                </div>

                                {/* Input Text Khusus FAB (Tampil hanya jika diaktifkan) */}
                                {formData.show_fab && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            value={formData.fab_text}
                                            onChange={(e) => setFormData({ ...formData, fab_text: e.target.value })}
                                            className="w-full px-5 py-3.5 rounded-full border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                            placeholder="Teks Tombol (Misal: Belanja Sekarang)"
                                        />
                                    </div>
                                )}
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
                    <div className="bg-slate-950 rounded-[2.5rem] border-[4px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[700px] animate-in fade-in zoom-in-95 duration-700 relative">

                        {/* Mockup Topbar (Dark) */}
                        <div className="bg-slate-900 px-6 py-3 flex items-center gap-2 border-b border-slate-800 z-20 relative">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="ml-4 flex-1 h-5 bg-slate-800/50 rounded-full"></div>
                        </div>

                        {/* Konten Footer (Preview) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 flex flex-col relative">

                            {/* Dummy Content Spacer to push footer down */}
                            <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center mb-8 bg-slate-900/50">
                                <span className="text-slate-700 font-bold text-sm">Konten Halaman Utama</span>
                            </div>

                            {/* FOOTER SECTION */}
                            <div className="border-t border-slate-800 pt-8 mt-auto relative z-10">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="">
                                        <img src={baseUrl + '/logo_usahaku.png'} className='w-12 rounded-lg' />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-tight">
                                        {formData.brand_name || 'Brand'}<span className="text-[#10B981]">{formData.brand_highlight || ''}</span>
                                    </span>
                                </div>

                                <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                                    {formData.brand_desc || 'Deskripsi brand Anda muncul di sini.'}
                                </p>

                                <div className="flex space-x-4 mb-8">
                                    {formData.social_fb && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800"><Facebook size={16} /></div>}
                                    {formData.social_tw && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800"><Twitter size={16} /></div>}
                                    {formData.social_ig && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800"><Instagram size={16} /></div>}
                                </div>

                                {/* Newsletter Mockup (Static) */}
                                <div className="mb-8 p-5 rounded-2xl border border-slate-800 bg-slate-900/50">
                                    <h4 className="text-white font-bold text-sm mb-2">Akses Eksklusif</h4>
                                    <div className="flex gap-2">
                                        <div className="flex-1 h-10 bg-slate-950 rounded-xl border border-slate-800"></div>
                                        <div className="w-16 h-10 bg-emerald-500 rounded-xl opacity-50"></div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-800 pt-6 pb-4 text-center">
                                    <p className="text-slate-500 font-medium text-xs">
                                        &copy; {new Date().getFullYear()} {formData.copyright}
                                    </p>
                                </div>
                            </div>

                            {/* FLOATING ACTION BUTTON (PREVIEW) */}
                            {formData.show_fab && (
                                <div className="absolute bottom-6 right-6 animate-in zoom-in duration-300 z-50">
                                    <button className="flex items-center gap-2 bg-[#10B981] hover:bg-emerald-400 text-slate-900 px-5 py-3.5 rounded-full shadow-lg shadow-emerald-500/20 font-bold text-sm transition-transform cursor-default">
                                        <MessageCircle size={18} />
                                        {formData.fab_text || 'E-commerce UMKM'}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </SuperAdminLayout>
    );
}