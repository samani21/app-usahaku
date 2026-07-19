"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Image as ImageIcon,
    Grid,
    Package,
    CreditCard,
    Eye,
    Sun,
    Moon,
    ChevronLeft,
    Bell,
    Dock,
    Store,
    ArrowRightToLine,
    Navigation,
    X
} from 'lucide-react';

import { Get } from '@/utils/Get';
import { Catalog } from '@/types/Admin/Catalog/Catalog';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { useCorrectPath } from '@/utils/useCorrectPath';
import Loading from '@/Components/Loading';

import HeaderView from './View/HeaderView';
import HeroView from './View/HeroView';
import CategoriesView from './View/CategoryView';
import ProductView from './View/ProductView';
import SummaryView from './View/SummaryView';

// Menu definitions extracted outside component to prevent re-creation on every render
const MENU_ITEMS = [
    { id: 'Header', label: 'Header', icon: Dock },
    { id: 'Hero/Banner', label: 'Hero/Banner', icon: ImageIcon },
    { id: 'Kategori', label: 'Kategori', icon: Grid },
    { id: 'Produk dan Modal', label: 'Produk dan Modal', icon: Package },
    { id: 'Ringkasan Pembayaran', label: 'Ringkasan Pembayaran', icon: CreditCard },
    { id: 'Preview', label: 'Preview', icon: Eye },
];

export default function CatalogPage() {
    const router = useRouter();
    const { getCorrectPath } = useCorrectPath();

    // States
    const [activeMenu, setActiveMenu] = useState<string>("Header");
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true); // Default true agar skeleton/loading muncul duluan
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true }); // passive true untuk performa
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Dark Mode Effect (UX)
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            root.style.setProperty('--mode-primary', '#020617');
            root.style.setProperty('--mode-secondary', '#f8fafc');
        } else {
            root.classList.remove('dark');
            root.style.setProperty('--mode-primary', '#f8fafc');
            root.style.setProperty('--mode-secondary', '#020617');
        }
    }, [isDarkMode]);

    // Fetch Data (Memoized for Performance)
    const fetchCatalog = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const res = await Get<{ success: boolean; data: Catalog }>('client/catalog');

            if (res?.success) {
                setCatalog(res.data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Gagal memuat katalog:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCatalog();
    }, [fetchCatalog]);

    // Toast Handler (Edge Case: Cepat ditutup)
    const triggerToast = useCallback((message: string) => {
        setToastMessage(message);
        const timer = setTimeout(() => setToastMessage(null), 4000);
        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }, []);

    const handleCart = async (p: ProductsType | null, v: Variants | null, qty: number) => {
        triggerToast(`✓ Berhasil ditambah ke keranjang  ${p?.name} ${v ? `(${v?.name})` : ''}`);
    };

    // Render Sub-pages
    const renderPage = () => {
        if (error) {
            return (
                <div className={`mt-10 p-8 rounded-3xl border-2 border-dashed flex flex-col items-center text-center transition-all ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white shadow-sm'}`}>
                    <div className={`mb-6 p-4 rounded-full ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                        <Store size={48} className="text-amber-500" />
                    </div>
                    <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        Profil Bisnis Belum Siap
                    </h2>
                    <p className={`max-w-md mb-8 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Sepertinya Anda belum melengkapi informasi toko atau terjadi gangguan server. Silakan lengkapi profil bisnis Anda untuk mulai mengatur katalog.
                    </p>
                    <Link href={getCorrectPath('/admin/manage/store')}
                        className="group flex items-center gap-2 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
                    >
                        Lengkapi Profil Bisnis
                        <ArrowRightToLine size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            );
        }

        const commonProps = {
            isDarkMode,
            setIsDarkMode,
            getCalog: fetchCatalog // tetap menggunakan nama prop yang sama agar sub-komponen tidak error
        };

        switch (activeMenu) {
            case "Header":
                return <HeaderView themeDark={isDarkMode} setThemeDark={setIsDarkMode} headerData={catalog?.header ?? null} getCalog={fetchCatalog} />;
            case "Hero/Banner":
                return <HeroView {...commonProps} heroData={catalog?.hero ?? null} />;
            case "Kategori":
                return <CategoriesView {...commonProps} categoriesData={catalog?.category ?? null} categories={catalog?.categories ?? []} />;
            case "Produk dan Modal":
                return <ProductView {...commonProps} productData={catalog?.product ?? null} productsData={catalog?.products ?? []} handleCart={handleCart} />;
            case "Ringkasan Pembayaran":
                return <SummaryView {...commonProps} summaryData={catalog?.summary ?? null} />;
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-[120vh] transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-[#f8fafc]'} font-sans`}>

            {/* Header / Top Bar */}
            <header className={`fixed top-0 w-full z-[101] transition-all duration-300 ${scrolled
                ? `py-3 ${isDarkMode ? 'bg-[#020617]/80 border-b border-slate-800' : 'bg-white/80'} backdrop-blur-md shadow-sm`
                : 'py-6 bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push(getCorrectPath('/admin/manage/store'))}
                            className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-100'}`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <h1 className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Katalog
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className={`p-2 rounded-lg ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
                            <Bell size={20} />
                        </button>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`p-2.5 rounded-xl transition-all shadow-inner ${isDarkMode ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-900 text-white'}`}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto sm:px-6 pt-20 pb-20">
                {/* Floating Navigation Card - DRY Applied */}
                <div className={`rounded-2xl border transition-all duration-300 ${isDarkMode
                    ? 'bg-slate-900/50 border-slate-800 backdrop-blur-xl'
                    : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
                    }`}>
                    <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar p-3">
                        {MENU_ITEMS.map((item) => {
                            const isActive = activeMenu === item.id;
                            const Icon = item.icon;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        if (item.id === 'Preview') {
                                            router.push(getCorrectPath('/catalog/preview'));
                                        } else {
                                            setActiveMenu(item.id);
                                        }
                                    }}
                                    className={`relative flex items-center gap-2.5 px-6 py-3 text-sm transition-all duration-300 rounded-xl whitespace-nowrap ${isActive
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 font-semibold scale-105'
                                        : isDarkMode
                                            ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className={`relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 ${isDarkMode ? 'border-slate-900' : 'border-white'}`}></span>
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {renderPage()}
            </main>

            {/* Toast Component */}
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[101] bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in border border-zinc-800">
                    <div className="bg-zinc-800 p-1.5 rounded-lg text-zinc-300">
                        <Navigation className="w-4 h-4 animate-bounce" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold pr-2">{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="text-zinc-400 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {loading && <Loading title='Sedang Proses' />}

            {/* Style kustom untuk menyembunyikan scrollbar */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}