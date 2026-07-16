"use client"
import { History, Moon, ScanBarcode, Sun, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { Dispatch, SetStateAction, useState, useEffect } from 'react'

type Props = {
    colorClass: string;
    toggleTheme: () => void;
    themeMode: string;
    darkOnly?: boolean;
    displayMode: string;
    isBuild?: boolean;
    setIsOverflowHidden?: Dispatch<SetStateAction<boolean>>;
}

const NavIcons = ({ colorClass, toggleTheme, themeMode, darkOnly, displayMode, isBuild, setIsOverflowHidden }: Props) => {
    const pathname = usePathname()
    const { outlet } = useParams();
    const segments = pathname.split("/").filter(Boolean);
    const currentFirstSegment = segments[0];

    const [isOpenScan, setIsOpenScan] = useState<boolean>(false);
    const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);

    // Efek untuk mengunci scroll body saat sidebar terbuka
    useEffect(() => {
        if (setIsOverflowHidden) {
            setIsOverflowHidden(isOpenSidebar);
        }
        // Cleanup saat komponen unmount
        return () => {
            if (setIsOverflowHidden) setIsOverflowHidden(false);
        };
    }, [isOpenSidebar, setIsOverflowHidden]);

    const handleCloseSidebar = () => {
        setIsOpenSidebar(false);
    };

    const MenuItems = () => (
        <>
            {!darkOnly && displayMode == 'auto' &&
                <button
                    onClick={() => {
                        toggleTheme();
                        handleCloseSidebar();
                    }}
                    className={`w-full md:w-auto flex items-center justify-start gap-3 p-3 md:p-2 rounded-xl md:rounded-full transition-all ${themeMode === 'dark' ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
                >
                    {themeMode === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                    <span className="md:hidden font-medium">Ganti Tema</span>
                </button>
            }

            <Link
                href={isBuild ? "#" : `${segments?.length > 0 && currentFirstSegment != outlet ? `/${currentFirstSegment}` : ""}/history`}
                onClick={handleCloseSidebar}
                className={`w-full md:w-auto flex items-center justify-start gap-3 p-3 md:p-2 rounded-xl md:rounded-full transition-all ${themeMode === 'dark' ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            >
                <History className={`w-5 h-5 ${colorClass}`} />
                <span className="md:hidden font-medium">Riwayat</span>
            </Link>

            <button
                onClick={() => {
                    setIsOpenScan(true);
                    handleCloseSidebar();
                }}
                className={`w-full md:w-auto flex items-center justify-start gap-3 p-3 md:p-2 rounded-xl md:rounded-full transition-all ${themeMode === 'dark' ? "hover:bg-slate-800 md:bg-slate-800 text-white" : "hover:bg-slate-100 md:bg-slate-100 text-slate-800"}`}
            >
                <ScanBarcode className="w-5 h-5" />
                <span className="md:hidden font-medium">Scan Produk</span>
            </button>
        </>
    );

    return (
        <div>
            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:flex items-center gap-1.5">
                <MenuItems />
            </div>

            {/* --- MOBILE VIEW: Hamburger Button --- */}
            <div className="flex md:hidden">
                <button
                    onClick={() => setIsOpenSidebar(true)}
                    className={`p-2 rounded-xl border transition-colors ${themeMode === 'dark' ? "border-slate-700 hover:bg-slate-800 text-white" : "border-slate-200 hover:bg-slate-100 text-slate-800"}`}
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            {/* --- MOBILE VIEW: Sidebar Drawer --- */}
            {isOpenSidebar && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop Overlay - Klik untuk menutup */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={handleCloseSidebar}
                    />

                    {/* Sidebar Content */}
                    <div
                        className={`relative w-64 h-full shadow-2xl flex flex-col p-5 animate-in slide-in-from-right-8 duration-300 ${themeMode === 'dark' ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900"}`}
                    >
                        {/* Header Sidebar */}
                        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                            <span className="font-semibold text-lg tracking-tight">Menu Utama</span>
                            <button
                                onClick={handleCloseSidebar}
                                className={`p-1.5 rounded-full transition-colors ${themeMode === 'dark' ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col gap-1">
                            <MenuItems />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default NavIcons;