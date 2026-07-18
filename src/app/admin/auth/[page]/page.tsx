"use client"
import { CheckCircle2, DollarSign, Moon, ShieldAlert, ShoppingBag, Sun, TrendingUp, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Loading from '@/Components/Loading';
import { Get } from '@/utils/Get';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import LoginView from './Components/LoginView';
import RegisterView from './Components/RegisterView';
import ForgotView from './Components/ForgotView';
import ResetView from './Components/ResetView';
import ModalOtp from './Components/ModalOTP';
import { useCorrectPath } from '@/utils/useCorrectPath';
type Props = {
    page: string
}
interface Toast {
    id: number;
    message: string;
    type: string;
}
function AuthView({ page }: Props) {
    const [theme, setTheme] = useState('light');
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter(); // Inisialisasi router Next.js
    const referral = searchParams.get("referral");

    const [toasts, setToasts] = useState<Toast[]>([]);
    const [showOtpModal, setShowOtpModal] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [autoResendOtp, setAutoResendOtp] = useState<boolean>(false);
    const { getCorrectPath } = useCorrectPath();
    const activeScheme = {
        primary: 'from-emerald-500 to-teal-600',
        text: 'text-emerald-500',
        textGrad: 'from-emerald-400 to-teal-400',
        border: 'border-emerald-500/20',
        bgLight: 'bg-emerald-500/10',
        glow: 'shadow-emerald-500/20',
        accentColor: '#10b981'
    };
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const themeStyles = {
        bg: theme === 'dark' ? 'bg-[#080911] text-slate-100' : 'bg-[#f5f7fc] text-slate-900',
        card: theme === 'dark' ? 'bg-[#101222]/90 border-slate-800/80 shadow-2xl' : 'bg-white/95 border-slate-200/80 shadow-xl',
        cardGlass: theme === 'dark' ? 'bg-slate-900/40 border-slate-800/50' : 'bg-slate-50/80 border-slate-200/60',
        input: theme === 'dark' ? 'bg-[#181a30]/60 border-slate-800/80 focus-within:border-emerald-500/50' : 'bg-slate-100/80 border-slate-200/80 focus-within:border-emerald-500/50',
        textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
        gridLines: theme === 'dark' ? 'stroke-slate-800/50' : 'stroke-slate-200/80',
        modalBg: theme === 'dark' ? 'bg-[#0e101f]/95 border-slate-800' : 'bg-white border-slate-200'
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        // Hanya panggil getProfile jika memang ada kemungkinan user sudah login
        if (Cookies.get('token')) {
            getProfile();
        }
    }, []);

    useEffect(() => {
        if (referral) {
            const ref = Cookies.get('referral');
            if (!ref) {
                Cookies.set('referral', referral, { expires: 10, secure: true, sameSite: 'strict' }); // Tambah security flag
            }
        }
    }, [referral]);

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
                    router.push(getCorrectPath('/')); // Gunakan router Next.js untuk UX yang mulus
                    return; // Hentikan eksekusi di sini
                }
                setAutoResendOtp(true);
                setShowOtpModal(res.user);
            }
        } catch (e: any) {
            // Antisipasi Error: Jika token invalid, bersihkan state
            Cookies.remove('token');
        } finally {
            setLoading(false);
        }
    };

    const views = () => {
        switch (params.page) {
            case "login":
                return <LoginView activeScheme={activeScheme} showToast={showToast} themeStyles={themeStyles} theme={theme} />;
            case "register":
                return <RegisterView activeScheme={activeScheme} showToast={showToast} themeStyles={themeStyles} theme={theme} setShowOtpModal={setShowOtpModal} />;
            case "forgot":
                return <ForgotView activeScheme={activeScheme} showToast={showToast} themeStyles={themeStyles} theme={theme} />;
            case "reset-password":
                return <ResetView activeScheme={activeScheme} showToast={showToast} themeStyles={themeStyles} theme={theme} />;
            default:
                return "";
        }
    }
    return (
        <div className={`min-h-screen ${themeStyles.bg} flex flex-col items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden  transition-colors duration-500`}>
            {/* <div className={`absolute top-0 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 pointer-events-none transition-all duration-1000 bg-emerald-600`}></div>
            <div className="absolute bottom-0 left-10 w-[350px] h-[350px] rounded-full blur-[120px] opacity-10 bg-blue-600 pointer-events-none"></div> */}
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
                    <div className="hidden lg:block lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-slate-500/[0.02] border-r border-slate-500/10">
                        <div className={`absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-tr ${theme === 'dark' ? 'from-slate-950 via-slate-900/60 to-transparent' : 'from-slate-100 via-white/80 to-transparent'} pointer-events-none z-0`} />
                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className={`bg-gradient-to-tr w-12 h-12 flex items-center justify-start text-white font-black text-base shadow-lg`}>
                                        <img src={`${baseUrl}/logo_usahaku.png`} className='rounded-xl w-12 h-12' />
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold tracking-tight leading-none">UsahaKu</h1>
                                        <span className="text-[10px] text-slate-400 font-mono tracking-wider">Go Digital</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                                    Satu platform untuk <br />
                                    <span className={`bg-gradient-to-r ${activeScheme.textGrad} bg-clip-text text-transparent`}>
                                        Kelola Seluruh Bisnis Anda.
                                    </span>
                                </h2>
                                <p className={`text-xs ${themeStyles.textMuted} mt-3 max-w-md leading-relaxed`}>
                                    Hubungkan operasional merchant, manajemen POS kasir, inventaris barang, hingga rekonsiliasi keuangan instan di workstation tepercaya.
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
                                        <span className="text-[9px] font-mono tracking-wider text-slate-400">usahaku-workstation.live</span>
                                        <div className="w-6" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2.5 mb-4">

                                        <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Pendapatan</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <DollarSign className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                                <span className="text-[11px] font-bold">142.8M</span>
                                            </div>
                                            <span className="text-[7px] text-emerald-500 font-bold block mt-0.5">+14.2%</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Transaksi</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <ShoppingBag className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                                <span className="text-[11px] font-bold">12,490</span>
                                            </div>
                                            <span className="text-[7px] text-emerald-500 font-bold block mt-0.5">+8.1%</span>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/5">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Pelanggan</span>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Users className={`w-3.5 h-3.5 ${activeScheme.text}`} />
                                                <span className="text-[11px] font-bold">2,481</span>
                                            </div>
                                            <span className="text-[7px] text-amber-500 font-bold block mt-0.5">+1.9%</span>
                                        </div>
                                    </div>
                                    <div className="h-28 w-full bg-slate-500/5 rounded-xl border border-slate-500/5 p-3 flex flex-col justify-between relative overflow-hidden">
                                        <div className="flex justify-between items-center z-10">
                                            <span className="text-[8px] text-slate-400 block uppercase font-mono">Tren Analitik Penjualan</span>
                                            <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-mono font-bold">Live Sync</span>
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
                                            <path d="M 0 80 Q 20 40, 40 65 T 80 30 T 100 20 L 100 95 L 0 95 Z" fill="url(#chartGrad)" />
                                            <path d="M 0 80 Q 20 40, 40 65 T 80 30 T 100 20" fill="none" stroke={activeScheme.accentColor} strokeWidth="1.8" />
                                        </svg>
                                        <div className="flex justify-between text-[7px] text-slate-400 mt-auto z-10 pt-1 font-mono">
                                            <span>Sen</span>
                                            <span>Sel</span>
                                            <span>Rab</span>
                                            <span>Kam</span>
                                            <span>Jum</span>
                                            <span>Sab</span>
                                            <span>Ahd</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-8 bg-emerald-500 text-white text-[9px] font-extrabold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-bounce duration-[3000ms]">
                                    <TrendingUp size={11} />
                                    <span>Sistem Stabil 99.9%</span>
                                </div>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-slate-500/5 border border-slate-500/5 flex items-center justify-between">
                                <div>
                                    <span className="text-[8px] text-slate-400 block uppercase tracking-wider font-bold">Outlet Terdaftar</span>
                                    <p className="text-xs font-black truncate max-w-[200px]">
                                        100
                                    </p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-[9px] text-slate-400 font-semibold uppercase">Tersinkronisasi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-start">
                        <div className='flex items-center justify-end w-full'>
                            <button
                                onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
                                className={`p-2 rounded-xl border transition-all ${theme === 'dark'
                                    ? 'bg-slate-800/40 border-slate-800 text-yellow-400 hover:bg-slate-800'
                                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                                    }`}
                            >
                                {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                            </button>
                        </div>
                        {views()}
                    </div>
                </div>
                {
                    showOtpModal && <ModalOtp
                        activeScheme={activeScheme}
                        showToast={showToast}
                        themeStyles={themeStyles}
                        onClose={() => {
                            setShowOtpModal(false);
                            Cookies.remove("token")
                            showToast('Verifikasi OTP dibatalkan.', 'error');
                        }}
                        showOtpModal={showOtpModal}
                        autoResendOtp={autoResendOtp} />
                }
            </div>
            {/* Animation Rules */}
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
            {
                loading && <Loading />
            }
        </div>
    )
}

export default AuthView