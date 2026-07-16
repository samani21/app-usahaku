"use client"
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X, ArrowRight } from 'lucide-react';
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

const Five = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (
        <header className={`${!isBuild ? 'absolute top-0 left-0 pt-4 md:pt-6 px-4 md:px-8' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-300`}>

            {/* Wrapper utama untuk menyatukan Header dan Mobile Menu (Efek Tiket Memanjang) */}
            <div className="relative w-full max-w-7xl pointer-events-auto">

                {/* --- INNER CONTAINER: VIP Ticket Main Body --- */}
                <div className={`relative z-20 flex items-center justify-between px-5 md:px-7 py-3 md:py-4 rounded-xl border-[1.5px] border-dashed backdrop-blur-xl transition-all duration-500 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/85 border-slate-600/70 shadow-[0_15px_30px_rgba(0,0,0,0.5)]'
                        : 'bg-[#faf9f6]/95 border-slate-300 shadow-[0_10px_40px_rgba(0,0,0,0.06)]' // Menggunakan warna off-white/kertas
                    }`}
                >
                    {/* Kiri: Branding & Stacked Typography */}
                    <div className="flex items-center gap-3 md:gap-5">
                        {logoImage && (
                            <div className="hover:opacity-75 active:scale-95 transition-all duration-300 cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}

                        {/* Tipografi Bersusun Khas Label Botol/Tiket */}
                        <div className="flex flex-col justify-center mt-0.5 border-l-[1.5px] border-dashed pl-3 md:pl-4 transition-colors duration-300 md:border-l-0 md:pl-0 border-slate-300 dark:border-slate-600">
                            <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-0.5 ml-0.5">
                                {spanOne}
                            </span>
                            <span className="text-lg md:text-2xl font-serif font-bold uppercase text-[var(--header-primary-color)] leading-none drop-shadow-sm tracking-wide">
                                {spanTwo}
                            </span>
                        </div>
                    </div>

                    {/* Kanan: Desktop Navigation (Terpisah oleh garis putus-putus) */}
                    <div className="hidden md:flex items-center gap-4">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 text-slate-500 hover:text-[var(--header-primary-color)] transition-colors"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}

                        {/* Vertical Dashed Divider */}
                        <div className={`h-6 border-r-[1.5px] border-dashed ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} />

                        <Link
                            href={historyLink}
                            className="p-2 text-slate-500 hover:text-[var(--header-primary-color)] transition-colors"
                        >
                            <History className="w-5 h-5" />
                        </Link>

                        <div className={`h-6 border-r-[1.5px] border-dashed ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} />

                        {/* VIP "Punch" Button untuk Scan */}
                        <button
                            onClick={() => openScan()}
                            className={`flex items-center gap-2 px-5 py-2 ml-2 rounded-sm font-bold uppercase tracking-widest text-[11px] transition-all duration-300 active:scale-95
                                ${isDarkMode
                                    ? 'bg-[var(--header-primary-color)] text-slate-900 hover:brightness-110'
                                    : 'bg-[var(--header-primary-color)] text-white hover:brightness-110 shadow-md'
                                }`}
                        >
                            <ScanBarcode className="w-4 h-4" />
                            Scan
                        </button>
                    </div>

                    {/* Kanan: Mobile Hamburger Trigger */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Unfurling Ticket Stub (Dropdown Menu yang seolah menyatu) --- */}
                {isMobileMenuOpen && (
                    <div className={`absolute left-4 right-4 md:hidden z-10 pt-8 pb-5 px-6 rounded-b-xl border-[1.5px] border-t-0 border-dashed backdrop-blur-xl flex flex-col gap-1 -mt-4 animate-in slide-in-from-top-8 fade-in duration-400 ease-out shadow-2xl
                        ${isDarkMode ? 'bg-slate-900/95 border-slate-600' : 'bg-[#faf9f6]/95 border-slate-300'}`}
                    >
                        {/* Cutout/Perforation Effect (Visual decoration) */}
                        <div className={`absolute top-0 left-0 right-0 h-px border-t-[1.5px] border-dashed opacity-50 ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`} />

                        {displayMode === 'auto' && (
                            <button
                                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-[var(--header-primary-color)] transition-colors"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
                                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            </button>
                        )}

                        <div className={`w-full border-b-[1.5px] border-dashed my-1 opacity-50 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />

                        <Link
                            href={historyLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-4 py-3 text-sm font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-[var(--header-primary-color)] transition-colors"
                        >
                            <History className="w-5 h-5" />
                            Riwayat
                        </Link>

                        <div className={`w-full border-b-[1.5px] border-dashed my-1 opacity-50 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} />

                        <button
                            onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                            className={`mt-3 flex items-center justify-between w-full p-4 rounded-sm font-bold uppercase tracking-widest text-xs transition-transform active:scale-95
                                ${isDarkMode ? 'bg-[var(--header-primary-color)] text-slate-900' : 'bg-[var(--header-primary-color)] text-white shadow-md'}`}
                        >
                            <div className="flex items-center gap-3">
                                <ScanBarcode className="w-4 h-4" />
                                Scan Produk
                            </div>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Five;