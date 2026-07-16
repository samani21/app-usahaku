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
    displayMode: string;
    openScan: () => void;
}

const Fiveteen = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Kunci scroll body saat menu terbuka (opsional, bisa dihapus jika ingin user tetap bisa scroll)
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    return (
        <header className={`${!isBuild ? 'absolute top-0 left-0' : 'relative'} z-[60] w-full pointer-events-none transition-all duration-500`}>

            {/* Wrapper utama agar Dropdown menyatu dengan Header */}
            <div className="relative w-full pointer-events-auto">

                {/* --- INNER CONTAINER: Cinematic Studio Ribbon --- */}
                <div className={`relative z-20 w-full flex items-center justify-between px-5 md:px-12 py-3.5 md:py-5 transition-all duration-500 ease-in-out backdrop-blur-xl
                    ${isDarkMode
                        ? 'bg-slate-950/90 border-b border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
                        : 'bg-white/95 border-b border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Ultra-Wide Typography --- */}
                    <div className="flex items-center gap-3 md:gap-6 min-w-0">
                        {logoImage && (
                            <div className="hover:opacity-60 transition-opacity duration-500 ease-in-out cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}

                        {/* Refined Hairline Divider */}
                        {logoImage && (
                            <div className={`hidden sm:block w-[1px] h-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
                        )}

                        <h2 className="text-[10px] md:text-xs lg:text-sm font-light uppercase tracking-[0.25em] sm:tracking-[0.4em] truncate mt-0.5">
                            <span className={`font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{spanOne}</span>
                            <span className="ml-1.5 sm:ml-3 text-[var(--header-primary-color)] font-medium">{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Minimalist Studio Nav --- */}
                    <div className="hidden md:flex items-center gap-8 font-sans">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {isDarkMode ? <Sun strokeWidth={1.25} className="w-4 h-4" /> : <Moon strokeWidth={1.25} className="w-4 h-4" />}
                                <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">Theme</span>
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${isDarkMode ? 'text-slate-400 hover:text-[var(--header-primary-color)]' : 'text-slate-500 hover:text-[var(--header-primary-color)]'}`}
                        >
                            <History strokeWidth={1.25} className="w-4 h-4" />
                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">Log</span>
                        </Link>

                        {/* Hairline Ghost Button for Scan (Director's Frame) */}
                        <button
                            onClick={() => openScan()}
                            className={`relative flex items-center gap-3 px-6 py-2 transition-all duration-500 overflow-hidden group
                                ${isDarkMode ? 'text-slate-200 hover:text-[var(--header-primary-color)]' : 'text-slate-800 hover:text-[var(--header-primary-color)]'}`}
                        >
                            <span className={`absolute left-0 top-0 bottom-0 w-[1px] transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 group-hover:bg-[var(--header-primary-color)]' : 'bg-slate-300 group-hover:bg-[var(--header-primary-color)]'}`} />
                            <span className={`absolute left-0 top-0 w-2 h-[1px] transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 group-hover:bg-[var(--header-primary-color)]' : 'bg-slate-300 group-hover:bg-[var(--header-primary-color)]'}`} />
                            <span className={`absolute left-0 bottom-0 w-2 h-[1px] transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 group-hover:bg-[var(--header-primary-color)]' : 'bg-slate-300 group-hover:bg-[var(--header-primary-color)]'}`} />

                            <span className={`absolute right-0 top-0 bottom-0 w-[1px] transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 group-hover:bg-[var(--header-primary-color)]' : 'bg-slate-300 group-hover:bg-[var(--header-primary-color)]'}`} />
                            <span className={`absolute right-0 top-0 w-2 h-[1px] transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 group-hover:bg-[var(--header-primary-color)]' : 'bg-slate-300 group-hover:bg-[var(--header-primary-color)]'}`} />
                            <span className={`absolute right-0 bottom-0 w-2 h-[1px] transition-colors duration-500 ${isDarkMode ? 'bg-slate-700 group-hover:bg-[var(--header-primary-color)]' : 'bg-slate-300 group-hover:bg-[var(--header-primary-color)]'}`} />

                            <ScanBarcode strokeWidth={1.25} className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scan</span>
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Minimalist Trigger --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`p-2 transition-opacity duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}
                        >
                            {isMenuOpen ? <X strokeWidth={1.25} className="w-6 h-6" /> : <Menu strokeWidth={1.25} className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Seamless Dropdown Slate --- */}
                {isMenuOpen && (
                    <div className={`absolute top-full left-0 w-full z-10 border-b shadow-2xl animate-in slide-in-from-top-2 fade-in duration-400 ease-out flex flex-col
                        ${isDarkMode ? 'bg-slate-950/95 border-slate-800 backdrop-blur-xl' : 'bg-white/95 border-slate-200 backdrop-blur-xl'}`}
                    >
                        {displayMode === 'auto' && (
                            <button
                                onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                                className={`flex items-center justify-between w-full px-6 py-5 border-b-[0.5px] transition-colors active:bg-black/5
                                    ${isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}
                            >
                                <span className="text-[10px] tracking-[0.3em] uppercase font-light">Ganti Tema</span>
                                {isDarkMode ? <Sun strokeWidth={1.25} className="w-5 h-5" /> : <Moon strokeWidth={1.25} className="w-5 h-5" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center justify-between w-full px-6 py-5 border-b-[0.5px] transition-colors active:bg-black/5
                                ${isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}
                        >
                            <span className="text-[10px] tracking-[0.3em] uppercase font-light">Riwayat Scan</span>
                            <History strokeWidth={1.25} className="w-5 h-5" />
                        </Link>

                        <div className="p-6">
                            <button
                                onClick={() => { openScan(); setIsMenuOpen(false); }}
                                className={`flex items-center justify-between w-full p-4 transition-transform active:scale-95
                                    ${isDarkMode ? 'bg-white text-slate-950' : 'bg-slate-950 text-white'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <ScanBarcode strokeWidth={1.5} className="w-5 h-5" />
                                    <span className="text-[11px] font-bold tracking-[0.3em] uppercase">Pindai Objek</span>
                                </div>
                                <ArrowRight strokeWidth={1.5} className="w-4 h-4 opacity-50" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop layar gelap (hanya muncul di bawah dropdown) */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 top-[120px] bg-black/10 backdrop-blur-[2px] z-0 md:hidden animate-in fade-in duration-500"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    )
}

export default Fiveteen;