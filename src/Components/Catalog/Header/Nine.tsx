"use client"
import React, { useMemo, useState, useEffect } from 'react';
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

const Nine = ({ themeMode, spanOne, spanTwo, toggleTheme, frameType, frameTheme, logoImage, isBuild, displayMode, openScan }: Props) => {
    const isDarkMode = useMemo(() => themeMode === 'dark', [themeMode]);

    // Navigasi & URL Logic
    const pathname = usePathname();
    const { outlet } = useParams();
    const segments = pathname?.split("/").filter(Boolean) || [];
    const currentFirstSegment = segments[0];
    const historyLink = isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`;

    // State Local
    const [isInvitationModalOpen, setIsInvitationModalOpen] = useState(false);

    // Kunci scroll body saat VIP Modal terbuka
    useEffect(() => {
        if (isInvitationModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isInvitationModalOpen]);

    return (
        <>
            <header className={`${!isBuild ? 'absolute top-0 md:top-4 left-0 pt-4 md:pt-0 px-4 md:px-8' : 'relative p-4 md:p-6'} z-[60] w-full flex justify-center pointer-events-none transition-all duration-500`}>

                {/* --- INNER CONTAINER: Soft Luxury Capsule --- */}
                <div className={`pointer-events-auto w-full max-w-7xl flex items-center justify-between pl-5 pr-3 md:pl-7 md:pr-3 py-2.5 rounded-full border backdrop-blur-xl transition-all duration-500 ease-in-out
                    ${isDarkMode
                        ? 'bg-slate-900/80 border-slate-700/60 shadow-[0_15px_40px_rgba(0,0,0,0.6)]'
                        : 'bg-white/85 border-slate-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]'
                    }`}
                >
                    {/* --- KIRI: Logo & Classic Typography --- */}
                    <div className="flex items-center gap-4 min-w-0">
                        {logoImage && (
                            <div className="hover:rotate-3 hover:scale-105 transition-transform duration-500 ease-out cursor-pointer">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        )}
                        <h2 className="text-lg md:text-xl font-serif tracking-wide truncate mt-0.5">
                            <span className="text-[var(--header-primary-color)] font-bold">{spanOne}</span>
                            <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} ml-2 italic font-light tracking-widest`}>{spanTwo}</span>
                        </h2>
                    </div>

                    {/* --- KANAN: Desktop Nested Capsule Navigation --- */}
                    <div className={`hidden md:flex items-center justify-center p-1.5 rounded-full transition-colors duration-500 border
                        ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50/80 border-slate-200/50'}`}
                    >
                        {displayMode === 'auto' && (
                            <button
                                onClick={toggleTheme}
                                className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'text-slate-300 hover:text-amber-300 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-800 hover:bg-white shadow-sm hover:shadow-md'}`}
                            >
                                {isDarkMode ? <Sun className="w-4 h-4 stroke-[1.5]" /> : <Moon className="w-4 h-4 stroke-[1.5]" />}
                            </button>
                        )}

                        <div className={`w-px h-5 mx-1.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

                        <Link
                            href={historyLink}
                            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'text-slate-300 hover:text-[var(--header-primary-color)] hover:bg-slate-700' : 'text-slate-500 hover:text-[var(--header-primary-color)] hover:bg-white shadow-sm hover:shadow-md'}`}
                        >
                            <History className="w-4 h-4 stroke-[1.5]" />
                        </Link>

                        {/* Elegant Scan Button */}
                        <button
                            onClick={() => openScan()}
                            className={`flex items-center gap-2 px-5 py-2 ml-1.5 rounded-full font-serif font-medium text-xs tracking-widest uppercase transition-all duration-500 active:scale-95
                                ${isDarkMode
                                    ? 'bg-[var(--header-primary-color)] text-slate-900 hover:brightness-110'
                                    : 'bg-[var(--header-primary-color)] text-white hover:brightness-110 shadow-md'
                                }`}
                        >
                            <ScanBarcode className="w-3.5 h-3.5 stroke-[1.5]" />
                            Scan
                        </button>
                    </div>

                    {/* --- KANAN: Mobile Menu Trigger (Delicate) --- */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsInvitationModalOpen(true)}
                            className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'text-slate-300 bg-slate-800/50' : 'text-slate-600 bg-slate-50'}`}
                        >
                            <Menu className="w-5 h-5 stroke-[1.5]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MOBILE: Floating VIP Invitation Modal --- */}
            {isInvitationModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 md:hidden">
                    {/* Deep Obscure Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setIsInvitationModalOpen(false)}
                    />

                    {/* Centered Glass Card (Invitation) */}
                    <div
                        className={`relative w-full max-w-sm rounded-[2rem] p-7 flex flex-col items-center text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-500 ease-out border
                            ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/95 border-white'}`}
                    >
                        {/* Close Button at top right of the card */}
                        <button
                            onClick={() => setIsInvitationModalOpen(false)}
                            className={`absolute top-5 right-5 p-2 rounded-full transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            <X className="w-5 h-5 stroke-[1.5]" />
                        </button>

                        {/* Classic Logo / Ornament Placeholder */}
                        {logoImage ? (
                            <div className="mb-4 opacity-80">
                                <LogoContainer logoImage={logoImage} frameType={frameType} frameTheme={frameTheme} />
                            </div>
                        ) : (
                            <div className="w-10 h-10 mb-4 rounded-full border border-slate-300 flex items-center justify-center opacity-50">
                                <span className="font-serif italic text-xl">M</span>
                            </div>
                        )}

                        <h3 className="font-serif text-lg tracking-widest uppercase mb-8 text-[var(--header-primary-color)]">
                            Menu Utama
                        </h3>

                        <div className="w-full flex flex-col gap-3">
                            {displayMode === 'auto' && (
                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setIsInvitationModalOpen(false)
                                    }}
                                    className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-light tracking-widest text-sm transition-colors border
                                        ${isDarkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800/50' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {isDarkMode ? <Sun className="w-4 h-4 stroke-[1.5]" /> : <Moon className="w-4 h-4 stroke-[1.5]" />}
                                    Mode {isDarkMode ? 'Terang' : 'Gelap'}
                                </button>
                            )}

                            <Link
                                href={historyLink}
                                onClick={() => setIsInvitationModalOpen(false)}
                                className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-light tracking-widest text-sm transition-colors border
                                    ${isDarkMode ? 'border-slate-800 text-slate-300 hover:bg-slate-800/50' : 'border-slate-100 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <History className="w-4 h-4 stroke-[1.5]" />
                                Riwayat
                            </Link>

                            <button
                                onClick={() => { openScan(); setIsInvitationModalOpen(false); }}
                                className={`mt-4 flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-serif font-medium uppercase tracking-widest text-sm transition-transform active:scale-95 shadow-lg
                                    ${isDarkMode ? 'bg-[var(--header-primary-color)] text-slate-900' : 'bg-[var(--header-primary-color)] text-white'}`}
                            >
                                <ScanBarcode className="w-4 h-4 stroke-[1.5]" />
                                Pindai Produk
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Nine;