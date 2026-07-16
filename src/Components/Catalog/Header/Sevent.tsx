"use client"
import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X, ChevronRight } from 'lucide-react';
import LogoContainer from './LogoContainer';
import { FrameTheme, FrameType } from './FrameType';

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
}

const Sevent = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    // Kunci scroll saat Bottom Sheet terbuka
    useEffect(() => {
        if (isBottomSheetOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isBottomSheetOpen]);

    return (
        <>
            <header className={`${!isBuild ? 'absolute top-3 md:top-5 left-0 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

                {/* --- INNER CONTAINER: Minimalist Floating Bar --- */}
                {/* Menggunakan rounded-full untuk kesan kapsul yang sangat mulus dan bersih */}
                <div className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between pl-4 pr-2 md:pl-6 md:pr-2.5 py-2 md:py-2.5 rounded-full border backdrop-blur-2xl transition-all duration-500 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/70 border-slate-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
                        : 'bg-white/75 border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Tipografi Light/Airy --- */}
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 py-1">
                        {logoImage && (
                            <div className="hover:opacity-70 transition-opacity duration-300 ease-out cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-base md:text-lg font-medium tracking-[0.05em] truncate">
                            <span className="text-[var(--header-primary-color)] font-semibold">{spanOne}</span>
                            <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ml-1.5 font-light`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Minimalist Nav --- */}
                    <div className="hidden md:flex items-center gap-1.5">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2.5 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`p-2.5 rounded-full transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-[var(--header-primary-color)] hover:bg-slate-800' : 'text-slate-500 hover:text-[var(--header-primary-color)] hover:bg-slate-100'}`}
                        >
                            <History className="w-4 h-4" />
                        </Link>

                        {/* Soft Pastel Button untuk Scan (Sangat elegan) */}
                        <button
                            onClick={() => openScan()}
                            className="flex items-center gap-2 px-5 py-2.5 ml-2 rounded-full font-semibold text-xs tracking-wide transition-all active:scale-95 bg-[var(--header-primary-color)]/10 text-[var(--header-primary-color)] hover:bg-[var(--header-primary-color)] hover:text-white"
                        >
                            <ScanBarcode className="w-4 h-4" />
                            Scan
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger --- */}
                    <div className="flex md:hidden items-center pr-1">
                        <button
                            onClick={() => setIsBottomSheetOpen(true)}
                            className={`p-2.5 rounded-full transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MOBILE: Native-style Slide-Up Bottom Sheet --- */}
            {isBottomSheetOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end md:hidden">
                    {/* Backdrop Obscure */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsBottomSheetOpen(false)}
                    />

                    {/* Bottom Sheet Panel */}
                    <div
                        className={`relative w-full rounded-t-[2rem] pt-3 pb-8 px-6 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-400 ease-out
                            ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
                    >
                        {/* Drag Handle Indicator (Visual) */}
                        <div className={`w-12 h-1.5 rounded-full mx-auto mb-6 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

                        {/* Header Panel */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg tracking-wide">Menu</h3>
                            <button
                                onClick={() => setIsBottomSheetOpen(false)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col gap-2">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setIsBottomSheetOpen(false)
                                    }}
                                    className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4 font-medium">
                                        <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                        </div>
                                        Tampilan {isDarkMode ? 'Terang' : 'Gelap'}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-400" />
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsBottomSheetOpen(false)}
                                className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-4 font-medium">
                                    <div className={`p-2 rounded-xl bg-[var(--header-primary-color)]/10 text-[var(--header-primary-color)]`}>
                                        <History className="w-5 h-5" />
                                    </div>
                                    Riwayat Scan
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </Link>
                        </div>

                        {/* Primary Action Button (Bottom Sheet Footer) */}
                        <button
                            onClick={() => { openScan(); setIsBottomSheetOpen(false); }}
                            className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[var(--header-primary-color)] text-white font-semibold text-base shadow-lg shadow-[var(--header-primary-color)]/30 active:scale-[0.98] transition-transform"
                        >
                            <ScanBarcode className="w-5 h-5" />
                            Mulai Scan Produk
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Sevent;