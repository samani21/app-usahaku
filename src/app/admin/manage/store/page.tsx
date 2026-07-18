"use client"
import React, { useState } from "react";

import {
    MapPin, Save, Camera, Verified, Globe, Eye,
    Briefcase, Tag, ChevronRight, Clock, BanIcon, Store, Crown, Zap, Sparkles, AlertCircle, AlertTriangle, Ban,
    Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import SlugInput from "./Components/SlugInput";
import Link from "next/link";
import Loading from "@/Components/Loading";
import MapPreview from "@/Components/Maps/MapPreview";
import { CardContent } from "@/Components/ui/Outlite";
import Alert from "@/Components/Alert";
import ModalSubscription from "@/Components/Layout/ModalSubscription";
import { formatImage } from "@/utils/formatImage";
import { useBusinessProfile } from "./Components/useBusinessProfile";
import MainLayout from "@/Components/Layout/MainLayout";


export default function BusinessProfile() {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const { loading, planStatus, planType, logoPreview, onLogoChange, form, isBusiness, getCorrectPath, loadingButton, handleSave, handleChange, categories, setIsSubscriptionModalOpen, daysRemaining, setOpenCrop, getCroppedImg, imageSrc, setLogoPreview, showAlert, isSubscriptionModalOpen, outlets, openCrop, setLogoFile, setShowAlert } = useBusinessProfile();
    if (loading) {
        return <Loading />
    }

    // Variabel Pembantu Logika Tampilan
    const isExpired = planStatus === 'expired' || planStatus === 'canceled';
    const isPremium = planStatus === 'active' && planType === 'premium';
    const isTrial = planStatus === 'active' && planType === 'trial';

    return (
        <MainLayout>
            <div className="mt-8  mx-auto lg:px-8 bg-slate-50 min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 pb-24 lg:pb-12"
                >
                    {/* --- Header Profil Bisnis --- */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-8 relative">
                        {/* --- Banner Latar Belakang --- */}
                        <div className={`h-40 md:h-48 w-full relative transition-colors duration-500 
        ${isPremium ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
                                : isExpired ? 'bg-gradient-to-br from-rose-900 via-red-900 to-rose-950'
                                    : 'bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600'}`}>

                            {/* Tekstur/Pattern Halus */}
                            <div className="absolute inset-0 bg-black/10 mix-blend-overlay opacity-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>

                            {/* Banner Badges (Pojok Kanan Atas) */}
                            <div className="absolute top-4 right-4 md:top-5 md:right-5 flex flex-col gap-2">
                                {isPremium && (
                                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg">
                                        <Crown size={16} className="text-amber-400 fill-amber-400/50" />
                                        Premium Active
                                    </div>
                                )}
                                {isExpired && (
                                    <div className="bg-red-900/60 backdrop-blur-md border border-red-400/30 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg">
                                        <AlertTriangle size={16} className="text-red-300" />
                                        {planType === 'premium' ? 'Premium Kedaluwarsa' : 'Trial Habis'}
                                    </div>
                                )}
                                {isTrial && (
                                    <div className="bg-white/20 backdrop-blur-md border border-white/40 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-bold shadow-lg">
                                        <Zap size={16} className="text-amber-200 fill-amber-200" />
                                        Masa Trial
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- Area Konten Utama --- */}
                        <div className="px-5 md:px-8 pb-6 md:pb-8">
                            {/* PERBAIKAN: Margin minus (-mt) dihapus dari parent ini */}
                            <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-6 relative z-10">

                                {/* 1. Avatar / Logo */}
                                {/* PERBAIKAN: Margin minus dipindah ke sini biar cuma logo yang naik */}
                                <div className="relative group inline-flex self-start -mt-16 md:-mt-20">
                                    <div className={`w-28 h-28 md:w-36 md:h-36 rounded-[1.5rem] md:rounded-[2rem] bg-white p-1.5 md:p-2 shadow-xl transition-transform duration-300 group-hover:-translate-y-1 ${isExpired ? 'border-2 border-red-100' : 'border border-slate-100'}`}>
                                        <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.5rem] bg-slate-50 flex items-center justify-center overflow-hidden relative">
                                            {logoPreview ? (
                                                <img
                                                    src={formatImage(logoPreview)}
                                                    alt="Logo Toko"
                                                    className={`w-full h-full object-cover transition-all duration-300 ${isExpired ? 'grayscale-[50%] contrast-125' : ''}`}
                                                />
                                            ) : (
                                                <Store size={40} className="text-slate-300 md:w-12 md:h-12" />
                                            )}
                                            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                <span className="text-white font-bold text-xs md:text-sm tracking-wide">Ubah Logo</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input id="logo" type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
                                    <label htmlFor="logo" className="absolute -bottom-2 -right-2 md:bottom-0 md:right-0 p-2.5 md:p-3 bg-emerald-600 text-white rounded-xl md:rounded-2xl shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all active:scale-95 cursor-pointer ring-4 ring-white">
                                        <Camera size={18} className="md:w-5 md:h-5" />
                                    </label>
                                </div>

                                {/* 2. Info Dasar & Aksi */}
                                {/* PERBAIKAN: Ditambah md:pb-2 biar teks dan tombol rata bawah dengan logo */}
                                <div className="flex-1 flex flex-col md:flex-row md:justify-between md:items-center gap-5 mt-3 md:mt-0 md:pb-2">

                                    {/* Kiri: Nama & Badges */}
                                    <div className="space-y-3">
                                        {/* Baris Nama & Icon Verifikasi */}
                                        <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
                                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                                                {form.name || "Nama Bisnis Anda"}
                                            </h1>
                                            <div className="flex items-center gap-2">
                                                {isBusiness && form.verified == 2 && planType == 'premium' ? <Verified size={22} className="text-blue-50 fill-blue-500" /> :
                                                    isBusiness && form.verified == 1 ? <Clock size={20} className="text-amber-500" /> :
                                                        isBusiness && form.verified == 0 ? <BanIcon size={20} className="text-red-500" /> : ''}
                                            </div>
                                        </div>

                                        {/* Baris Status & URL */}
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                            {/* Chip Status */}
                                            {isTrial ? (
                                                <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <Zap size={14} className="fill-slate-400" /> Trial
                                                </span>
                                            ) : isPremium ? (
                                                <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <Crown size={14} className="fill-amber-500 text-amber-500" /> Premium
                                                </span>
                                            ) : (
                                                <span className="bg-red-50 border border-red-200 text-red-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                    <Ban size={14} className="text-red-500" /> Tidak Aktif
                                                </span>
                                            )}

                                            {/* Chip URL */}
                                            <Link
                                                href={`/${form.slug}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600 font-medium hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all group"
                                            >
                                                <Globe size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                                <span className="truncate max-w-[180px] md:max-w-xs">
                                                    usahaku.com/{form.slug || "slug"}
                                                </span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Kanan: Tombol Aksi (Desktop) */}
                                    <div className="hidden lg:flex items-center gap-3">
                                        <Link href={getCorrectPath('/catalog/preview')} className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm">
                                            <Eye size={18} />
                                            Pratinjau
                                        </Link>
                                        <button
                                            disabled={loadingButton}
                                            onClick={handleSave}
                                            className="disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                                        >
                                            <Save size={18} />
                                            {loadingButton ? "Menyimpan..." : "Simpan Profil"}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* --- Main Content Grid --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                        {/* KOLOM KIRI (Form Profil) */}
                        <div className="lg:col-span-2 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <div className="p-6 md:p-8 border-b border-slate-100 flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                        <Briefcase size={22} />
                                    </div>
                                    <div>
                                        <h2 className="font-extrabold text-slate-900 text-xl">Informasi Dasar Bisnis</h2>
                                        <p className="text-sm text-slate-500 mt-0.5">Kelola identitas publik dan deskripsi utama bisnis Anda.</p>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        {/* Input Nama Bisnis */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Nama Toko/Bisnis</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="namaBisnis"
                                                    value={form.name}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                    className="w-full px-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm md:text-base font-semibold text-slate-800 placeholder:font-normal"
                                                    placeholder="Contoh: Kedai Kopi Senja"
                                                />
                                            </div>
                                        </div>

                                        {/* Input Slug */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">URL / Tautan Khusus</label>
                                            <SlugInput form={form.slug} onChange={(e) => handleChange("slug", e)} />
                                        </div>
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Deskripsi Singkat</label>
                                        <textarea
                                            rows={4}
                                            name="description"
                                            value={form.description ?? ''}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm md:text-base font-medium text-slate-700 resize-none leading-relaxed"
                                            placeholder="Tuliskan nilai jual, sejarah, atau produk utama yang ditawarkan bisnis Anda..."
                                        ></textarea>
                                    </div>

                                    {/* Kategori & Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Kategori Usaha</label>
                                            <div className="relative group">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                                <select
                                                    name="category"
                                                    value={form.category ?? 'Lainnya'}
                                                    onChange={(e) => handleChange("category", e.target.value)}
                                                    className="w-full pl-11 pr-10 py-3.5 bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none appearance-none cursor-pointer text-sm font-semibold text-slate-700 transition-all shadow-sm"
                                                >
                                                    {
                                                        categories?.map((c, i) => (
                                                            <option value={c?.name} key={i}>{c?.name}</option>
                                                        ))
                                                    }
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={18} />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Status Verifikasi</label>
                                            {isBusiness && form.verified === 2 ? (
                                                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
                                                    <Verified size={20} className="fill-blue-500 text-white" />
                                                    <span className="text-blue-800 font-bold text-sm">Terverifikasi Resmi</span>
                                                </div>
                                            ) : isBusiness && form.verified === 1 ? (
                                                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-100 shadow-sm">
                                                    <Clock size={20} className="text-amber-500" />
                                                    <span className="text-amber-800 font-bold text-sm">Menunggu Tinjauan</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-red-50 border border-red-100 shadow-sm">
                                                    <BanIcon size={20} className="text-red-500" />
                                                    <span className="text-red-800 font-bold text-sm">Langganan Habis</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* KOLOM KANAN (Status Paket & Lokasi) */}
                        <div className="space-y-6">

                            {/* 1. Kartu Status Berlangganan (TRIAL / PREMIUM / EXPIRED) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={`rounded-[2rem] border overflow-hidden relative shadow-lg ${isPremium ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'
                                    : isExpired ? 'bg-white border-red-200'
                                        : 'bg-white border-slate-200'
                                    }`}
                            >
                                {/* Dekorasi Khusus Premium */}
                                {isPremium && (
                                    <div className="absolute -top-12 -right-12 opacity-20 rotate-12">
                                        <Crown size={150} className="text-amber-400" />
                                    </div>
                                )}

                                <div className="p-6 relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        {isPremium ? (
                                            <>
                                                <Crown size={20} className="text-amber-400 fill-amber-400/20" />
                                                <h3 className="font-bold text-white text-lg tracking-wide">Premium Plan</h3>
                                            </>
                                        ) : isExpired ? (
                                            <>
                                                <AlertCircle size={20} className="text-red-500" />
                                                <h3 className="font-bold text-slate-800 text-lg">Perhatian</h3>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} className="text-emerald-500" />
                                                <h3 className="font-bold text-slate-800 text-lg">Status Paket</h3>
                                            </>
                                        )}
                                    </div>

                                    {/* KONDISI: EXPIRED (Habis Masa Aktif) */}
                                    {isExpired ? (
                                        <div className="space-y-4">
                                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                                                <AlertTriangle size={24} className="text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-bold text-red-800 mb-1">Paket Tidak Aktif</p>
                                                    <p className="text-xs text-red-600 leading-relaxed">Masa berlangganan Anda telah habis. Beberapa fitur unggulan toko kini dibatasi.</p>
                                                </div>
                                            </div>
                                            {/* <ul className="space-y-2 text-sm text-slate-400 font-medium opacity-80 pl-1">
                                            <li className="flex items-center gap-2 line-through decoration-slate-300"><Ban size={14} className="text-slate-300" /> Etalase Produk Terkunci</li>
                                            <li className="flex items-center gap-2 line-through decoration-slate-300"><Ban size={14} className="text-slate-300" /> Pengaturan Multi-Cabang</li>
                                            <li className="flex items-center gap-2 line-through decoration-slate-300"><Ban size={14} className="text-slate-300" /> Analitik Penjualan Lanjut</li>
                                        </ul> */}
                                            <button onClick={() => setIsSubscriptionModalOpen(true)} className="w-full mt-4 bg-slate-900 text-white rounded-xl py-3.5 font-bold shadow-lg hover:shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                                <Zap size={18} className="fill-white" /> Perpanjang Paket Sekarang
                                            </button>
                                        </div>
                                    ) : isTrial ? (
                                        // KONDISI: TRIAL
                                        <div className="space-y-4">
                                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                                                <p className="text-sm text-slate-600 mb-2">Masa aktif trial Anda tersisa:</p>
                                                <div className="flex items-end gap-1 text-emerald-600">
                                                    <span className="text-3xl font-black leading-none">{daysRemaining}</span>
                                                    <span className="font-bold text-sm mb-1">Hari Lagi</span>
                                                </div>
                                            </div>
                                            {/* <ul className="space-y-2.5 text-sm text-slate-600 font-medium">
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Fitur Etalase Lengkap</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-300" /> Multi-Cabang / Outlet</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-slate-300" /> Analitik Penjualan</li>
                                        </ul> */}
                                            <button onClick={() => setIsSubscriptionModalOpen(true)} className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                                <Crown size={18} className="fill-amber-200" /> Upgrade ke Premium
                                            </button>
                                        </div>
                                    ) : (
                                        // KONDISI: PREMIUM
                                        <div className="space-y-4">
                                            <p className="text-slate-300 text-sm">Anda menikmati semua fitur terbaik kami tanpa batas.</p>
                                            {/* <ul className="space-y-2.5 text-sm text-amber-100/80 font-medium">
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Multi-Cabang / Outlet Terbuka</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Laporan Analitik Real-time</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Lencana Verified (Prioritas)</li>
                                        </ul> */}
                                            <div className="bg-white/10 rounded-xl p-3 border border-white/10 mt-4 flex justify-between items-center backdrop-blur-sm">
                                                <span className="text-xs text-slate-300 font-medium">Masa Aktif:</span>
                                                <span className="text-xs font-bold text-white tracking-wider">Sisa {daysRemaining} hari </span>
                                            </div>
                                            {
                                                daysRemaining < 7 && (
                                                    <button onClick={() => setIsSubscriptionModalOpen(true)} className="w-full  px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center">
                                                        <Wallet className="w-4 h-4 mr-2" /> Perpanjang
                                                    </button>
                                                )
                                            }
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* 2. Kartu Lokasi & Outlet */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-auto"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                                                <MapPin size={20} />
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-lg">Lokasi Fisik / Outlet</h3>
                                        </div>
                                    </div>

                                    <div className={`relative rounded-2xl overflow-hidden border bg-slate-50 mb-5 shadow-inner ${isExpired ? 'border-red-100' : 'border-slate-200'}`}>
                                        {/* Overlay Blur jika Expired */}
                                        {isExpired && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center">
                                                <div className="bg-white px-4 py-2 rounded-full shadow border border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-600">
                                                    <Ban size={16} className="text-red-500" /> Terkunci
                                                </div>
                                            </div>
                                        )}

                                        {outlets?.find((a) => a?.lat != 0 && a?.lng != 0) ? (
                                            <div className="relative z-10 h-48 w-full">
                                                <MapPreview addresses={outlets} />
                                            </div>
                                        ) : (
                                            <CardContent className="w-full h-40 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                                                <div className="p-4 bg-white rounded-full shadow-sm mb-1">
                                                    <MapPin size={24} className="text-slate-300" />
                                                </div>
                                                <span>Belum ada pin lokasi yang diset.</span>
                                            </CardContent>
                                        )}
                                    </div>

                                    {outlets && outlets.length > 0 && (
                                        <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                                            {outlets.map((o, i) => (
                                                <div key={i} className={`p-4 rounded-2xl border transition-all ${isExpired ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-slate-50 border-slate-200 hover:border-emerald-300 hover:shadow-md'}`}>
                                                    <p className="text-sm text-slate-800 mb-3"><span className="font-extrabold text-emerald-600">{o?.name}</span> • <span className="text-slate-500">{o?.address}</span></p>
                                                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                        <div className="w-1/2">
                                                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Buka</p>
                                                            <p className="text-xs font-bold text-slate-700">{o?.day_open} <span className="text-slate-500 font-medium ml-1">({o?.time_open})</span></p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-200"></div>
                                                        <div className="w-1/2">
                                                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Tutup</p>
                                                            <p className="text-xs font-bold text-slate-700">{o?.day_close} <span className="text-slate-500 font-medium ml-1">({o?.time_close})</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        href={isExpired ? '#' : 'outlets'}
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold border-2 rounded-xl transition-all group ${isExpired
                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-emerald-600'
                                            }`}
                                    >
                                        {isExpired ? 'Fitur Terkunci' : 'Kelola Lokasi Cabang'}
                                        {!isExpired && <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />}
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* --- Floating Bottom Bar (Khusus Mobile) --- */}
                    <div className="fixed bottom-6 left-4 right-4 flex lg:hidden items-center justify-between gap-3 bg-white/80 backdrop-blur-xl p-3 rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 z-50">
                        <button className="flex-1 flex justify-center items-center gap-2 py-3.5 bg-white text-slate-700 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
                            <Eye size={18} />
                        </button>
                        <button disabled={loadingButton} onClick={handleSave} className="flex-[3] flex justify-center items-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:text-slate-500">
                            <Save size={18} />
                            {loadingButton ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </motion.div>

                {/* Modal Crop */}
                {openCrop && (
                    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-100 p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 md:p-8 rounded-[2.5rem] w-full max-w-md space-y-6 shadow-2xl"
                        >
                            <div className="text-center">
                                <h3 className="font-extrabold text-slate-900 text-xl">Sesuaikan Logo</h3>
                                <p className="text-sm text-slate-500 mt-1">Geser dan zoom gambar untuk mendapatkan komposisi pas.</p>
                            </div>

                            <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200">
                                <Cropper
                                    image={imageSrc!}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(_, croppedAreaPixels) =>
                                        setCroppedAreaPixels(croppedAreaPixels)
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors" onClick={() => setOpenCrop(false)}>
                                    Batal
                                </button>
                                <button
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                                    onClick={async () => {
                                        const croppedImage = await getCroppedImg(
                                            imageSrc!,
                                            croppedAreaPixels
                                        );
                                        setLogoPreview(croppedImage);
                                        const blob = await fetch(croppedImage).then(r => r.blob());
                                        const file = new File([blob], "logo.jpg", {
                                            type: "image/jpeg",
                                        });
                                        setLogoFile(file);
                                        setOpenCrop(false);
                                    }}
                                >
                                    Terapkan Gambar
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Alert */}
                {showAlert?.isOpen && (
                    <Alert type={showAlert?.type} message={showAlert?.message} onClose={() => setShowAlert(null)} />
                )}

                {
                    isSubscriptionModalOpen &&
                    <ModalSubscription onClose={() => setIsSubscriptionModalOpen(false)} />
                }
            </div>
        </MainLayout>
    );
}