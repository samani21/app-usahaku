"use client"
import React, { useState } from 'react'
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X } from 'lucide-react';
import LogoContainer from './LogoContainer'
import { FrameTheme, FrameType } from './FrameType';

type Props = {
    themeMode: string;
    isBuild?: boolean;
    logoImage: string | null;
    frameType: FrameType;
    frameTheme: FrameTheme;
    toggleTheme: () => void;
    spanOne?: string;
    spanTwo?: string;
    displayMode: string;
    openScan: () => void;
}

const One = ({ isBuild, themeMode, logoImage, frameType, frameTheme, toggleTheme, spanOne, spanTwo, displayMode, openScan }: Props) => {
    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local untuk Menu & Scan
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className={`${!isBuild ? 'absolute top-3 md:top-5 left-0 px-4 md:px-8' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center transition-all duration-300`}>

            {/* Inner Container: Advanced Glassmorphism */}
            <div className={`relative w-full max-w-7xl flex items-center justify-between px-5 md:px-7 py-3 md:py-3.5 rounded-2xl md:rounded-[1.5rem] border backdrop-blur-lg transition-all duration-500 ease-out
                ${themeMode === 'dark'
                    ? 'bg-slate-900/60 border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.4)]'
                    : 'bg-white/65 border-white/80 shadow-[0_12px_40px_rgb(0,0,0,0.06)]'
                }`}
            >
                {/* --- KIRI: Logo & Brand Name --- */}
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    {logoImage && (
                        <div className="hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer drop-shadow-sm">
                            <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                        </div>
                    )}
                    <h2 className="text-lg md:text-xl font-extrabold tracking-tight truncate cursor-default flex items-center gap-1.5">
                        <span className={`text-[var(--header-primary-color)] drop-shadow-sm`}>{spanOne}</span>
                        <span className={`transition-colors duration-300 ${themeMode === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
                            {spanTwo}
                        </span>
                    </h2>
                </div>

                {/* --- KANAN: Desktop Navigation --- */}
                <div className="hidden md:flex items-center gap-2">
                    {displayMode === 'auto' && (
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-full transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-white/60 text-slate-600'}`}
                        >
                            {themeMode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    )}

                    <Link href={historyLink} className={`p-2.5 rounded-full transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-white/60'} text-[var(--header-primary-color)] hover:opacity-80`}>
                        <History className="w-5 h-5" />
                    </Link>

                    <button
                        onClick={() => openScan()}
                        className={`flex items-center gap-2 px-4 py-2 ml-2 rounded-full transition-all active:scale-95 ${themeMode === 'dark' ? 'bg-white text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                        <ScanBarcode className="w-4 h-4" />
                        <span className="text-sm font-semibold">Scan</span>
                    </button>
                </div>

                {/* --- KANAN: Mobile Menu Trigger --- */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 rounded-xl transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-white/60 text-slate-800'}`}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* --- MOBILE: Popover/Dropdown Menu --- */}
                {isMobileMenuOpen && (
                    <div className="absolute top-[115%] right-0 w-56 md:hidden animate-in slide-in-from-top-4 fade-in duration-200 z-[70]">
                        <div className={`p-3 rounded-2xl border shadow-xl flex flex-col gap-1 backdrop-blur-xl
                            ${themeMode === 'dark'
                                ? 'bg-slate-900/90 border-slate-700/50'
                                : 'bg-white/90 border-white/80'}`}
                        >
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
                                >
                                    {themeMode === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
                                    <span className="font-medium">Tema {themeMode === 'dark' ? 'Terang' : 'Gelap'}</span>
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${themeMode === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'}`}
                            >
                                <History className="w-5 h-5 text-[var(--header-primary-color)]" />
                                <span className="font-medium">Riwayat</span>
                            </Link>

                            <div className={`h-px w-full my-1 ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`} />

                            <button
                                onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${themeMode === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                            >
                                <ScanBarcode className="w-5 h-5" />
                                <span className="font-semibold">Scan Produk</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default One