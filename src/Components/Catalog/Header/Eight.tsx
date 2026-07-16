"use client"
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X, ChevronRight, Activity } from 'lucide-react';
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

const Eight = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
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
        <header className={`${!isBuild ? 'absolute top-0 md:top-3 left-0 pt-4 md:pt-2 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-300`}>

            {/* Wrapper agar Mobile Menu selaras dengan Header */}
            <div className="relative w-full max-w-7xl pointer-events-auto">

                {/* --- INNER CONTAINER: Dynamic Anchor Concept --- */}
                <div className={`relative z-20 flex items-center justify-between px-5 md:px-7 py-3 md:py-3.5 rounded-t-[1.25rem] rounded-b-lg border-b-[4px] border-b-[var(--header-primary-color)] backdrop-blur-2xl transition-all duration-300 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/90 border-x border-t border-slate-700/50 shadow-[0_15px_30px_rgba(0,0,0,0.5)]'
                        : 'bg-white/95 border-x border-t border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Sporty Typography --- */}
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        {logoImage && (
                            // Animasi hover bergerak ke kanan atas (Forward motion)
                            <div className="hover:translate-x-1 hover:-translate-y-1 transition-transform duration-300 ease-out cursor-pointer drop-shadow-md">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-xl md:text-2xl font-black italic tracking-wider truncate mt-0.5 flex items-center">
                            <span className={`${isDarkMode ? "text-slate-100" : "text-slate-900"} drop-shadow-sm`}>{spanOne}</span>
                            <span className="text-[var(--header-primary-color)] ml-1.5 drop-shadow-[0_2px_10px_var(--header-primary-color)]">
                                {spanTwo}
                            </span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Slanted Nav --- */}
                    <div className="hidden md:flex items-center gap-3 pl-4">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${isDarkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`p-2.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${isDarkMode ? 'bg-slate-800 text-[var(--header-primary-color)] hover:bg-slate-700' : 'bg-slate-100 text-[var(--header-primary-color)] hover:bg-slate-200'}`}
                        >
                            <History className="w-5 h-5" />
                        </Link>

                        {/* Slanted Button (Tombol Miring Khas Sport/Racing) */}
                        <button
                            onClick={() => openScan()}
                            className="group relative flex items-center justify-center ml-2 px-6 py-2.5 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {/* Background miring */}
                            <div className="absolute inset-0 bg-[var(--header-primary-color)] transform -skew-x-[12deg] rounded-sm transition-transform group-hover:scale-105" />
                            {/* Konten tegak lurus (tidak ikut miring) */}
                            <div className="relative flex items-center gap-2 text-white transform skew-x-0">
                                <ScanBarcode className="w-4 h-4" />
                                <span className="font-black italic uppercase tracking-widest text-sm">Scan</span>
                            </div>
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-md transition-colors ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Snappy Action Panel --- */}
                {isMobileMenuOpen && (
                    <div className={`absolute top-[calc(100%-0.5rem)] left-0 w-full md:hidden z-10 pt-4 pb-4 px-4 rounded-b-xl border-b-[4px] border-b-[var(--header-primary-color)] shadow-2xl animate-in slide-in-from-top-8 fade-in duration-200 ease-out
                        ${isDarkMode ? 'bg-slate-900 border-x border-slate-800' : 'bg-white border-x border-slate-200'}`}
                    >
                        <div className="flex flex-col gap-2 mt-2">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center justify-between w-full p-4 rounded-lg font-black italic tracking-wide uppercase text-sm transition-all active:scale-95
                                        ${isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                                        Tema {isDarkMode ? 'Terang' : 'Gelap'}
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between w-full p-4 rounded-lg font-black italic tracking-wide uppercase text-sm transition-all active:scale-95
                                    ${isDarkMode ? 'bg-slate-800/50 text-slate-300' : 'bg-slate-100 text-slate-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <History className="w-5 h-5 text-[var(--header-primary-color)]" />
                                    Riwayat
                                </div>
                                <ChevronRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                                className="group relative w-full overflow-hidden rounded-lg mt-2 transition-transform active:scale-95"
                            >
                                {/* Slanted Background untuk Mobile */}
                                <div className="absolute inset-0 bg-[var(--header-primary-color)] transform -skew-x-[15deg] scale-110" />
                                <div className="relative flex items-center justify-center gap-2 w-full p-4 text-white">
                                    <ScanBarcode className="w-5 h-5" />
                                    <span className="font-black italic uppercase tracking-widest">Mulai Scan</span>
                                    <Activity className="w-5 h-5 ml-1 animate-pulse opacity-80" />
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Eight;