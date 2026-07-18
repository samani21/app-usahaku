"use client"
import Loading from '@/Components/Loading';
import { Post } from '@/utils/Post';
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail } from 'lucide-react';
import React, { useState } from 'react'

type Props = {
    themeStyles: any;
    showToast: (v: string, type: string) => void;
    activeScheme: any;
    theme: string
}

function ForgotView({ themeStyles, showToast, activeScheme, theme }: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showToast('Email wajib diisi', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const formData = { email: email };
            // Request diarahkan murni menggunakan email
            await Post('auth/forgot-password', formData);

            // Tampilkan pesan sukses generik demi keamanan
            showToast('Jika email terdaftar, link reset telah dikirim ke kotak masuk Anda.', 'success');
            setEmail(''); // Kosongkan input setelah sukses
        } catch (e: any) {
            showToast(e?.message || 'Terjadi kesalahan sistem', 'error');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='h-full flex flex-col justify-center'>
            <div className="animate-fadeIn">
                {/* Back Button */}
                <button
                    onClick={() => {
                        setIsLoading(true)
                        window.location.href = 'login'
                    }}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-100 mb-6 transition-colors"
                >
                    <ArrowLeft size={14} />
                    <span>Kembali ke Login</span>
                </button>

                <div className="mb-6">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeScheme.primary} flex items-center justify-center text-white mb-3 shadow-lg`}>
                        <KeyRound size={20} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight mb-1.5">Lupa Kata Sandi?</h3>
                    <p className={`text-xs ${themeStyles.textMuted} leading-relaxed`}>
                        Masukkan alamat email terdaftar Anda untuk menerima tautan instruksi pemulihan keamanan akun.
                    </p>
                </div>

                {/* Forgot Password Recovery Form (Email Only) */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1 animate-fadeIn">
                        <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Alamat Email Terdaftar</label>
                        <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                            <Mail size={15} className="text-slate-400" />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className={`w-full mt-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${activeScheme.primary} shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin w-4 h-4" />
                                <span>Mengirimkan Pemulihan...</span>
                            </>
                        ) : (
                            <>
                                <span>Kirim Link & Proses Reset</span>
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

export default ForgotView