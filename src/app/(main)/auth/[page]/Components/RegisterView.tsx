"use client"
import Loading from '@/Components/Loading';
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';
import { ArrowRight, Building, Eye, EyeOff, Loader2, Lock, Mail, Phone, Tag, User, Globe, CheckCircle2, XCircle, Ticket } from 'lucide-react';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import ModalOtp from './ModalOTP';
import Cookies from 'js-cookie';
type Props = {
    themeStyles: any;
    showToast: (v: string, type: string) => void;
    activeScheme: any;
    theme: string;
    setShowOtpModal: Dispatch<SetStateAction<boolean>>;
}

function RegisterView({ themeStyles, showToast, activeScheme, theme, setShowOtpModal }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // State untuk mengecek ketersediaan slug
    const [isCheckingSlug, setIsCheckingSlug] = useState<boolean>(false);
    const [slugStatus, setSlugStatus] = useState<'idle' | 'available' | 'taken'>('idle');
    const ref = Cookies.get('referral');
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '', // State konfirmasi password baru
        ownerName: '',
        tenantName: '',
        slug: '',
        whatsapp: '',
        referralCode: '',
    });

    useEffect(() => {
        if (ref) {
            setForm(prev => ({ ...prev, referralCode: ref }))
        }
    }, [ref])

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Handler WhatsApp dengan auto-format ke 628
    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;

        // Hapus karakter selain angka dan plus
        val = val.replace(/[^0-9+]/g, '');

        // Auto-format awalan ke 628
        if (val.startsWith('08')) {
            val = '628' + val.slice(2);
        } else if (val.startsWith('8')) {
            val = '628' + val.slice(1);
        } else if (val.startsWith('+628')) {
            val = '628' + val.slice(4);
        }

        // Hapus sisa karakter plus (jika ada) untuk hasil akhir
        val = val.replace(/[^0-9]/g, '');

        handleInputChange('whatsapp', val);
    };

    // Handler khusus untuk Slug
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        handleInputChange('slug', val);
        setSlugStatus('idle');
    };

    // Debounce effect untuk mengecek ketersediaan slug ke backend
    useEffect(() => {
        if (form.slug.length < 3) {
            setSlugStatus('idle');
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setIsCheckingSlug(true);
            try {
                const res = await Get<{ success: boolean }>(`/check-slug?slug=${form.slug}`);
                if (res?.success) {
                    setSlugStatus('available');
                }
            } catch (error) {
                setSlugStatus('taken');
            } finally {
                setIsCheckingSlug(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [form.slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        // Validasi Slug
        if (slugStatus === 'taken') {
            showToast('URL Katalog sudah digunakan, mohon cari yang lain.', 'error');
            setIsLoading(false)
            return;
        }

        // Validasi Konfirmasi Password
        if (form.password !== form.confirmPassword) {
            showToast('Kata sandi dan konfirmasi tidak cocok!', 'error');
            setIsLoading(false)
            return;
        }
        try {
            const formData = new FormData();
            formData.append('email', form?.email);
            formData.append('name', form?.ownerName);
            formData.append('whatsapp', form?.whatsapp);
            formData.append('password', form?.confirmPassword);
            formData.append('slug', form?.slug);
            formData.append('business_name', form?.tenantName);
            formData.append('code_ref', ref ?? form?.referralCode);
            const res = await Post<any, any>('/auth/register', formData)
            Cookies.set("token", res?.token, { expires: 365 });
            setShowOtpModal(res?.user);
        } catch (e: any) {
            showToast(e?.message, 'error');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='h-full flex flex-col justify-center'>
            <div className="mb-6">
                <h3 className="text-xl font-bold tracking-tight mb-1.5">
                    Pendaftaran Merchant Baru
                </h3>
                <p className={`text-xs ${themeStyles.textMuted} leading-relaxed`}>
                    Dapatkan lisensi workstation instan untuk memulai digitalisasi tenant Anda
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1 animate-fadeIn">
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Nama Lengkap Owner</label>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                        <User size={15} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="cth. Hendra Wijaya"
                            className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                            value={form.ownerName}
                            onChange={(e) => handleInputChange('ownerName', e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Nama Bisnis / Tenant</label>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                        <Building size={15} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="cth. Kopi Senja Utama"
                            className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                            value={form.tenantName}
                            onChange={(e) => handleInputChange('tenantName', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* --- BAGIAN INPUT SLUG --- */}
                <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">URL Katalog Bisnis</label>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} ${slugStatus === 'taken' ? 'border-red-500/50' : slugStatus === 'available' ? 'border-emerald-500/50' : ''} transition-all`}>
                        <Globe size={15} className="text-slate-400 shrink-0" />
                        <div className="flex flex-1 items-center overflow-hidden">
                            <input
                                type="text"
                                placeholder="toko-sepatu"
                                className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500 truncate"
                                value={form.slug}
                                onChange={handleSlugChange}
                                required
                            />
                            <span className="text-xs font-semibold text-slate-400 shrink-0 select-none">
                                .usahaku.com
                            </span>
                        </div>
                        <div className="shrink-0">
                            {isCheckingSlug && <Loader2 size={15} className="text-slate-400 animate-spin" />}
                            {!isCheckingSlug && slugStatus === 'available' && <CheckCircle2 size={15} className="text-emerald-500" />}
                            {!isCheckingSlug && slugStatus === 'taken' && <XCircle size={15} className="text-red-500" />}
                        </div>
                    </div>
                    {slugStatus === 'taken' && (
                        <p className="text-[10px] text-red-500 font-medium animate-fadeIn">URL ini sudah dipakai. Silakan gunakan nama lain.</p>
                    )}
                    {slugStatus === 'available' && (
                        <p className="text-[10px] text-emerald-500 font-medium animate-fadeIn">URL tersedia dan siap digunakan!</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Alamat Email</label>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                        <Mail size={15} className="text-slate-400" />
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                            value={form.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* --- BAGIAN INPUT WHATSAPP --- */}
                <div className="space-y-1 animate-fadeIn">
                    <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">No. WhatsApp Aktif</label>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                        <Phone size={15} className="text-slate-400" />
                        <input
                            type="tel"
                            placeholder="628XXXXXXXXXX"
                            className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                            value={form.whatsapp}
                            onChange={handleWhatsappChange}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
                            Kode Referral
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium italic">Opsional</span>
                    </div>
                    <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                        <Tag size={16} className="text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="CONTOH: USAHAKU50"
                            className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                            value={form.referralCode}
                            onChange={(e) => setForm(prev => ({ ...prev, referralCode: e.target.value.toUpperCase() }))}
                        />
                    </div>
                    <div className="flex items-start gap-1.5 mt-1.5 px-1">
                        <Ticket size={12} className="text-emerald-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <p className="text-[9.5px] text-emerald-500/90 font-medium leading-relaxed">
                                Masukkan kode untuk mendapat <span className="font-bold">potongan harga berlangganan</span> dari Rp 50.000 menjadi <span className="font-bold text-emerald-600 underline decoration-emerald-500/40 underline-offset-2">Rp 35.000</span>.
                                <span className="block mt-1.5 mb-1">
                                    <span className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wide border border-emerald-500/20">
                                        ✨ Flat Sampai Kapanpun
                                    </span>
                                </span>
                            </p>
                            <p className="text-[9px] text-slate-400">
                                Belum punya kode? Gunakan <button type="button" onClick={() => handleInputChange('referralCode', 'USAHAKU50')} className="font-bold text-emerald-500 hover:text-emerald-400 underline decoration-dashed transition-colors">USAHAKU50</button>
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN INPUT PASSWORD --- */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Kata Sandi</label>
                        <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                            <Lock size={15} className="text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Masukkan kata sandi"
                                className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                                value={form.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-slate-400 hover:text-slate-200"
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {/* --- BAGIAN KONFIRMASI PASSWORD BARU --- */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Konfirmasi Kata Sandi</label>
                        <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                            <Lock size={15} className="text-slate-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Ulangi kata sandi"
                                className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                                value={form.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-slate-400 hover:text-slate-200"
                            >
                                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || slugStatus === 'taken' || isCheckingSlug}
                    className={`w-full mt-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${activeScheme.primary} shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin w-4 h-4" />
                            <span>Mengotentikasi...</span>
                        </>
                    ) : (
                        <>
                            <span>Daftar</span>
                            <ArrowRight size={14} />
                        </>
                    )}
                </button>
            </form>
            <div className="mt-6 text-center">
                <p className="text-xs text-slate-400 font-semibold">
                    Sudah memiliki lisensi tenant?
                    <button
                        type="button"
                        onClick={() => {
                            setIsLoading(true)
                            window.location.href = 'login'
                        }}
                        className={`font-black underline underline-offset-4 decoration-2 ${activeScheme.text} ml-1`}
                    >
                        Login
                    </button>
                </p>
            </div>
            {
                isLoading && <Loading />
            }

        </div>
    )
}

export default RegisterView