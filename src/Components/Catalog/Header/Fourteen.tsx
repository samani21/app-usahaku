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

const Fourteen = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isPlaqueMenuOpen, setIsPlaqueMenuOpen] = useState(false);

    return (
        <header className={`${!isBuild ? 'absolute top-0 md:top-4 left-0 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

            {/* Wrapper utama untuk menjaga proporsi dropdown */}
            <div className="relative w-full max-w-7xl pointer-events-auto">

                {/* --- INNER CONTAINER: Gallery Plaque Concept --- */}
                <div className={`relative z-20 flex items-center justify-between px-6 md:px-8 py-3.5 md:py-4 rounded-t-md rounded-b-[1.5rem] border-t-[4px] border-t-[var(--header-primary-color)] backdrop-blur-xl transition-all duration-500 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/90 shadow-[0_20px_40px_rgba(0,0,0,0.6)] border-x border-b border-slate-800/80'
                        : 'bg-[#FCFCFA]/95 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border-x border-b border-slate-200/60' // Warna Galeri (Warm White)
                    }`}
                >
                    {/* --- KIRI: Editorial Typography (Plaque Title) --- */}
                    <div className="flex flex-col justify-center min-w-0 mt-0.5">
                        <h2 className="text-xl md:text-3xl font-serif font-black leading-none italic truncate drop-shadow-sm">
                            <span className="text-[var(--header-primary-color)] pr-2">{spanOne}</span>
                        </h2>
                        {/* Subtitle dengan tracking ekstrem ala label pameran */}
                        <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-[9px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold mt-2 ml-0.5 md:ml-1`}>
                            {spanTwo}
                        </span>
                    </div>

                    {/* --- KANAN: Logo & Navigation Group --- */}
                    <div className="flex items-center gap-4 md:gap-6">

                        {/* Desktop Nav Icons */}
                        <div className="hidden md:flex items-center gap-3">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={toggleTheme}
                                    className={`p-2 rounded transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'}`}
                                >
                                    {isDarkMode ? <Sun className="w-5 h-5 stroke-[1.5]" /> : <Moon className="w-5 h-5 stroke-[1.5]" />}
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                className={`p-2 rounded transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-[var(--header-primary-color)] hover:bg-slate-800' : 'text-slate-500 hover:text-[var(--header-primary-color)] hover:bg-slate-200'}`}
                            >
                                <History className="w-5 h-5 stroke-[1.5]" />
                            </Link>

                            <button
                                onClick={() => openScan()}
                                className={`flex items-center gap-2 px-5 py-2 rounded-sm font-serif font-bold italic tracking-widest text-xs uppercase transition-transform active:scale-95 shadow-sm
                                    ${isDarkMode ? 'bg-[var(--header-primary-color)] text-slate-900' : 'bg-[var(--header-primary-color)] text-white'}`}
                            >
                                <ScanBarcode className="w-4 h-4 stroke-[2]" />
                                Scan
                            </button>
                        </div>

                        {/* Mobile Menu Trigger */}
                        <div className="flex md:hidden items-center">
                            <button
                                onClick={() => setIsPlaqueMenuOpen(!isPlaqueMenuOpen)}
                                className={`p-2 transition-colors ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                            >
                                {isPlaqueMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                            </button>
                        </div>

                        {/* Vertical Divider */}
                        <div className={`hidden md:block w-[1.5px] h-10 rounded-full ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

                        {/* Logo on the Far Right */}
                        {logoImage && (
                            <div className="hover:-translate-y-1 hover:rotate-3 transition-all duration-300 ease-out drop-shadow-md cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                    </div>
                </div>

                {/* --- MOBILE: Hanging Plaque Card Menu --- */}
                {isPlaqueMenuOpen && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] w-[280px] md:hidden z-10">
                        {/* Visual Connector / Hanging Mount */}
                        <div className="absolute -top-2 right-10 w-4 h-2 bg-[var(--header-primary-color)] rounded-t-sm z-0" />

                        <div className={`relative z-10 w-full p-5 rounded-t-sm rounded-b-xl border-t-[4px] border-t-[var(--header-primary-color)] shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300
                            ${isDarkMode ? 'bg-slate-900 border-x border-b border-slate-800' : 'bg-[#FCFCFA] border-x border-b border-slate-200'}`}
                        >
                            {/* Decorative Plaque Screws/Pins */}
                            <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-slate-400/50" />
                            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-400/50" />

                            <div className="flex flex-col gap-4 mt-2">
                                {displayMode === 'auto' && (
                                    <button
                                        onClick={() => { toggleTheme(); setIsPlaqueMenuOpen(false); }}
                                        className={`flex items-center justify-between w-full pb-3 border-b transition-colors group
                                            ${isDarkMode ? 'border-slate-800 text-slate-300 hover:text-amber-400' : 'border-slate-200 text-slate-600 hover:text-slate-900'}`}
                                    >
                                        <span className="font-serif italic tracking-widest text-sm uppercase">Tema Visual</span>
                                        {isDarkMode ? <Sun className="w-4 h-4 stroke-[1.5]" /> : <Moon className="w-4 h-4 stroke-[1.5]" />}
                                    </button>
                                )}

                                <Link
                                    href={historyLink}
                                    onClick={() => setIsPlaqueMenuOpen(false)}
                                    className={`flex items-center justify-between w-full pb-3 border-b transition-colors group
                                        ${isDarkMode ? 'border-slate-800 text-slate-300 hover:text-[var(--header-primary-color)]' : 'border-slate-200 text-slate-600 hover:text-[var(--header-primary-color)]'}`}
                                >
                                    <span className="font-serif italic tracking-widest text-sm uppercase">Riwayat</span>
                                    <History className="w-4 h-4 stroke-[1.5]" />
                                </Link>

                                <button
                                    onClick={() => { openScan(); setIsPlaqueMenuOpen(false); }}
                                    className={`w-full flex items-center justify-between p-3 mt-2 rounded-sm transition-transform active:scale-95 shadow-md
                                        ${isDarkMode ? 'bg-[var(--header-primary-color)] text-slate-900' : 'bg-[var(--header-primary-color)] text-white'}`}
                                >
                                    <span className="font-serif font-bold italic tracking-[0.2em] uppercase text-xs">Pindai Objek</span>
                                    <ScanBarcode className="w-5 h-5 stroke-[1.5]" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Fourteen;