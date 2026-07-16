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

const Three = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Kunci scroll body saat drawer terbuka
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isDrawerOpen]);

    return (
        <>
            <header className={`${!isBuild ? 'absolute top-2 md:top-5 left-0 px-3 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

                {/* Inner Container: Compact Boutique Style */}
                <div className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between py-2.5 px-5 md:px-7 rounded-[1.25rem] border-[0.5px] backdrop-blur-2xl transition-all duration-500 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/70 border-slate-700/60 shadow-[0_15px_40px_rgba(0,0,0,0.5)]'
                        : 'bg-white/80 border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.05)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Tipografi Editorial --- */}
                    <div className="flex items-center gap-4 md:gap-5 min-w-0">
                        {logoImage && (
                            <div className="drop-shadow-sm hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}

                        {/* Minimalist Vertical Divider */}
                        {logoImage && (
                            <div className={`hidden sm:block w-[1px] h-7 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                        )}

                        {/* Typography: Editorial Serif */}
                        <h2 className="text-base md:text-xl font-serif tracking-[0.15em] uppercase truncate mt-0.5 flex items-center">
                            <span className={`text-[var(--header-primary-color)] font-bold drop-shadow-sm`}>{spanOne}</span>
                            <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ml-2 md:ml-3 font-light tracking-[0.2em]`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Nav (Delicate & Minimalist) --- */}
                    <div className="hidden md:flex items-center gap-5 pl-2">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`group flex items-center justify-center transition-transform hover:scale-110`}
                            >
                                {isDarkMode
                                    ? <Sun className="w-4 h-4 text-yellow-400/90 group-hover:text-yellow-300 transition-colors" />
                                    : <Moon className="w-4 h-4 text-slate-500 group-hover:text-slate-800 transition-colors" />
                                }
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className="group flex items-center justify-center transition-transform hover:scale-110"
                        >
                            <History className="w-4 h-4 text-[var(--header-primary-color)] opacity-80 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        {/* Delicate Outlined Button untuk "Scan" (Khas Boutique/Fashion) */}
                        <button
                            onClick={() => openScan()}
                            className={`flex items-center gap-2 px-5 py-1.5 rounded-full border-[0.5px] transition-all duration-300
                                ${isDarkMode
                                    ? 'border-slate-500 text-slate-200 hover:bg-white hover:text-slate-900'
                                    : 'border-slate-400 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900'
                                }`}
                        >
                            <ScanBarcode className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-bold tracking-widest uppercase mt-px">Scan</span>
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger (Minimalist) --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className={`p-2 -mr-2 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
                        >
                            <Menu className="w-5 h-5 stroke-[1.5]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MOBILE: Elegant Side Drawer --- */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop Obscure */}
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsDrawerOpen(false)}
                    />

                    {/* Right Panel Drawer */}
                    <div
                        className={`relative w-[80%] max-w-[300px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out
                            ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}
                    >
                        {/* Drawer Header */}
                        <div className={`flex items-center justify-between p-6 border-b-[0.5px] ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <span className="font-serif text-sm tracking-[0.2em] uppercase text-[var(--header-primary-color)] font-bold">
                                Menu
                            </span>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                            >
                                <X className="w-5 h-5 stroke-[1.5]" />
                            </button>
                        </div>

                        {/* Drawer Links */}
                        <div className="flex flex-col py-4 px-3">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => {
                                        toggleTheme()
                                        setIsDrawerOpen(false)
                                    }}
                                    className={`flex items-center justify-between w-full p-4 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-500" />}
                                        <span className="font-light tracking-wide text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                                    </div>
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsDrawerOpen(false)}
                                className={`flex items-center justify-between w-full p-4 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <History className="w-5 h-5 text-[var(--header-primary-color)]" />
                                    <span className="font-light tracking-wide text-sm">Riwayat</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-30" />
                            </Link>
                        </div>

                        {/* Drawer Footer Action (Scan) */}
                        <div className="mt-auto p-6">
                            <button
                                onClick={() => { openScan(); setIsDrawerOpen(false); }}
                                className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-none border-[0.5px] transition-all
                                    ${isDarkMode
                                        ? 'border-slate-600 hover:bg-white hover:text-slate-900'
                                        : 'border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
                                    }`}
                            >
                                <ScanBarcode className="w-4 h-4" />
                                <span className="text-xs font-bold tracking-[0.15em] uppercase">Scan Produk</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Three;