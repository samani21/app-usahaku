"use client"
import Loading from '@/Components/Loading';
import { Get } from '@/utils/Get';
import { Post } from '@/utils/Post';
import { useCorrectPath } from '@/utils/useCorrectPath';
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Check,
    Eye,
    EyeOff,
    Lock,
    RefreshCw,
    X,
    Loader2
} from 'lucide-react';
import React, { useState, useEffect } from 'react'

type Props = {
    themeStyles: any;
    showToast: (v: string, type: string) => void;
    activeScheme: any;
    theme: string
}

function ResetView({ themeStyles, showToast, activeScheme, theme }: Props) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { getCorrectPath } = useCorrectPath();
    // State untuk menangani status Guard dari backend
    const [isValidatingToken, setIsValidatingToken] = useState<boolean>(true);
    const [tokenError, setTokenError] = useState<string | null>(null);

    const [form, setForm] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    // 1. Pengecekan Guard Token Saat Komponen Dimuat
    useEffect(() => {
        const validateToken = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');

                if (!token) {
                    setTokenError('Tautan reset kata sandi tidak valid atau tidak ditemukan');
                    setIsValidatingToken(false);
                    return;
                }

                const res = await Get<any>(`auth/check-forgot-password?token=${token}`);
                if (res) {
                    setTokenError(null);
                }
            } catch (error: any) {
                setTokenError(error?.message || 'Tautan tidak berlaku');
            } finally {
                setIsValidatingToken(false);
            }
        };

        validateToken();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // LOGIKA DI-UPDATE: Disesuaikan dengan standar keamanan baru (min:8)
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return { score: 0, label: 'Sangat Lemah', color: 'bg-rose-500' };
        let score = 0;
        if (pwd.length >= 8) score += 1; // Naik jadi 8 karakter
        if (pwd.length >= 12) score += 1; // Poin tambahan jika lebih dari 12
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score <= 2) return { score, label: 'Lemah', color: 'bg-rose-500' };
        if (score <= 4) return { score, label: 'Sedang', color: 'bg-amber-500' };
        return { score, label: 'Sangat Kuat', color: 'bg-emerald-500' };
    };

    const passStrength = getPasswordStrength(form.newPassword);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi Frontend sebelum ke Backend
        if (form.newPassword.length < 8) {
            showToast('Kata sandi minimal harus 8 karakter!', 'error');
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            showToast('Konfirmasi kata sandi tidak cocok!', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const formData = {
                token: token,
                password: form.confirmPassword
            };
            await Post('auth/reset-password', formData);
            showToast('Kata sandi berhasil diperbarui!', 'success');

            setTimeout(() => {
                window.location.href = getCorrectPath('/auth/login');
            }, 1500);
        } catch (error: any) {
            showToast(error?.message || 'Gagal mereset kata sandi', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    // Tampilan Loading saat memvalidasi Guard Backend
    if (isValidatingToken) {
        return (
            <div className='h-full flex flex-col justify-center items-center gap-4 animate-fadeIn'>
                <Loader2 size={32} className={`animate-spin ${activeScheme.text}`} />
                <p className={`text-xs font-semibold ${themeStyles.textMuted}`}>Memvalidasi keamanan tautan Anda...</p>
            </div>
        );
    }

    // Tampilan Error jika Guard Backend tertangkap (Token tidak valid/kedaluwarsa)
    if (tokenError) {
        return (
            <div className='h-full flex flex-col justify-center'>
                <div className="animate-fadeIn text-center">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5 shadow-lg">
                        <AlertTriangle size={28} className="text-rose-500" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-2">Tautan Tidak Berlaku</h3>
                    <p className={`text-xs ${themeStyles.textMuted} leading-relaxed mb-8 px-2`}>
                        {tokenError}
                    </p>
                    <button
                        onClick={() => window.location.href = getCorrectPath('/auth/forgot')}
                        className={`w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${activeScheme.primary} shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2`}
                    >
                        <span>Minta Tautan Baru</span>
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        );
    }

    // Tampilan Form Reset
    return (
        <div className='h-full flex flex-col justify-center'>
            <div className="animate-fadeIn">
                {/* Back Button */}
                <button
                    onClick={() => {
                        setIsLoading(true)
                        window.location.href = getCorrectPath('/auth/forgot')
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-100 mb-6 transition-colors"
                >
                    <ArrowLeft size={14} />
                    <span>Kembali ke Lupa Sandi</span>
                </button>

                <div className="mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeScheme.primary} flex items-center justify-center text-white mb-3 shadow-lg`}>
                        <RefreshCw size={20} className="animate-spin-slow" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-1.5">Reset Kata Sandi Anda</h3>
                    <p className={`text-xs ${themeStyles.textMuted} leading-relaxed`}>
                        Buat kata sandi baru yang kuat dan unik untuk menjamin keamanan workstation merchant Anda.
                    </p>
                </div>

                {/* Reset Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* New Password Input */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Kata Sandi Baru</label>
                        <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                            <Lock size={15} className="text-slate-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Minimal 8 karakter"
                                className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                                value={form.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
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

                        {/* Password Strength Indicator */}
                        {form.newPassword && (
                            <div className="pt-1.5 animate-fadeIn">
                                <div className="flex justify-between items-center text-[10px] font-bold mb-1">
                                    <span className="text-slate-400">Kekuatan Kata Sandi:</span>
                                    <span className={passStrength.score >= 5 ? 'text-emerald-500' : passStrength.score >= 3 ? 'text-amber-500' : 'text-rose-500'}>
                                        {passStrength.label}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${passStrength.color}`}
                                        style={{ width: `${Math.min((passStrength.score / 5) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm New Password Input */}
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Konfirmasi Kata Sandi Baru</label>
                        <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                            <Lock size={15} className="text-slate-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Ulangi kata sandi baru"
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

                        {/* Match Validation Alert */}
                        {form.confirmPassword && (
                            <div className="flex items-center gap-1.5 pt-1 animate-fadeIn">
                                {form.newPassword === form.confirmPassword ? (
                                    <>
                                        <Check size={12} className="text-emerald-500" />
                                        <span className="text-[10px] text-emerald-500 font-bold">Kata sandi cocok</span>
                                    </>
                                ) : (
                                    <>
                                        <X size={12} className="text-rose-500" />
                                        <span className="text-[10px] text-rose-500 font-bold">Kata sandi tidak cocok</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Reset Password Button */}
                    <button
                        type="submit"
                        disabled={isLoading || form.newPassword.length < 8 || form.newPassword !== form.confirmPassword}
                        className={`w-full mt-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${activeScheme.primary} shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" />
                                <span>Memproses Perubahan...</span>
                            </>
                        ) : (
                            <>
                                <span>Perbarui Kata Sandi</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </form>
            </div>
            {isLoading && <Loading />}
        </div>
    )
}

export default ResetView