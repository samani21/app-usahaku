"use client"
import React, { useMemo, useState, useEffect } from 'react';
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
    openScan: () => void;
    displayMode: string
}

const Ten = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
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
        <header className={`${!isBuild ? 'absolute top-3 md:top-5 left-0 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

            {/* Wrapper utama dijadikan relative untuk jangkar Dropdown Mobile */}
            <div className="relative w-full max-w-7xl pointer-events-auto">

                {/* --- INNER CONTAINER: Exclusive Halo Capsule --- */}
                <div className={`flex items-center justify-between p-2 md:p-2.5 rounded-full border backdrop-blur-2xl transition-all duration-500 ease-out z-20 relative
                    ${isDarkMode
                        ? 'bg-slate-900/80 border-slate-700/60 shadow-[0_15px_40px_rgba(0,0,0,0.5)]'
                        : 'bg-white/85 border-slate-200/50 shadow-[0_15px_40px_rgba(0,0,0,0.06)]'
                    }`}
                >
                    {/* --- KIRI: Stacked Halo Logo & Typography --- */}
                    <div className="flex items-center gap-4 min-w-0 pl-2">
                        {/* Stacked Elements Group */}
                        <div className="flex items-center -space-x-3.5 group cursor-pointer">
                            {logoImage && (
                                <div className="relative z-10 group-hover:-translate-y-1 group-hover:rotate-12 transition-all duration-500 ease-out">
                                    <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                                </div>
                            )}
                            {/* Halo / Accent Ring */}
                            <div className={`w-11 h-11 rounded-full relative z-0 transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--header-primary-color)]/20
                                ${isDarkMode
                                    ? 'bg-slate-800/80 border-[3px] border-slate-900 shadow-inner'
                                    : 'bg-slate-50/80 border-[3px] border-white shadow-[inset_0_2px_5px_rgba(0,0,0,0.06)]'
                                }`}
                            />
                        </div>

                        {/* Typography */}
                        <h2 className="text-lg md:text-xl font-extrabold tracking-tight truncate mt-0.5">
                            <span className="text-[var(--header-primary-color)] drop-shadow-sm">{spanOne}</span>
                            <span className={`${isDarkMode ? "text-slate-300" : 'text-slate-700'} ml-1.5`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Halo Navigation Buttons --- */}
                    <div className="hidden md:flex items-center gap-2 pr-1">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:-rotate-12
                                    ${isDarkMode
                                        ? 'bg-slate-800 text-amber-400 hover:ring-slate-700 hover:ring-offset-slate-900'
                                        : 'bg-slate-100 text-slate-600 hover:ring-slate-200 hover:ring-offset-white'
                                    }`}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:ring-2 hover:ring-offset-2 hover:rotate-12
                                ${isDarkMode
                                    ? 'bg-slate-800 text-[var(--header-primary-color)] hover:ring-[var(--header-primary-color)]/50 hover:ring-offset-slate-900'
                                    : 'bg-slate-100 text-[var(--header-primary-color)] hover:ring-[var(--header-primary-color)]/50 hover:ring-offset-white'
                                }`}
                        >
                            <History className="w-5 h-5" />
                        </Link>

                        {/* Primary Scan Halo Button */}
                        <button
                            onClick={() => openScan()}
                            className="relative flex items-center justify-center gap-2 h-10 px-5 ml-2 rounded-full font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:ring-4 hover:ring-[var(--header-primary-color)]/30 active:scale-95 bg-[var(--header-primary-color)] text-white shadow-lg"
                        >
                            <ScanBarcode className="w-4 h-4" />
                            Scan
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Halo Trigger --- */}
                    <div className="flex md:hidden items-center pr-1">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90
                                ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}
                                ${isMobileMenuOpen ? 'ring-4 ring-slate-500/20 rotate-90' : 'hover:ring-4 hover:ring-slate-500/20'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Floating Halo Bubble Menu --- */}
                {isMobileMenuOpen && (
                    <div className={`absolute top-[calc(100%+1rem)] right-0 w-[calc(100vw-2rem)] max-w-[280px] md:hidden z-10 rounded-[2rem] p-4 flex flex-col gap-2 border backdrop-blur-3xl shadow-2xl animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-300 ease-out
                        ${isDarkMode ? 'bg-slate-900/95 border-slate-700/80' : 'bg-white/95 border-slate-200/80'}`}
                    >
                        {displayMode === 'auto' && (
                            <button
                                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-4 w-full p-3.5 rounded-2xl transition-colors font-semibold text-sm
                                    ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-600'}`}>
                                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </div>
                                Ganti Tema
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-4 w-full p-3.5 rounded-2xl transition-colors font-semibold text-sm
                                ${isDarkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'}`}
                        >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800 text-[var(--header-primary-color)]' : 'bg-slate-100 text-[var(--header-primary-color)]'}`}>
                                <History className="w-4 h-4" />
                            </div>
                            Riwayat
                        </Link>

                        <div className={`h-px w-full my-1 opacity-50 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

                        <button
                            onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                            className="w-full relative flex items-center justify-between p-1.5 pl-5 mt-1 rounded-full bg-[var(--header-primary-color)] text-white shadow-lg active:scale-95 transition-transform"
                        >
                            <span className="font-extrabold uppercase tracking-widest text-xs">Mulai Scan</span>
                            <div className="w-10 h-10 rounded-full bg-white text-[var(--header-primary-color)] flex items-center justify-center">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Ten;