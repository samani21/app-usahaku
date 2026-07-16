"use client"
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X } from 'lucide-react';
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

const Thirteen = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isBubbleMenuOpen, setIsBubbleMenuOpen] = useState(false);

    return (
        <header className={`${!isBuild ? 'absolute top-2 md:top-5 left-0 px-3 md:px-5' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

            {/* Wrapper utama agar Bubble Menu selaras */}
            <div className="relative w-full max-w-7xl pointer-events-auto">

                {/* --- INNER CONTAINER: Organic Soft Pill --- */}
                <div className={`relative z-20 w-full flex items-center justify-between pl-4 pr-2.5 md:pl-6 md:pr-3 py-2.5 rounded-[3rem] border backdrop-blur-2xl transition-all duration-500 ease-out
                    ${isDarkMode
                        ? 'bg-slate-900/80 border-slate-700/50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                        : 'bg-white/85 border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Friendly Typography --- */}
                    <div className="flex items-center gap-3.5 min-w-0 py-1">
                        {logoImage && (
                            <div className="hover:scale-110 active:scale-90 transition-transform duration-300 ease-out cursor-pointer drop-shadow-sm">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-lg md:text-xl tracking-tight truncate mt-0.5">
                            <span className="font-extrabold text-[var(--header-primary-color)]">{spanOne}</span>
                            <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-500'} ml-1.5 font-medium tracking-wide`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Soft Nav Group --- */}
                    <div className={`hidden md:flex items-center justify-center p-1.5 gap-1 rounded-full transition-colors duration-500
                        ${isDarkMode ? 'bg-slate-800/60 shadow-inner' : 'bg-slate-100/80 shadow-[inset_0_2px_5px_rgba(0,0,0,0.03)]'}`}
                    >
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2.5 rounded-full transition-all duration-300 active:scale-90 ${isDarkMode ? 'text-amber-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-white hover:shadow-sm'}`}
                            >
                                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`p-2.5 rounded-full transition-all duration-300 active:scale-90 ${isDarkMode ? 'text-[var(--header-primary-color)] hover:bg-slate-700' : 'text-[var(--header-primary-color)] hover:bg-white hover:shadow-sm'}`}
                        >
                            <History className="w-5 h-5" />
                        </Link>

                        {/* Plush Action Button */}
                        <button
                            onClick={() => openScan()}
                            className="flex items-center gap-2 px-6 py-2.5 ml-1.5 rounded-full font-bold tracking-wide transition-all duration-300 active:scale-95 bg-[var(--header-primary-color)] text-white shadow-[0_8px_20px_-6px_var(--header-primary-color)] hover:shadow-[0_12px_25px_-6px_var(--header-primary-color)]"
                        >
                            <ScanBarcode className="w-5 h-5" />
                            Scan
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Plush Trigger --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsBubbleMenuOpen(!isBubbleMenuOpen)}
                            className={`p-3 rounded-full transition-all duration-300 active:scale-90
                                ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}
                                ${isBubbleMenuOpen ? 'rotate-90 bg-[var(--header-primary-color)] text-white' : ''}`}
                        >
                            {isBubbleMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Floating Bubble Card --- */}
                {isBubbleMenuOpen && (
                    <div className={`absolute top-[calc(100%+0.75rem)] right-0 w-full md:hidden z-10 p-4 rounded-[2.5rem] border backdrop-blur-2xl shadow-2xl animate-in slide-in-from-top-4 fade-in zoom-in-95 duration-400 ease-out
                        ${isDarkMode ? 'bg-slate-900/95 border-slate-700/80' : 'bg-white/95 border-slate-200/80'}`}
                    >
                        <div className="flex flex-col gap-3">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => { toggleTheme(); setIsBubbleMenuOpen(false); }}
                                    className={`flex items-center gap-4 w-full p-4 rounded-full transition-all active:scale-95 font-bold text-sm
                                        ${isDarkMode ? 'bg-slate-800 text-slate-200 hover:brightness-110' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                                >
                                    <div className={`p-2.5 rounded-full ${isDarkMode ? 'bg-slate-900 text-amber-400' : 'bg-white text-slate-500 shadow-sm'}`}>
                                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                    </div>
                                    Tema {isDarkMode ? 'Terang' : 'Gelap'}
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsBubbleMenuOpen(false)}
                                className={`flex items-center gap-4 w-full p-4 rounded-full transition-all active:scale-95 font-bold text-sm
                                    ${isDarkMode ? 'bg-slate-800 text-slate-200 hover:brightness-110' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                            >
                                <div className={`p-2.5 rounded-full ${isDarkMode ? 'bg-slate-900 text-[var(--header-primary-color)]' : 'bg-white text-[var(--header-primary-color)] shadow-sm'}`}>
                                    <History className="w-5 h-5" />
                                </div>
                                Riwayat Pemindaian
                            </Link>

                            <button
                                onClick={() => { openScan(); setIsBubbleMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-3 p-5 mt-2 rounded-full bg-[var(--header-primary-color)] text-white shadow-[0_10px_25px_-8px_var(--header-primary-color)] active:scale-95 transition-transform"
                            >
                                <ScanBarcode className="w-6 h-6" />
                                <span className="font-extrabold text-base tracking-wide">Mulai Scan</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Thirteen;