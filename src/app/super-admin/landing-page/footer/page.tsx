"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, Loader2,
    Facebook, Instagram, Youtube, AtSign, // AtSign dipakai untuk icon Threads
    Link as LinkIcon,
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
    social_ig: string;
    social_th: string; // Threads
    social_yt: string; // Youtube
    copyright: string;
}

interface ToastState {
    message: string;
    type: 'success' | 'error' | 'warning';
}

export default function FooterSectionSettings() {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
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
        social_ig: 'https://instagram.com/usahaku',
        social_th: 'https://threads.net/@usahaku',
        social_yt: 'https://youtube.com/@usahaku',
        copyright: 'UsahaKu Inc. Hak Cipta Dilindungi.'
    });

    // Helper Toast
    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ==========================================
    // FETCH DATA API (SAFE MOUNT PATTERN)
    // ==========================================
    useEffect(() => {
        let isMounted = true; 

        const fetchFooterData = async () => {
            try {
                const result = await Get<{ success: boolean; data: any }>('super-admin/footer/show');

                if (isMounted && result?.success && result.data) {
                    setFormData({
                        brand_name: result.data.brand_name || '',
                        brand_highlight: result.data.brand_highlight || '',
                        brand_desc: result.data.brand_desc || '',
                        social_fb: result.data.social_fb || '',
                        social_ig: result.data.social_ig || '',
                        social_th: result.data.social_th || '',
                        social_yt: result.data.social_yt || '',
                        copyright: result.data.copyright || ''
                    });
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Kesalahan memuat data footer:", error);
                    showToast("Gagal memuat data dari server.", "error");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchFooterData();

        return () => {
            isMounted = false; 
        };
    }, []);

    // ==========================================
    // HANDLERS API
    // ==========================================
    const handleSave = async () => {
        if (!formData.brand_name.trim() || !formData.brand_desc.trim() || !formData.copyright.trim()) {
            showToast('Nama Brand, Deskripsi, dan Hak Cipta wajib diisi!', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const result = await Post('super-admin/footer/update', formData);

            if (result) {
                showToast('Perubahan Footer & Global Berhasil Disimpan & Live!', 'success');
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Terjadi kesalahan jaringan.';
            showToast('Gagal menyimpan perubahan. ' + errorMsg, 'error');
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
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                        
                        {isSaving && (
                            <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center">
                                <Loader2 size={32} className="animate-spin text-emerald-500" />
                            </div>
                        )}

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
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Nama Brand <span className="text-rose-500">*</span></label>
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
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Deskripsi Footer <span className="text-rose-500">*</span></label>
                                <textarea
                                    rows={3}
                                    value={formData.brand_desc}
                                    onChange={(e) => setFormData({ ...formData, brand_desc: e.target.value })}
                                    className="w-full px-6 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">Teks Hak Cipta (Copyright) <span className="text-rose-500">*</span></label>
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

                    {/* KARTU 2: SOSIAL MEDIA */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                            <LinkIcon size={16} /> Sosial Media
                        </h2>

                        <div className="space-y-4">
                            {/* Facebook */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Facebook size={18} /></div>
                                <input type="text" value={formData.social_fb} onChange={(e) => setFormData({ ...formData, social_fb: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link Facebook" />
                            </div>
                            
                            {/* Instagram */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0"><Instagram size={18} /></div>
                                <input type="text" value={formData.social_ig} onChange={(e) => setFormData({ ...formData, social_ig: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link Instagram" />
                            </div>

                            {/* Threads (menggunakan icon AtSign) */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center shrink-0"><AtSign size={18} /></div>
                                <input type="text" value={formData.social_th} onChange={(e) => setFormData({ ...formData, social_th: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-800 focus:ring-4 focus:ring-slate-800/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link Threads" />
                            </div>

                            {/* Youtube */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0"><Youtube size={18} /></div>
                                <input type="text" value={formData.social_yt} onChange={(e) => setFormData({ ...formData, social_yt: e.target.value })} className="w-full px-5 py-3 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-sm font-medium text-slate-600" placeholder="Link YouTube" />
                            </div>
                        </div>
                    </div>

                </div>

                {/* BAGIAN KANAN: LIVE PREVIEW */}
                <div className="lg:col-span-6 lg:sticky lg:top-28">
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 px-4 text-center lg:text-left">
                        Live Preview (Pratinjau Langsung)
                    </h2>

                    <div className="bg-slate-950 rounded-[2.5rem] border-[4px] border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[700px] animate-in fade-in zoom-in-95 duration-700 relative">

                        <div className="bg-slate-900 px-6 py-3 flex items-center gap-2 border-b border-slate-800 z-20 relative">
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                            <div className="ml-4 flex-1 h-5 bg-slate-800/50 rounded-full"></div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 flex flex-col relative">

                            <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl flex items-center justify-center mb-8 bg-slate-900/50">
                                <span className="text-slate-700 font-bold text-sm">Konten Halaman Utama</span>
                            </div>

                            {/* FOOTER SECTION */}
                            <div className="border-t border-slate-800 pt-8 mt-auto relative z-10">
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="">
                                        <img src={baseUrl + '/logo_usahaku.png'} className='w-12 rounded-lg' alt="Logo" />
                                    </div>
                                    <span className="text-xl font-bold text-white tracking-tight">
                                        {formData.brand_name || 'Brand'}<span className="text-[#10B981]">{formData.brand_highlight || ''}</span>
                                    </span>
                                </div>

                                <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                                    {formData.brand_desc || 'Deskripsi brand Anda muncul di sini.'}
                                </p>

                                {/* Preview Social Media */}
                                <div className="flex space-x-4 mb-8">
                                    {formData.social_fb && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800 hover:text-blue-500 transition-colors"><Facebook size={16} /></div>}
                                    {formData.social_ig && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800 hover:text-pink-500 transition-colors"><Instagram size={16} /></div>}
                                    {formData.social_th && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800 hover:text-white transition-colors"><AtSign size={16} /></div>}
                                    {formData.social_yt && <div className="p-2 rounded-full bg-slate-900 text-slate-400 border border-slate-800 hover:text-red-500 transition-colors"><Youtube size={16} /></div>}
                                </div>

                                {/* Newsletter Mockup */}
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
                        </div>
                    </div>
                </div>

            </div>
        </SuperAdminLayout>
    );
}