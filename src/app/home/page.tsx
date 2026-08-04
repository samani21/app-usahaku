"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Menu, X, CheckCircle2, TrendingUp, ArrowRight,
    Facebook, Twitter, Instagram, Rocket, Sparkles,
    PlayCircle, Building, Store, Receipt,
    ShieldCheck, Users, Info, Loader2,
    ShoppingBag, MapPin, Smartphone, Fingerprint
} from 'lucide-react';

// Import Utility Fetcher (Sesuaikan dengan path project-mu)
import { Get } from '@/utils/Get';
import { Icon } from '@iconify/react';

// ==========================================
// 1. KOMPONEN SKELETON LOADING (MODERN UI)
// ==========================================
const LandingSkeleton = () => (
    <div className="min-h-screen bg-[#FAFAFA] w-full overflow-hidden animate-pulse">
        {/* Skeleton Header */}
        <div className="w-full h-24 px-6 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-32 h-8 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="hidden md:flex gap-8">
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
                <div className="w-16 h-4 bg-slate-200 rounded-full"></div>
            </div>
            <div className="w-36 h-12 bg-slate-200 rounded-full hidden md:block"></div>
        </div>

        {/* Skeleton Hero Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 flex flex-col items-center lg:items-start">
                <div className="w-48 h-8 bg-slate-200 rounded-full mb-4"></div>
                <div className="w-full max-w-md h-16 bg-slate-200 rounded-2xl"></div>
                <div className="w-3/4 max-w-sm h-16 bg-slate-200 rounded-2xl"></div>
                <div className="w-full max-w-lg h-24 bg-slate-200 rounded-xl mt-6"></div>
                <div className="flex gap-4 mt-8 w-full justify-center lg:justify-start">
                    <div className="w-48 h-14 bg-slate-200 rounded-xl"></div>
                    <div className="w-40 h-14 bg-slate-200 rounded-xl"></div>
                </div>
            </div>
            <div className="w-full h-[500px] bg-slate-200 rounded-[2.5rem] shadow-sm"></div>
        </div>
    </div>
);

// ==========================================
// 2. KOMPONEN UTAMA LANDING PAGE
// ==========================================
export default function LandingPage() {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    // State UI & UX
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    // State Data Fetching
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [pageData, setPageData] = useState<any>({
        hero: {},
        ecommerce: {},
        footer: {}
    });

    // ==========================================
    // INITIALIZATION & SINGLE FETCH API
    // ==========================================
    useEffect(() => {
        // Deteksi Scroll untuk Header
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Fetch 1 Endpoint Publik (Aggregator/BFF)
        const fetchLandingData = async () => {
            try {
                // Hit ke route public yang kita buat di Laravel
                const result = await Get<{ success: boolean; data: any }>('landing-page');

                if (result?.success && result.data) {
                    setPageData({
                        hero: result.data.hero || {},
                        feature: result.data.feature || {},
                        pricing: result.data.pricing || {},
                        ecommerce: result.data.ecommerce || {},
                        footer: result.data.footer || {}
                    });
                }
            } catch (error) {
                console.error("Gagal memuat data landing page:", error);
                // Biarkan pakai data kosong {}, karena di UI sudah kita handle dengan || 'Fallback Text'
            } finally {
                // Jeda sedikit untuk memastikan font & aset lain ikut ke-render estetik (0.8 detik)
                setTimeout(() => setIsPageLoading(false), 800);
            }
        };

        fetchLandingData();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleNavigation = async (path: string) => {
        if (loadingAction) return;

        try {
            setLoadingAction(path);
            setIsMobileMenuOpen(false);
            await router.push(path);
        } catch (error) {
            console.error('Navigasi gagal:', error);
            alert('Koneksi tidak stabil. Silakan coba beberapa saat lagi.');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || loadingAction) return;

        try {
            setLoadingAction('newsletter');
            await new Promise((resolve) => setTimeout(resolve, 1500));
            alert('Berhasil! Anda akan menerima insight bisnis premium dari kami.');
            setEmail('');
        } catch (error) {
            console.error('Newsletter error:', error);
            alert('Layanan sedang sibuk. Silakan coba lagi nanti.');
        } finally {
            setLoadingAction(null);
        }
    };

    // ==========================================
    // RENDER: TAMPILKAN SKELETON JIKA LOADING
    // ==========================================
    if (isPageLoading) {
        return <LandingSkeleton />;
    }

    // Ekstraksi data aman dengan fallback bawaan database / statik
    const hero = pageData.hero;
    const feature = pageData.feature;
    const pricing = pageData.pricing;
    const ecom = pageData.ecommerce;
    const footer = pageData.footer;

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 selection:bg-[#10B981]/30 selection:text-slate-900 overflow-x-hidden relative">

            {/* 1. HEADER SECTION */}
            <header className={`fixed w-full z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${scrolled ? 'top-4' : 'top-0'}`}>
                <div className={`max-w-7xl mx-auto transition-all duration-500 relative ${scrolled
                    ? 'bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-xl shadow-slate-200/20 rounded-full py-3 px-6 lg:px-8'
                    : 'bg-transparent border-transparent py-6 px-0'
                    }`}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleNavigation('/')}>
                            <div className="group-hover:shadow-emerald-500/40 transition-all duration-300">
                                <img src={`${baseUrl}/logo_usahaku.png`} className='w-12 rounded-xl' />
                            </div>
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {footer.brand_name || 'Usaha'}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-500">{footer.brand_highlight || 'Ku'}</span>
                            </span>
                        </div>

                        <nav className="hidden md:flex items-center gap-10">
                            <a href="#beranda" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Beranda</a>
                            <a href="#fitur" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Fitur</a>
                            <a href="#harga" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Harga</a>
                            <a href="#ecommerce" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">E-commerce</a>

                            <button
                                onClick={() => handleNavigation('/login')}
                                disabled={loadingAction === '/login'}
                                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                            >
                                {loadingAction === '/login' ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        Masuk Aplikasi
                                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </nav>

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-900 p-2 focus:outline-none bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {isMobileMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-3xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
                            <div className="px-6 py-8 space-y-4">
                                <a href="#beranda" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-slate-800 hover:text-[#10B981] transition-colors">Beranda</a>
                                <a href="#fitur" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-slate-800 hover:text-[#10B981] transition-colors">Fitur</a>
                                <a href="#harga" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-slate-800 hover:text-[#10B981] transition-colors">Harga</a>
                                <a href="#ecommerce" onClick={() => setIsMobileMenuOpen(false)} className="block text-lg font-semibold text-slate-800 hover:text-[#10B981] transition-colors">E-commerce</a>

                                <div className="pt-6 mt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => handleNavigation('/login')}
                                        disabled={loadingAction === '/login'}
                                        className="flex items-center justify-center w-full px-6 py-4 text-base font-bold text-white transition-all bg-gradient-to-r from-[#10B981] to-emerald-600 rounded-xl shadow-lg disabled:opacity-70"
                                    >
                                        {loadingAction === '/login' ? <Loader2 size={24} className="animate-spin" /> : 'Masuk Aplikasi'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* 2. HERO SECTION */}
            <section id="beranda" className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 animate-in fade-in duration-1000">
                    <div className="w-[600px] h-[600px] bg-gradient-to-tr from-[#10B981]/20 to-emerald-200/20 rounded-full blur-[100px] opacity-70 mix-blend-multiply pointer-events-none"></div>
                </div>
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 animate-in fade-in duration-1000">
                    <div className="w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/40 to-[#10B981]/10 rounded-full blur-[80px] opacity-70 mix-blend-multiply pointer-events-none"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
                        <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
                                <Sparkles size={16} className="text-[#10B981]" />
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{hero?.tagline || "Era Baru Bisnis Digital"}</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
                                {hero?.headline_1 || "Kelola, Jual &"} <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-emerald-400">{hero?.headline_2 || "Hasilkan Lebih."}</span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                                {hero?.description || 'Ekosistem all-in-one dengan kasir pintar, etalase kustom, dan sistem afiliasi cerdas yang siap mengalirkan omset ke rekening Anda.'}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => handleNavigation('/register')}
                                    disabled={loadingAction === '/register'}
                                    className="px-8 py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-[#10B981] to-emerald-600 shadow-xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:transform-none"
                                >
                                    {loadingAction === '/register' ? <Loader2 size={20} className="animate-spin" /> : (
                                        <>{hero?.cta_text || "Coba Gratis 14 Hari"} <ArrowRight size={20} /></>
                                    )}
                                </button>
                                <a
                                    href="#fitur"
                                    className="px-8 py-4 rounded-xl text-slate-700 bg-white border border-slate-200 shadow-sm font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center"
                                >
                                    Jelajahi Fitur
                                </a>
                            </div>
                        </div>

                        <div className="relative w-full mx-auto max-w-lg lg:max-w-none perspective-1000">
                            <div className="relative transform lg:rotate-y-[-10deg] lg:rotate-x-[5deg] transition-transform duration-700 hover:rotate-0">
                                <div className="relative z-20 w-full rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl p-6 ring-1 ring-slate-900/5">
                                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                        </div>
                                        <div className="h-6 w-32 bg-slate-100 rounded-md"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/10 to-emerald-50 border border-emerald-100/50">
                                            <div className="w-8 h-8 rounded-lg bg-[#10B981] text-white flex items-center justify-center mb-3">
                                                <TrendingUp size={16} />
                                            </div>
                                            <div className="h-4 w-16 bg-emerald-200 rounded mb-2"></div>
                                            <div className="h-6 w-24 bg-[#10B981]/80 rounded"></div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mb-3">
                                                <ShoppingBag size={16} />
                                            </div>
                                            <div className="h-4 w-16 bg-slate-100 rounded mb-2"></div>
                                            <div className="h-6 w-24 bg-slate-200 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="h-32 w-full rounded-xl bg-slate-50 border border-slate-100 relative overflow-hidden flex items-end px-4 gap-2 pt-8">
                                        {[40, 70, 45, 90, 60, 100, 80].map((height, i) => (
                                            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-[#10B981] to-emerald-300 opacity-80" style={{ height: `${height}%` }}></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute -right-8 top-12 z-30 w-52 p-4 rounded-xl bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 animate-bounce" style={{ animationDuration: '4s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#10B981]">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">Transaksi Berhasil!</div>
                                            <div className="text-xs text-slate-500">Rp 150.000 Masuk Kasir</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. FEATURE SECTION */}
            <section id="fitur" className="py-32 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-in slide-in-from-bottom-4 duration-700">
                        <h2 className="text-[#10B981] font-bold tracking-widest uppercase text-xs mb-4">Fitur Skala Enterprise</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{feature?.section_title || `Kekuatan di Balik ${footer.brand_name || 'UsahaKu'}`}</h3>
                        <p className="text-xl text-slate-500 leading-relaxed">{feature?.section_desc || "Dirancang dengan presisi tingkat tinggi untuk meminimalisir *human error* dan memaksimalkan kecepatan transaksi bisnis Anda."}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {feature?.items.map((feature: any, idx: number) => (
                            <div key={idx} className="group relative bg-[#FAFAFA] rounded-3xl p-8 hover:bg-white transition-all duration-300 border border-transparent hover:border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#10B981]/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <Icon icon={feature?.icon} className='text-[#10B981]' fontSize={24} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                                    <p className="text-slate-500 leading-relaxed text-base">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. PRICE SECTION */}
            <section id="harga" className="py-32 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-[#10B981] font-bold tracking-widest uppercase text-xs mb-4">Investasi Terjangkau</h2>
                        <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Pilih Tingkat Akses Anda</h3>
                        <p className="text-xl text-slate-500">Mulai gratis tanpa batasan fitur selama 14 hari. Lanjutkan jika aplikasi ini terbukti menaikkan omset Anda.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                        <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 hover:shadow-xl transition-all flex flex-col">
                            <div className="mb-8">
                                <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-slate-700 text-sm font-bold mb-4">Uji Coba Penuh</div>
                                <h4 className="text-3xl font-bold text-slate-900 mb-2">Gratis Trial</h4>
                                <p className="text-slate-500">Buktikan sendiri kehebatan sistem kami.</p>
                            </div>
                            <div className="mb-8 flex items-baseline gap-2">
                                <span className="text-6xl font-extrabold text-slate-900">Rp 0</span>
                                <span className="text-lg font-medium text-slate-500">/ {pricing?.trial_days || 14} Hari</span>
                            </div>
                            <ul className="space-y-5 mb-8 flex-grow">
                                {pricing?.trial_features.map((f: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <CheckCircle2 size={24} className="text-[#10B981] flex-shrink-0" />
                                        <span className="text-slate-600 font-medium">{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 items-start mb-8">
                                <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                    <b>Catatan:</b> Trial tidak butuh kartu kredit. Setelah masa trial habis, data aman.
                                </p>
                            </div>
                            <button
                                onClick={() => handleNavigation('/register')}
                                disabled={loadingAction === '/register'}
                                className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-50 border-2 border-slate-200 hover:bg-slate-100 transition-colors mt-auto disabled:opacity-70 flex justify-center items-center"
                            >
                                {loadingAction === '/register' ? <Loader2 size={20} className="animate-spin" /> : 'Mulai Trial Sekarang'}
                            </button>
                        </div>

                        <div className="relative p-[2px] rounded-[2rem] bg-gradient-to-b from-[#10B981] via-emerald-600 to-slate-800 shadow-2xl shadow-emerald-900/20 transform md:-translate-y-4 flex flex-col">
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-[#10B981] to-emerald-400 text-white text-sm font-bold px-6 py-1.5 rounded-full shadow-lg z-10">
                                PILIHAN TERBAIK
                            </div>
                            <div className="bg-slate-950 rounded-[calc(2rem-2px)] p-10 h-full relative overflow-hidden flex flex-col">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#10B981]/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-8">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-bold mb-4">
                                            <Sparkles size={14} /> Profesional
                                        </div>
                                        <h4 className="text-3xl font-bold text-white mb-2">Mitra UMKM</h4>
                                        <p className="text-slate-400">Amankan data usaha & buka keran penghasilan tambahan.</p>
                                    </div>
                                    <div className="mb-10">
                                        <div className="text-slate-500 line-through text-xl font-medium mb-1 decoration-red-500/70 decoration-2">Rp {pricing?.original_price?.toLocaleString("id-ID") || "50.000"}</div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-200">Rp {((pricing?.pro_price ?? 35000) / 1000)}k</span>
                                            <span className="text-lg font-medium text-slate-400">/ bln</span>
                                        </div>
                                    </div>
                                    <ul className="space-y-5 mb-10 flex-grow">
                                        {pricing?.pro_features.map((f: string, i: number) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <CheckCircle2 size={24} className="text-emerald-400 flex-shrink-0" />
                                                <span className="text-slate-300 font-medium">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleNavigation('/register?plan=pro')}
                                        disabled={loadingAction === '/register?plan=pro'}
                                        className="w-full py-4 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-[#10B981] to-emerald-400 hover:scale-[1.02] transition-transform mt-auto disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center shadow-lg shadow-emerald-500/25"
                                    >
                                        {loadingAction === '/register?plan=pro' ? <Loader2 size={20} className="animate-spin" /> : 'Lanjutkan Berlangganan'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. CTA E-COMMERCE SECTION (DATA DINAMIS) */}
            <section id="ecommerce" className="py-24 relative overflow-hidden border-t border-slate-200">
                <div className="absolute inset-0 bg-slate-900"></div>
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#10B981]/40 to-transparent rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto shadow-inner border border-white/20 mb-6">
                        <ShoppingBag size={32} />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                        {ecom.headline_1 || 'E-commerce'} <span className="text-emerald-400">{ecom.headline_2 || 'UMKM Lokal.'}</span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        {ecom.description || 'Temukan dan dukung berbagai produk unggulan dari UMKM yang ada di sekitar lokasi Anda. Belanja mudah, bisnis lokal berkembang.'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <button
                            onClick={() => handleNavigation('/ecommerce')}
                            disabled={loadingAction === '/ecommerce'}
                            className="px-8 py-4 flex justify-center items-center rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-900 font-bold text-lg shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loadingAction === '/ecommerce' ? <Loader2 size={24} className="animate-spin" /> : (ecom.btn_primary || 'Mulai Belanja')}
                        </button>
                        <button className="px-8 py-4 rounded-xl bg-slate-800/50 backdrop-blur-md border border-slate-700 text-white font-bold text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                            <MapPin size={20} /> {ecom.btn_secondary || 'Deteksi Lokasi Saya'}
                        </button>
                    </div>
                </div>
            </section>

            {/* 6. FOOTER SECTION (DATA DINAMIS) */}
            <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">

                        <div className="md:col-span-5 lg:col-span-4">
                            <div className="flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => handleNavigation('/')}>
                                <div className="rounded-lg bg-[#10B981]/20 text-[#10B981]">
                                    <img src={`${baseUrl}/logo_usahaku.png`} className='w-12 rounded-lg' />
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    {footer.brand_name || 'Usaha'}<span className="text-[#10B981]">{footer.brand_highlight || 'Ku'}</span>
                                </span>
                            </div>
                            <p className="text-slate-400 mb-8 leading-relaxed text-lg pe-8">
                                {footer.brand_desc || 'Merancang ulang cara Anda berbisnis. Ekosistem digital cerdas untuk pengusaha modern dan afiliator.'}
                            </p>
                            <div className="flex space-x-5">
                                {footer.social_fb && <a href={footer.social_fb} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 hover:bg-[#10B981] hover:text-white transition-all"><Facebook size={18} /></a>}
                                {footer.social_tw && <a href={footer.social_tw} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 hover:bg-[#10B981] hover:text-white transition-all"><Twitter size={18} /></a>}
                                {footer.social_ig && <a href={footer.social_ig} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 hover:bg-[#10B981] hover:text-white transition-all"><Instagram size={18} /></a>}
                            </div>
                        </div>

                        <div className="md:col-span-3 lg:col-span-2 lg:col-start-6">
                            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Produk</h4>
                            <ul className="space-y-4 font-medium">
                                <li><a href="#fitur" className="hover:text-[#10B981] transition-colors">Fitur Unggulan</a></li>
                                <li><a href="#harga" className="hover:text-[#10B981] transition-colors">Harga & Paket</a></li>
                                <li><a href="#ecommerce" className="hover:text-[#10B981] transition-colors">E-commerce UMKM</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Afiliasi</a></li>
                            </ul>
                        </div>

                        <div className="md:col-span-4 lg:col-span-2">
                            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Perusahaan</h4>
                            <ul className="space-y-4 font-medium">
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Pusat Bantuan</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Syarat Layanan</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Kebijakan Privasi</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Hubungi Kami</a></li>
                            </ul>
                        </div>

                        <div className="md:col-span-12 lg:col-span-3">
                            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Akses Eksklusif</h4>
                            <p className="text-slate-400 mb-6 font-medium">Dapatkan insight bisnis premium langsung di kotak masuk Anda.</p>
                            <form className="relative" onSubmit={handleNewsletterSubmit}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Alamat email Anda"
                                    required
                                    disabled={loadingAction === 'newsletter'}
                                    className="w-full bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loadingAction === 'newsletter'}
                                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg font-bold text-slate-900 bg-[#10B981] hover:bg-emerald-400 transition-colors flex items-center justify-center disabled:opacity-70"
                                >
                                    {loadingAction === 'newsletter' ? <Loader2 size={18} className="animate-spin" /> : 'Kirim'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 font-medium text-sm">
                            &copy; {new Date().getFullYear()} {footer.copyright || 'UsahaKu Inc. Hak Cipta Dilindungi.'}
                        </p>
                        <div className="flex items-center gap-2 font-medium text-slate-500 text-sm">
                            Didesain dengan <span className="text-[#10B981]">presisi</span> untuk Anda.
                        </div>
                    </div>
                </div>
            </footer>

            {/* FLOATING ACTION BUTTON (DATA DINAMIS) */}
            {footer.show_fab !== false && (
                <a
                    href="#ecommerce"
                    className="fixed bottom-6 right-6 z-[60] bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-white group animate-in zoom-in duration-500"
                    title={footer.fab_text || 'E-commerce UMKM'}
                >
                    <ShoppingBag size={24} />
                    <span className="hidden md:block font-black uppercase tracking-widest text-xs pr-2 overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
                        {footer.fab_text || 'E-commerce UMKM'}
                    </span>
                </a>
            )}
        </div>
    );
}