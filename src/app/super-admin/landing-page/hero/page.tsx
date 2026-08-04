"use client"
import React, { useState, useCallback, useEffect } from 'react';
import {
    Sparkles, ArrowRight, Type, AlignLeft, MousePointerClick, Save, Loader2, AlertCircle
} from 'lucide-react';
import SuperAdminLayout from '../../Components/SuperAdminLayout';
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';

export default function HeroSectionSettings() {
    // ==========================================
    // STATE: HERO SECTION DATA & UI STATE
    // ==========================================
    const [formData, setFormData] = useState({
        tagline: '',
        headline_1: '',
        headline_2: '',
        description: '',
        cta_text: '',
    });

    const [isLoading, setIsLoading] = useState(false); // Loading saat klik simpan
    const [loading, setLoading] = useState<boolean>(true); // Loading saat load data awal
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // ==========================================
    // HANDLER: OPTIMASI PERFORMA & ANTISIPASI ERROR
    // ==========================================

    // Tarik data dari API saat halaman pertama kali di-load
    const fetchData = async () => {
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await Get<{
                success: boolean;
                data: {
                    tagline: string;
                    headline_1: string;
                    headline_2: string;
                    description: string;
                    cta_text: string;
                }
            }>('super-admin/hero-setting/show');

            if (res?.success && res?.data) {
                // Antisipasi Error: Fallback ke string kosong ('') jika ada data yang null dari DB
                // Agar tidak terjadi warning "A component is changing an uncontrolled input"
                setFormData({
                    tagline: res.data.tagline || '',
                    headline_1: res.data.headline_1 || '',
                    headline_2: res.data.headline_2 || '',
                    description: res.data.description || '',
                    cta_text: res.data.cta_text || '',
                });
            }
        } catch (error) {
            setErrorMessage('Gagal memuat data awal. Periksa koneksi atau coba muat ulang halaman.');
        } finally {
            setLoading(false);
        }
    };

    // Panggil fetchData hanya 1x saat komponen dipasang (Mount)
    useEffect(() => {
        fetchData();
    }, []);

    // Gunakan useCallback agar tidak re-render fungsi berkali-kali
    const handleChange = useCallback((e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        if (errorMessage) setErrorMessage('');
        if (successMessage) setSuccessMessage('');
    }, [errorMessage, successMessage]);

    const handleSave = async () => {
        // 1. Edge Case: Validasi Input Wajib (Sesuai validasi Backend: headline_1 wajib ada)
        if (!formData.headline_1.trim()) {
            setErrorMessage('Teks Biasa pada Judul Utama wajib diisi!');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const res = await Post<any, any>('super-admin/hero-setting/update', formData);

            // 2. Evaluasi status dari Backend
            if (res?.success) {
                setSuccessMessage('Perubahan berhasil disimpan!');
            }
        } catch (error: any) {
            setErrorMessage(error?.message || 'Gagal menyimpan data. Cek kembali inputan Anda.');
            // 3. Fallback jika API mati/gagal
            setErrorMessage('Terjadi kesalahan jaringan. Pastikan koneksi stabil atau coba lagi nanti.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SuperAdminLayout>
            <div className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* BAGIAN KIRI: FORM EDITOR */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 relative">

                        {/* Overlay Loading (UX Mulus) saat Load Data Awal */}
                        {loading && (
                            <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center">
                                <Loader2 size={32} className="animate-spin text-emerald-500 mb-2" />
                                <span className="text-sm font-bold text-slate-500">Memuat Data...</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                                Editor Konten
                            </h2>
                            <button
                                onClick={handleSave}
                                disabled={isLoading || loading}
                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>

                        {/* Notifikasi Error/Success */}
                        {errorMessage && (
                            <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in zoom-in duration-300">
                                <AlertCircle size={16} /> {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in zoom-in duration-300">
                                <Sparkles size={16} /> {successMessage}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Input: Tagline */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                    <Sparkles size={12} className="text-emerald-500" /> Label / Tagline
                                </label>
                                <input
                                    type="text"
                                    name="tagline"
                                    maxLength={50}
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800"
                                    placeholder="Contoh: Era Baru Bisnis Digital"
                                />
                            </div>

                            {/* Input: Headline 1 & 2 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <div className="sm:col-span-2">
                                    <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Type size={12} /> Konfigurasi Judul Utama
                                    </h3>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                        Teks Biasa <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="headline_1"
                                        maxLength={30}
                                        value={formData.headline_1}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 mb-2 pl-4">
                                        Teks Highlight (Hijau)
                                    </label>
                                    <input
                                        type="text"
                                        name="headline_2"
                                        maxLength={30}
                                        value={formData.headline_2}
                                        onChange={handleChange}
                                        className="w-full px-5 py-3.5 rounded-full border border-emerald-200 bg-emerald-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-black text-emerald-700 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Input: Description */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                    <AlignLeft size={12} /> Deskripsi Singkat
                                </label>
                                <textarea
                                    rows={4}
                                    name="description"
                                    maxLength={250}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none leading-relaxed"
                                    placeholder="Jelaskan penawaran utama Anda di sini..."
                                />
                            </div>

                            {/* Input: CTA Button */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                    <MousePointerClick size={12} /> Teks Tombol Aksi (CTA)
                                </label>
                                <input
                                    type="text"
                                    name="cta_text"
                                    maxLength={25}
                                    value={formData.cta_text}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BAGIAN KANAN: LIVE PREVIEW */}
                <div className="lg:col-span-6 lg:sticky lg:top-28">
                    <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-4 px-4 text-center lg:text-left">
                        Live Preview (Pratinjau Langsung)
                    </h2>

                    <div className="bg-white rounded-[2.5rem] border-[4px] border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-700">
                        {/* Mockup Topbar */}
                        <div className="bg-slate-100 px-6 py-3 flex items-center gap-2 border-b border-slate-200">
                            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <div className="ml-4 flex-1 h-5 bg-white rounded-full opacity-50"></div>
                        </div>

                        {/* Area Hero (Preview) */}
                        <div className="flex-1 bg-[#FAFAFA] p-8 sm:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-gradient-to-tr from-[#10B981]/20 to-emerald-200/20 rounded-full blur-[60px] opacity-70 pointer-events-none"></div>

                            {loading ? (
                                /* Skeleton Loading untuk Preview biar UX lebih mantap */
                                <div className="z-10 flex flex-col items-center w-full animate-pulse">
                                    <div className="h-8 w-32 bg-slate-200 rounded-full mb-6"></div>
                                    <div className="h-12 w-3/4 bg-slate-200 rounded-xl mb-4"></div>
                                    <div className="h-12 w-1/2 bg-emerald-100 rounded-xl mb-6"></div>
                                    <div className="h-20 w-4/5 bg-slate-200 rounded-xl mb-8"></div>
                                    <div className="h-10 w-40 bg-slate-200 rounded-xl"></div>
                                </div>
                            ) : (
                                <>
                                    {/* Fallback & Visual Safeguard */}
                                    {(formData.tagline || 'Tagline Disini') && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6 z-10 transition-all">
                                            <Sparkles size={12} className="text-[#10B981]" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 break-words">
                                                {formData.tagline || 'Tagline Disini'}
                                            </span>
                                        </div>
                                    )}

                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight z-10">
                                        {formData.headline_1 || 'Judul Utama'} <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">
                                            {formData.headline_2 || 'Teks Highlight'}
                                        </span>
                                    </h1>

                                    <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium max-w-sm z-10 break-words">
                                        {formData.description || 'Deskripsi singkat tentang bisnis atau produk Anda akan muncul di sini.'}
                                    </p>

                                    {(formData.cta_text || 'Tombol Aksi') && (
                                        <div className="px-6 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-emerald-600 shadow-lg shadow-emerald-500/30 z-10 cursor-not-allowed">
                                            {formData.cta_text || 'Tombol Aksi'} <ArrowRight size={16} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </SuperAdminLayout>
    );
}