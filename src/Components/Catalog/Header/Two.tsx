"use client"

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X, ChevronRight } from 'lucide-react';
import LogoContainer from './LogoContainer';
import { FrameTheme, FrameType } from './FrameType';
import { useCorrectPath } from '@/utils/useCorrectPath';

type Props = {
    themeMode: string;
    spanOne?: string;
    spanTwo?: string;
    toggleTheme: () => void;
    frameType: FrameType;
    frameTheme: FrameTheme;
    logoImage: string | null;
    isBuild?: boolean;
    displayMode: string;
    openScan: () => void;
};

const Two = ({
    themeMode,
    spanOne,
    spanTwo,
    toggleTheme,
    frameType,
    frameTheme,
    logoImage,
    isBuild,
    displayMode,
    openScan
}: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic (Dioptimasi dengan useMemo)
    const pathname = usePathname();
    const { outlet } = useParams();

    const { getCorrectPath } = useCorrectPath();
    // Optimasi URL Logic dengan useMemo agar tidak direkalkulasi setiap render
    const historyLink = useMemo(() => {
        if (isBuild) return "#";
        return `${getCorrectPath('/history')}`;
    }, [isBuild, pathname, outlet]);

    // State Local untuk Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Kunci scroll saat menu terbuka (Dengan pengamanan SSR Next.js)
    useEffect(() => {
        if (typeof document === 'undefined') return;

        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'unset';
            }
        };
    }, [isMobileMenuOpen]);

    return (
        <header className={`${!isBuild ? 'absolute top-4 md:top-6 left-0 px-4' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-300`}>

            {/* Wrapper Relative agar Dropdown menempel sejajar dengan Pill Container */}
            <div className="relative w-full max-w-5xl pointer-events-auto">

                {/* --- INNER PILL CONTAINER --- */}
                <div className={`relative z-20 flex items-center justify-between p-1.5 pl-5 md:pl-6 rounded-full border backdrop-blur-xl transition-all duration-500 ease-out ${isDarkMode
                    ? 'bg-slate-900/70 border-slate-700/60 shadow-[0_10px_40px_rgba(0,0,0,0.4)]'
                    : 'bg-white/80 border-white shadow-[0_10px_40px_rgba(0,0,0,0.08)]'
                    }`}>
                    {/* --- KIRI: Logo & Tipografi --- */}
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 mr-4">
                        {logoImage && (
                            <div className="hover:rotate-[15deg] hover:scale-110 transition-all duration-300 ease-out cursor-pointer drop-shadow-md">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-xs md:text-sm font-extrabold uppercase tracking-[0.2em] truncate cursor-default">
                            <span className={`${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{spanOne}</span>
                            <span className="text-[var(--header-primary-color)] ml-1">{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Modul Ikon Desktop --- */}
                    <div className={`hidden md:flex items-center rounded-full px-1.5 py-1.5 gap-1 transition-colors duration-300 ${isDarkMode ? 'bg-white/10' : 'bg-slate-900/5'}`}>
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle Theme Mode"
                                className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-white/20 text-yellow-400' : 'hover:bg-white text-slate-700 shadow-sm'}`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            aria-label="View History"
                            className={`p-2 rounded-full transition-all duration-300 text-[var(--header-primary-color)] hover:scale-110 ${isDarkMode ? 'hover:bg-white/20' : 'hover:bg-white shadow-sm'}`}
                        >
                            <History className="w-4 h-4" />
                        </Link>

                        {/* Pemisah Vertikal */}
                        <div className={`w-px h-5 mx-1 ${isDarkMode ? 'bg-white/20' : 'bg-slate-300'}`} />

                        <button
                            onClick={openScan}
                            className={`flex items-center gap-2 px-4 py-1.5 ml-1 rounded-full transition-transform active:scale-95 ${isDarkMode ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                            <ScanBarcode className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Scan</span>
                        </button>
                    </div>

                    {/* --- KANAN: Hamburger Mobile --- */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-expanded={isMobileMenuOpen}
                            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 active:scale-95 ${isDarkMode
                                ? (isMobileMenuOpen ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20')
                                : (isMobileMenuOpen ? 'bg-slate-900 text-white' : 'bg-slate-900/5 text-slate-900 hover:bg-slate-900/10')
                                }`}
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">{isMobileMenuOpen ? 'Tutup' : 'Menu'}</span>
                            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Expanding Pill Dropdown (Dynamic Island Style) --- */}
                {isMobileMenuOpen && (
                    <div className={`absolute top-[calc(100%+8px)] left-0 w-full md:hidden z-10 p-2.5 flex flex-col gap-1.5 rounded-[2rem] border backdrop-blur-2xl shadow-2xl animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-300 ease-out ${isDarkMode ? 'bg-slate-900/90 border-slate-700/60' : 'bg-white/90 border-white/80'
                        }`}>
                        {displayMode === 'auto' && (
                            <button
                                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                className={`flex items-center justify-between w-full p-4 rounded-[1.5rem] transition-colors font-semibold text-sm active:scale-[0.98] ${isDarkMode ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white shadow-sm text-slate-500'}`}>
                                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    </div>
                                    Tampilan {isDarkMode ? 'Terang' : 'Gelap'}
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-40" />
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center justify-between w-full p-4 rounded-[1.5rem] transition-colors font-semibold text-sm active:scale-[0.98] ${isDarkMode ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-full ${isDarkMode ? 'bg-slate-800 text-[var(--header-primary-color)]' : 'bg-white shadow-sm text-[var(--header-primary-color)]'}`}>
                                    <History className="w-4 h-4" />
                                </div>
                                Riwayat Order
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-40" />
                        </Link>

                        <button
                            onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                            className="flex items-center justify-center gap-2 w-full mt-1 p-4 rounded-[1.5rem] font-bold tracking-widest uppercase text-xs transition-transform active:scale-95 shadow-md bg-[var(--header-primary-color)] text-white"
                        >
                            <ScanBarcode className="w-5 h-5" />
                            Mulai Scan Produk
                        </button>
                    </div>
                )}
            </div>

            {/* Backdrop gelap super tipis agar menu popup lebih fokus */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 top-[80px] bg-black/10 backdrop-blur-[2px] z-0 md:hidden animate-in fade-in duration-300 pointer-events-auto"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
};

export default Two;