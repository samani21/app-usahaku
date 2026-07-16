"use client"
import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { History, Moon, ScanBarcode, Sun, Menu, X, Terminal, ChevronRight } from 'lucide-react';
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

const Twelve = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isTerminalMenuOpen, setIsTerminalMenuOpen] = useState(false);

    // Kunci scroll body saat Terminal Menu terbuka
    useEffect(() => {
        if (isTerminalMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isTerminalMenuOpen]);

    return (
        <>
            <header className={`${!isBuild ? 'absolute top-0 md:top-4 left-0 pt-4 md:pt-0 px-4 md:px-6' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

                {/* --- INNER CONTAINER: Illuminated Frame --- */}
                <div className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between px-5 md:px-6 py-2.5 md:py-3 rounded-2xl border-[1.5px] border-[var(--header-primary-color)]/60 backdrop-blur-xl transition-all duration-300 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/90 shadow-[0_0_20px_rgba(var(--header-primary-color-rgb),0.2)]'
                        : 'bg-white/95 shadow-[0_0_25px_rgba(var(--header-primary-color-rgb),0.3)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Tech Typography --- */}
                    <div className="flex items-center gap-3 md:gap-5 min-w-0">
                        {logoImage && (
                            <div className="hover:scale-110 active:scale-95 transition-transform duration-300 ease-out cursor-pointer drop-shadow-[0_0_8px_var(--header-primary-color)]">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-xl md:text-2xl font-black tracking-tighter truncate mt-0.5 flex items-center">
                            <span className="text-[var(--header-primary-color)] drop-shadow-[0_0_10px_var(--header-primary-color)]">{spanOne}</span>
                            <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} ml-1`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Illuminated Outlines --- */}
                    <div className="hidden md:flex items-center gap-3 font-mono text-sm">
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-lg border border-[var(--header-primary-color)]/30 text-[var(--header-primary-color)] hover:bg-[var(--header-primary-color)] hover:text-white hover:shadow-[0_0_15px_var(--header-primary-color)] transition-all duration-300`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </button>
                        )}

                        <Link
                            href={historyLink}
                            className={`p-2 rounded-lg border border-[var(--header-primary-color)]/30 text-[var(--header-primary-color)] hover:bg-[var(--header-primary-color)] hover:text-white hover:shadow-[0_0_15px_var(--header-primary-color)] transition-all duration-300`}
                        >
                            <History className="w-4 h-4" />
                        </Link>

                        <button
                            onClick={() => openScan()}
                            className="flex items-center gap-2 px-6 py-2 ml-2 rounded-lg font-black tracking-widest uppercase transition-all duration-300 active:scale-95 border-2 border-[var(--header-primary-color)] bg-[var(--header-primary-color)]/10 text-[var(--header-primary-color)] hover:bg-[var(--header-primary-color)] hover:text-white shadow-[inset_0_0_10px_var(--header-primary-color)]"
                        >
                            <ScanBarcode className="w-4 h-4" />
                            [ Scan ]
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsTerminalMenuOpen(true)}
                            className={`p-2 rounded-lg border border-[var(--header-primary-color)]/40 text-[var(--header-primary-color)] hover:bg-[var(--header-primary-color)]/20 hover:shadow-[0_0_10px_var(--header-primary-color)] transition-all duration-300`}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MOBILE: Floating Terminal HUD Menu --- */}
            {isTerminalMenuOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:hidden">
                    {/* Deep Obscure Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsTerminalMenuOpen(false)}
                    />

                    {/* HUD Terminal Modal (Tengah Layar) */}
                    <div
                        className={`relative w-full max-w-[340px] flex flex-col rounded-xl overflow-hidden border-[1.5px] border-[var(--header-primary-color)] shadow-[0_0_30px_rgba(var(--header-primary-color-rgb),0.3)] animate-in zoom-in-95 fade-in duration-300 ease-out
                            ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-white text-slate-800'}`}
                    >
                        {/* Terminal Header (Bagian atas modal) */}
                        <div className="flex items-center justify-between p-3 border-b border-[var(--header-primary-color)] bg-[var(--header-primary-color)]/10">
                            <div className="flex items-center gap-2 text-[var(--header-primary-color)] px-1">
                                <Terminal className="w-4 h-4" />
                                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">System.Control</span>
                            </div>
                            <button
                                onClick={() => setIsTerminalMenuOpen(false)}
                                className="p-1 rounded text-[var(--header-primary-color)] hover:bg-[var(--header-primary-color)]/20 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Terminal Menu Content */}
                        <div className="flex flex-col p-4 gap-3">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => toggleTheme()}
                                    className={`flex items-center justify-between w-full p-4 rounded-lg border border-[var(--header-primary-color)]/30 transition-all font-mono font-bold tracking-widest uppercase text-xs active:scale-[0.98]
                                        ${isDarkMode ? 'bg-[var(--header-primary-color)]/5 hover:shadow-[inset_0_0_10px_var(--header-primary-color)]' : 'bg-[var(--header-primary-color)]/5 hover:shadow-[inset_0_0_10px_var(--header-primary-color)]'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isDarkMode ? <Sun className="w-4 h-4 text-[var(--header-primary-color)]" /> : <Moon className="w-4 h-4 text-[var(--header-primary-color)]" />}
                                        Set_Theme
                                    </div>
                                    <span className="text-[10px] opacity-60">[{isDarkMode ? 'LGT' : 'DRK'}]</span>
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsTerminalMenuOpen(false)}
                                className={`flex items-center justify-between w-full p-4 rounded-lg border border-[var(--header-primary-color)]/30 transition-all font-mono font-bold tracking-widest uppercase text-xs active:scale-[0.98]
                                    ${isDarkMode ? 'bg-[var(--header-primary-color)]/5 hover:shadow-[inset_0_0_10px_var(--header-primary-color)]' : 'bg-[var(--header-primary-color)]/5 hover:shadow-[inset_0_0_10px_var(--header-primary-color)]'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <History className="w-4 h-4 text-[var(--header-primary-color)]" />
                                    Sys_Logs
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-50 text-[var(--header-primary-color)]" />
                            </Link>

                            <button
                                onClick={() => { openScan(); setIsTerminalMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-3 mt-2 p-4 rounded-lg border-2 border-[var(--header-primary-color)] bg-[var(--header-primary-color)] text-white shadow-[0_0_15px_var(--header-primary-color)] active:scale-95 transition-all"
                            >
                                <ScanBarcode className="w-5 h-5 animate-pulse" />
                                <span className="font-black font-mono tracking-[0.2em] uppercase text-sm">Execute_Scan</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Twelve;