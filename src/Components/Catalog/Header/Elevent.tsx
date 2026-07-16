"use client"
import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X, ArrowUpRight } from 'lucide-react';
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

const Elevent = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Lock scroll saat menu tirai terbuka
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    return (
        <header className={`${!isBuild ? 'absolute top-0 left-0 pt-4 md:pt-6' : 'relative pt-6'} z-[60] w-full pointer-events-none transition-all duration-500`}>

            {/* Wrapper: Full width, Classic Editorial Ribbon */}
            <div className="relative w-full pointer-events-auto">

                {/* --- INNER CONTAINER: Ribbon Bar --- */}
                <div className={`w-full flex items-center justify-between px-5 md:px-12 py-3 md:py-4 border-y-[1px] md:border-y-[1.5px] border-[var(--header-primary-color)] backdrop-blur-xl transition-all duration-500 ease-in-out relative z-20
                    ${isDarkMode
                        ? 'bg-slate-950/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.6)]'
                        : 'bg-[#F9F9F7]/95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]' // Off-white ala kertas koran
                    }`}
                >
                    {/* --- KIRI: Logo & Typography Serif --- */}
                    <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        {logoImage && (
                            <div className="hover:opacity-70 transition-opacity duration-500 ease-out cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}

                        {/* Vertical line pemisah ala kolom koran */}
                        {logoImage && (
                            <div className={`hidden sm:block w-[1px] h-8 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`} />
                        )}

                        <h2 className="text-lg md:text-2xl font-serif truncate mt-0.5 flex items-center">
                            <span className={`${isDarkMode ? "text-slate-200" : "text-slate-800"} tracking-[0.15em] font-light uppercase`}>
                                {spanOne}
                            </span>
                            <span className="font-bold ml-3 tracking-wide uppercase text-[var(--header-primary-color)] underline decoration-[1.5px] underline-offset-[6px] decoration-[var(--header-primary-color)]/50 hover:decoration-[var(--header-primary-color)] transition-colors duration-300">
                                {spanTwo}
                            </span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Editorial Nav --- */}
                    {/* Menggunakan font serif, kapital, dan tanpa sudut melengkung (rounded-none) */}
                    <div className="hidden md:flex items-center gap-6 font-serif text-xs tracking-[0.2em] uppercase font-medium">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`group flex items-center gap-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-amber-300' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4 stroke-[1.5]" /> : <Moon className="w-4 h-4 stroke-[1.5]" />}
                                <span>Tema</span>
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`group flex items-center gap-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-400 hover:text-[var(--header-primary-color)]' : 'text-slate-500 hover:text-[var(--header-primary-color)]'}`}
                        >
                            <History className="w-4 h-4 stroke-[1.5]" />
                            <span>Riwayat</span>
                        </Link>

                        {/* Solid Block Button (Sharp Corners) */}
                        <button
                            onClick={() => openScan()}
                            className={`flex items-center gap-2 px-6 py-2.5 ml-2 transition-all duration-300 active:scale-95
                                ${isDarkMode
                                    ? 'bg-[var(--header-primary-color)] text-slate-900 hover:bg-white'
                                    : 'bg-[var(--header-primary-color)] text-white hover:bg-slate-900'
                                }`}
                        >
                            <ScanBarcode className="w-4 h-4 stroke-[1.5]" />
                            <span>Pindai</span>
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 transition-colors duration-300 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
                        </button>
                    </div>
                </div>

                {/* --- MOBILE: Top-Down Curtain Drop Menu --- */}
                {isMobileMenuOpen && (
                    <div className={`absolute top-full left-0 w-full md:hidden z-10 border-b-[1px] md:border-b-[1.5px] border-[var(--header-primary-color)] shadow-2xl animate-in slide-in-from-top-2 fade-in duration-500 ease-out
                        ${isDarkMode ? 'bg-slate-950/95 backdrop-blur-2xl' : 'bg-[#F9F9F7]/95 backdrop-blur-2xl'}`}
                    >
                        {/* Decorative Double Line (Classic Magazine Style) */}
                        <div className={`w-full h-1 border-t border-b mx-auto mt-1 opacity-20 ${isDarkMode ? 'border-slate-500' : 'border-slate-800'}`} style={{ width: 'calc(100% - 2rem)' }} />

                        <div className="flex flex-col px-6 py-8 gap-6 font-serif">
                            {/* Menu Title / Timestamp (Editorial feel) */}
                            <div className="flex justify-between items-end border-b border-slate-300 dark:border-slate-700 pb-2 mb-2">
                                <span className="text-[10px] tracking-[0.3em] uppercase text-slate-500">
                                    Menu Navigasi Utama
                                </span>
                                <span className="text-[10px] tracking-widest text-[var(--header-primary-color)] font-bold">
                                    NO. 01
                                </span>
                            </div>

                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                                    className={`flex items-center justify-between group transition-colors ${isDarkMode ? 'text-slate-300 hover:text-amber-300' : 'text-slate-700 hover:text-[var(--header-primary-color)]'}`}
                                >
                                    <span className="text-xl tracking-[0.1em] uppercase font-light">Tampilan</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100">{isDarkMode ? 'Terang' : 'Gelap'}</span>
                                        {isDarkMode ? <Sun className="w-5 h-5 stroke-[1.5]" /> : <Moon className="w-5 h-5 stroke-[1.5]" />}
                                    </div>
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between group transition-colors ${isDarkMode ? 'text-slate-300 hover:text-[var(--header-primary-color)]' : 'text-slate-700 hover:text-[var(--header-primary-color)]'}`}
                            >
                                <span className="text-xl tracking-[0.1em] uppercase font-light">Riwayat</span>
                                <ArrowUpRight className="w-6 h-6 stroke-[1] opacity-50 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <div className={`w-full border-b border-dashed my-2 opacity-30 ${isDarkMode ? 'border-slate-500' : 'border-slate-600'}`} />

                            <button
                                onClick={() => { openScan(); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center justify-center gap-3 py-4 mt-2 transition-transform active:scale-95
                                    ${isDarkMode ? 'bg-[var(--header-primary-color)] text-slate-900' : 'bg-[var(--header-primary-color)] text-white'}`}
                            >
                                <ScanBarcode className="w-5 h-5 stroke-[1.5]" />
                                <span className="text-sm font-bold tracking-[0.2em] uppercase">Pindai Sekarang</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for Mobile Menu (Optional, to darken page content below) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 top-[80px] bg-black/20 backdrop-blur-sm z-0 md:hidden animate-in fade-in duration-500"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </header>
    )
}

export default Elevent;