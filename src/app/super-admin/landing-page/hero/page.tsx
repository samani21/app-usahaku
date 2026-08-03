"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Save, LayoutTemplate, Loader2, ArrowLeft,
    Sparkles, ArrowRight, Type, AlignLeft, MousePointerClick
} from 'lucide-react';

export default function HeroSectionSettings() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    // ==========================================
    // STATE: HERO SECTION DATA
    // ==========================================
    const [formData, setFormData] = useState({
        tagline: 'Era Baru Bisnis Digital',
        headline_1: 'Kelola, Jual &',
        headline_2: 'Hasilkan Lebih.',
        description: 'Ekosistem all-in-one dengan kasir pintar, etalase kustom, dan sistem afiliasi cerdas yang siap mengalirkan omset ke rekening Anda.',
        cta_text: 'Coba Gratis 14 Hari',
    });

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleSave = async () => {
        setIsSaving(true);
        // TODO: Hit API Endpoint untuk menyimpan data Hero Section
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        alert('Perubahan Hero Section Berhasil Disimpan!');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">

            {/* HEADER KAPSUL */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all active:scale-95 border border-slate-200"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                                <LayoutTemplate className="text-emerald-500" size={20} />
                                Hero Section
                            </h1>
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mt-0.5">
                                Pengaturan Landing Page
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span className="hidden sm:inline">Simpan Perubahan</span>
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT (SPLIT LAYOUT) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* BAGIAN KIRI: FORM EDITOR */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-slate-100 pb-4">
                            Editor Konten
                        </h2>

                        <div className="space-y-6">
                            {/* Input: Tagline */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 pl-4">
                                    <Sparkles size={12} className="text-emerald-500" /> Label / Tagline
                                </label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
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
                                        Teks Biasa
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.headline_1}
                                        onChange={(e) => setFormData({ ...formData, headline_1: e.target.value })}
                                        className="w-full px-5 py-3.5 rounded-full border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-bold text-slate-800 shadow-sm"
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
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    value={formData.cta_text}
                                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
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

                    {/* Frame Preview Bergaya Window */}
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

                            {/* Background Effect */}
                            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-gradient-to-tr from-[#10B981]/20 to-emerald-200/20 rounded-full blur-[60px] opacity-70 pointer-events-none"></div>

                            {/* Tagline */}
                            {formData.tagline && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6 z-10">
                                    <Sparkles size={12} className="text-[#10B981]" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                                        {formData.tagline}
                                    </span>
                                </div>
                            )}

                            {/* Headline */}
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight z-10">
                                {formData.headline_1} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">
                                    {formData.headline_2}
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium max-w-sm z-10">
                                {formData.description}
                            </p>

                            {/* CTA Button */}
                            {formData.cta_text && (
                                <div className="px-6 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-emerald-600 shadow-lg shadow-emerald-500/30 z-10 cursor-not-allowed">
                                    {formData.cta_text} <ArrowRight size={16} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}