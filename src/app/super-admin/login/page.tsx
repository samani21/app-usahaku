"use client"
import { ArrowRight, CheckCircle2, DollarSign, Eye, EyeOff, Loader2, Lock, Mail, ShieldAlert, Activity, Database, Users, X, Server } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Loading from '@/Components/Loading';
import { Get } from '@/utils/Get';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { useCorrectPath } from '@/utils/useCorrectPath';
import { Post } from '@/utils/Post';

type Props = {
    page?: string
}

interface Toast {
    id: number;
    message: string;
    type: string;
}

function SuperAdminAuthView({ page }: Props) {
    const router = useRouter();

    const [toasts, setToasts] = useState<Toast[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { getCorrectPath } = useCorrectPath();

    // Tema dikembalikan ke Emerald
    const activeScheme = {
        primary: 'from-emerald-500 to-teal-600',
        text: 'text-emerald-600',
        textGrad: 'from-emerald-500 to-teal-500',
        border: 'border-emerald-500/20',
        bgLight: 'bg-emerald-500/10',
        glow: 'shadow-emerald-500/20',
        accentColor: '#10b981' // emerald-500
    };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // Light mode di-hardcode (permanen)
    const themeStyles = {
        bg: 'bg-[#f5f7fc] text-slate-900',
        card: 'bg-white border-slate-200/80 shadow-xl',
        cardGlass: 'bg-slate-50/80 border-slate-200/60',
        input: 'bg-slate-100/80 border-slate-200/80 focus-within:border-emerald-500/50',
        textMuted: 'text-slate-500',
        gridLines: 'stroke-slate-200/80',
        modalBg: 'bg-white border-slate-200'
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (Cookies.get('token')) {
            getProfile();
        }
    }, []);

    const showToast = (message: string, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    };

    const getProfile = async () => {
        setLoading(true);
        try {
            const res = await Get<any>('auth/profile');
            if (res?.user) {
                if (res.user.is_active) {
                    router.push(getCorrectPath('/'));
                    return;
                }
            }
        } catch (e: any) {
            Cookies.remove('token');
        } finally {
            setLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = {
                email: form.email,
                password: form.password
            };
            const res = await Post<any, any>('auth/login', formData);

            Cookies.set('token', res?.token, { expires: 365, path: '/' });

            if (res?.user?.is_active && (res?.user?.role === 'superadmin')) {
                window.location.href = getCorrectPath('/');
            } else if (res?.user?.is_active) {
                window.location.href = getCorrectPath('/');
            } else {
                window.location.reload();
            }

        } catch (e: any) {
            const errorMsg = e?.message || 'Terjadi kesalahan sistem atau akses ditolak';
            showToast(errorMsg, 'error');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`min-h-screen ${themeStyles.bg} flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden transition-colors duration-500`}>
            <div className="fixed top-5 md:right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
                {toasts.map((toast: any) => (
                    <div key={toast.id} className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slideIn ${toast.type === 'error'
                        ? 'bg-rose-500 border-rose-500/30 text-white'
                        : 'bg-emerald-500 border-emerald-500/30 text-white'
                        }`}>
                        {toast.type === 'error' ? <ShieldAlert className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                        <p className="text-xs font-semibold flex-1 leading-relaxed">{toast.message}</p>
                        <button onClick={() => setToasts((prev: any) => prev.filter((t: any) => t.id !== toast.id))} className="text-white hover:text-slate-200">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="max-w-6xl w-full z-10 flex flex-col gap-4">
                <div className={`grid lg:grid-cols-12 gap-0 rounded-[32px] overflow-hidden border ${themeStyles.card} transition-all duration-1000 transform translate-y-0 `}>

                    {/* Panel Kiri - Identitas Super Admin */}
                    <div className="hidden lg:block lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-slate-500/[0.02] border-r border-slate-500/10">
                        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-tr from-slate-100 via-white/80 to-transparent pointer-events-none z-0" />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="bg-gradient-to-tr w-12 h-12 flex items-center justify-start text-white font-black text-base shadow-lg rounded-xl overflow-hidden">
                                        <img src={`${baseUrl}/logo_usahaku.png`} alt="Logo" className='w-full h-full object-cover' />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold tracking-tight leading-none">UsahaKu</h1>
                                        <span className={`text-[10px] ${activeScheme.text} font-mono tracking-wider font-bold`}>SUPER ADMIN OMNI</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                                    Sistem Manajemen Pusat <br />
                                    <span className={`bg-gradient-to-r ${activeScheme.textGrad} bg-clip-text text-transparent`}>
                                        Infrastruktur & Tenant.
                                    </span>
                                </h2>
                                <p className={`text-xs ${themeStyles.textMuted} mt-3 max-w-md leading-relaxed`}>
                                    Akses eksklusif untuk memantau performa server, mengelola seluruh tenant, mengatur langganan (billing), dan konfigurasi inti sistem UsahaKu.
                                </p>
                            </div>

                            <div className="w-full relative flex items-center justify-center py-4">
                                <div className={`w-full max-w-md rounded-2xl border ${themeStyles.cardGlass} p-4 shadow-xl backdrop-blur-md relative overflow-hidden`}>
                                    <div className="flex items-center justify-between border-b border-slate-500/10 pb-3 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                                        </div>
                                        <span className="text-[9px] font-mono tracking-wider text-slate-400">admin.store-usahaku.com</span>
                                        <div className="w-6" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                                        <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Total GMV</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <DollarSign className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                                <span className="text-[11px] font-bold">2.4B</span>
                                            </div>
                                            <span className="text-[7px] text-emerald-600 font-bold block mt-0.5">All Tenants</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Tenant Aktif</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Database className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                                <span className="text-[11px] font-bold">1,204</span>
                                            </div>
                                            <span className="text-[7px] text-emerald-600 font-bold block mt-0.5">+12 Hari Ini</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Total User</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Users className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                                <span className="text-[11px] font-bold">48.2k</span>
                                            </div>
                                            <span className="text-[7px] text-emerald-600 font-bold block mt-0.5">Sistem Global</span>
                                        </div>
                                    </div>

                                    <div className="h-28 w-full bg-slate-500/5 rounded-xl border border-slate-500/5 p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="flex justify-between items-center z-10">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Beban Server (CPU & RAM)</span>
                                            <span className="text-[8px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-mono font-bold">Real-time</span>
                                        </div>
                                        <svg className="absolute inset-0 w-full h-full p-2 mt-4 z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={activeScheme.accentColor} stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor={activeScheme.accentColor} stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <line x1="0" y1="20" x2="100" y2="20" className={themeStyles.gridLines} strokeWidth="0.5" strokeDasharray="3 3" />
                                            <line x1="0" y1="50" x2="100" y2="50" className={themeStyles.gridLines} strokeWidth="0.5" strokeDasharray="3 3" />
                                            <line x1="0" y1="80" x2="100" y2="80" className={themeStyles.gridLines} strokeWidth="0.5" strokeDasharray="3 3" />
                                            <path d="M 0 60 Q 20 40, 40 55 T 80 40 T 100 30 L 100 95 L 0 95 Z" fill="url(#chartGrad)" />
                                            <path d="M 0 60 Q 20 40, 40 55 T 80 40 T 100 30" fill="none" stroke={activeScheme.accentColor} strokeWidth="1.8" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-8 bg-emerald-600 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce duration-[3000ms]">
                                    <Activity size={11} />
                                    <span>Server Status: Normal 99.9%</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/5 flex items-center justify-between">
                                <div>
                                    <span className="text-[8px] text-slate-400 block uppercase tracking-wider font-bold">Node Terkoneksi</span>
                                    <p className="text-xs font-black truncate max-w-[200px]">
                                        4/4 Cluster Aktif
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Synchronized</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel Kanan - Form Login */}
                    <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="animate-fadeIn mb-6 mt-8 lg:mt-0">
                            <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-bold border border-emerald-500/20 uppercase tracking-widest">
                                <Server size={12} /> Root Access
                            </div>
                            <h3 className="text-xl font-bold tracking-tight mb-1.5">
                                Masuk ke Portal Super Admin
                            </h3>
                            <p className={`text-xs ${themeStyles.textMuted} leading-relaxed`}>
                                Harap gunakan kredensial administrator tingkat atas untuk mengakses dashboard kontrol utama.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Email Administrator</label>
                                <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                                    <Mail size={15} className="text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="admin@sys.usahaku.com"
                                        className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                                        value={form.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">Kata Sandi Akses</label>
                                <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border ${themeStyles.input} transition-all`}>
                                    <Lock size={15} className="text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Masukkan kata sandi root"
                                        className="bg-transparent w-full border-none outline-none text-xs font-semibold focus:ring-0 placeholder:text-slate-500"
                                        value={form.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !form.email || !form.password}
                                className={`w-full mt-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r ${activeScheme.primary} shadow-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        <span>Verifikasi Root...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Otorisasi Akses</span>
                                        <ArrowRight size={14} />
                                    </>
                                )}
                            </button>
                        </form>

                        {isLoading && <Loading />}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-15px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {loading && <Loading />}
        </div>
    )
}

export default SuperAdminAuthView;