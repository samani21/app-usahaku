"use client"
import React, { useState } from 'react'
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
    isConfigHeader: boolean;
    openScan: () => void;
}

const Four = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, isConfigHeader, openScan }: Props) => {
    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk Modal Mobile

    // Karena tema ini mengusung gaya Tech/Dark secara default di containernya
    const isDarkMode = themeMode === 'dark';

    return (
        <>
            {/* --- DESKTOP & MOBILE HEADER --- */}
            <header className={`${!isBuild ? 'absolute top-0 md:top-4 left-0 pt-4 md:pt-0 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-300`}>

                {/* Inner Container: Tech/Dynamic Command Center Style */}
                <div className="pointer-events-auto w-full max-w-7xl flex items-center justify-between pl-5 pr-3 py-2.5 rounded-2xl bg-slate-950/90 text-white border border-slate-800/80 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden group">

                    {/* Glowing Accent Indicator (Left Side) */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--header-primary-color)] shadow-[0_0_20px_var(--header-primary-color)] opacity-90" />

                    {/* Subtle Cyber Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--header-primary-color)]/20 via-transparent to-transparent opacity-30 pointer-events-none" />

                    {/* Moving Scanline Effect (Hover Only) */}
                    <div className="absolute inset-0 w-full h-[2px] bg-[var(--header-primary-color)]/30 opacity-0 group-hover:opacity-100 group-hover:animate-[scanline_2s_ease-in-out_infinite] pointer-events-none blur-sm" />

                    {/* --- KIRI: Logo & Dynamic Tipografi --- */}
                    <div className="flex items-center gap-4 min-w-0 relative z-10">
                        {logoImage && (
                            <div className="drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] hover:scale-110 hover:-rotate-3 transition-transform duration-300 ease-out cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}

                        <h2 className="font-black italic text-lg md:text-xl tracking-wider truncate flex items-center mt-1">
                            <span className="text-slate-100 drop-shadow-md">{spanOne}</span>
                            <span className="text-[var(--header-primary-color)] ml-1.5 drop-shadow-[0_0_10px_var(--header-primary-color)]">
                                {spanTwo}
                            </span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Command Nav --- */}
                    <div className="hidden md:flex relative z-10 items-center gap-2 bg-slate-900/50 hover:bg-slate-800/50 rounded-xl p-1.5 border border-white/10 transition-colors duration-300 shadow-inner">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                            </button>
                        )}

                        <div className="w-px h-6 bg-slate-700/50 mx-1" />

                        <Link
                            href={historyLink}
                            className="p-2 rounded-lg text-[var(--header-primary-color)] hover:bg-white/10 hover:shadow-[0_0_15px_var(--header-primary-color)] transition-all duration-200"
                        >
                            <History className="w-5 h-5" />
                        </Link>

                        <button
                            onClick={() => openScan()}
                            className="flex items-center gap-2 px-4 py-1.5 ml-1 rounded-lg bg-[var(--header-primary-color)] text-slate-950 hover:opacity-90 transition-all active:scale-95 font-bold uppercase tracking-wider text-xs shadow-[0_0_15px_var(--header-primary-color)]"
                        >
                            <ScanBarcode className="w-4 h-4" />
                            Scan
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger --- */}
                    <div className="flex md:hidden relative z-10 items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 rounded-lg text-[var(--header-primary-color)] bg-[var(--header-primary-color)]/10 hover:bg-[var(--header-primary-color)]/20 transition-colors active:scale-95"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MOBILE MODAL OVERLAY --- */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden">
                    {/* Backdrop (Klik untuk tutup) */}
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Modal Box */}
                    <div className="relative w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,1)] p-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Aksen atas Modal */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--header-primary-color)] to-transparent opacity-70" />

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm drop-shadow-md">Command Menu</h3>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Tombol Tema */}
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 hover:bg-slate-800 transition-colors active:scale-95"
                                >
                                    <div className="p-2 rounded-lg bg-slate-950 shadow-inner">
                                        {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
                                    </div>
                                    <span className="font-semibold text-sm">Ganti Tema</span>
                                </button>
                            )}

                            {/* Tombol Riwayat */}
                            <Link
                                href={historyLink}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[var(--header-primary-color)] hover:bg-slate-800 transition-colors active:scale-95"
                            >
                                <div className="p-2 rounded-lg bg-slate-950 shadow-inner">
                                    <History className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-sm">Riwayat Poin</span>
                            </Link>

                            {/* Tombol Scan (Dibuat paling menonjol) */}
                            <button
                                onClick={() => {
                                    openScan();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="flex items-center justify-center gap-2 p-3 mt-2 rounded-xl bg-[var(--header-primary-color)] text-slate-950 hover:opacity-90 transition-all active:scale-95 font-bold uppercase tracking-wider shadow-[0_0_20px_var(--header-primary-color)]"
                            >
                                <ScanBarcode className="w-5 h-5" />
                                Buka Scanner
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scanline {
                    0% { transform: translateY(-10px); }
                    50% { transform: translateY(40px); }
                    100% { transform: translateY(-10px); }
                }
            `}} />
        </>
    )
}

export default Four