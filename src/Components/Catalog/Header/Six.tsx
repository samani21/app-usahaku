"use client"
import React, { useMemo, useState } from 'react';
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

const Six = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
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
        <header className={`${!isBuild ? 'absolute top-0 left-0 pt-4 md:pt-6 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-300`}>

            {/* Wrapper utama agar Dropdown posisinya proporsional */}
            <div className="relative w-full max-w-7xl pointer-events-auto">

                {/* --- INNER CONTAINER: Solid Status Ribbon Concept --- */}
                <div className={`relative flex items-center justify-between px-4 md:px-5 py-3 md:py-3.5 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 ease-in-out z-20
                    ${isDarkMode
                        ? 'bg-slate-900/90 border border-slate-700/50 shadow-[0_15px_40px_rgba(0,0,0,0.5)]'
                        : 'bg-white/95 border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)]'
                    }`}
                >
                    {/* Bold Accent Ribbon (Sisi Kiri Header) */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 md:w-2.5 bg-gradient-to-b from-[var(--header-primary-color)] to-[var(--header-primary-color)] shadow-[2px_0_15px_var(--header-primary-color)] opacity-90" />

                    {/* --- KIRI: Logo & Tipografi Solid --- */}
                    <div className="flex items-center gap-3 md:gap-4 ml-3 md:ml-4 min-w-0">
                        {logoImage && (
                            <div className="hover:scale-105 active:scale-95 transition-transform duration-300 ease-out cursor-pointer drop-shadow-sm">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-lg md:text-xl font-bold tracking-tight truncate">
                            <span className="text-[var(--header-primary-color)] drop-shadow-sm">{spanOne}</span>
                            <span className={`${isDarkMode ? "text-slate-100" : 'text-slate-800'} ml-1.5`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Command Navigation --- */}
                    {/* Menggunakan bentuk rounded-xl (agak kotak) untuk kesan sistem yang solid/terstruktur */}
                    <div className="hidden md:flex items-center gap-2 pl-4">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2.5 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} group`}
                        >
                            <History className="w-4 h-4 text-[var(--header-primary-color)] group-hover:scale-110 transition-transform" />
                        </Link>

                        {/* Garis Pembatas Halus */}
                        <div className={`w-px h-6 mx-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

                        {/* Tombol Scan Solid */}
                        <button
                            onClick={() => openScan()}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide transition-all active:scale-95 shadow-sm
                                ${isDarkMode
                                    ? 'bg-[var(--header-primary-color)] text-slate-900 hover:brightness-110'
                                    : 'bg-[var(--header-primary-color)] text-white hover:brightness-110'
                                }`}
                        >
                            <ScanBarcode className="w-4 h-4" />
                            Scan
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Slide-Down Command Panel --- */}
                {isMobileMenuOpen && (
                    <div className={`absolute top-[calc(100%+0.5rem)] left-0 w-full md:hidden z-10 rounded-2xl overflow-hidden border backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-300 shadow-2xl
                        ${isDarkMode ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-slate-200'}`}
                    >
                        {/* Bold Accent Ribbon (Menyambung ke Panel Dropdown) */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--header-primary-color)] to-[var(--header-primary-color)]/70 opacity-90 z-0" />

                        <div className="relative z-10 flex flex-col py-3 px-3 ml-2">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center justify-between w-full p-4 rounded-xl transition-colors font-medium text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
                                        {isDarkMode ? 'Ganti ke Terang' : 'Ganti ke Gelap'}
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between w-full p-4 rounded-xl transition-colors font-medium text-sm ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <History className="w-5 h-5 text-[var(--header-primary-color)]" />
                                    Riwayat Pemindaian
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </Link>

                            <div className={`h-px w-full my-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />

                            <button
                                onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                                className={`flex items-center justify-center gap-2 w-full p-4 rounded-xl font-bold text-sm tracking-wide transition-transform active:scale-95 shadow-sm mt-1
                                    ${isDarkMode ? 'bg-[var(--header-primary-color)] text-slate-900' : 'bg-[var(--header-primary-color)] text-white'}`}
                            >
                                <ScanBarcode className="w-5 h-5" />
                                Mulai Scan
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Six;