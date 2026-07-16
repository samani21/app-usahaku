"use client"
import { ChevronDown, HelpCircle, LayoutGrid, Settings, ShieldCheck, X } from 'lucide-react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import GlassCard from './GlassCard';
import NavItem from './NavItem';
import { menuSidebar } from '@/lib/MenuSidebar';
import { useCorrectPath } from '@/utils/useCorrectPath';

type Props = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    user: any;
    business: any;
}

const SidebarComponent = ({ isSidebarOpen, setIsSidebarOpen, setLoading, user, business }: Props) => {
    const pathname = usePathname();
    const [pathNameParent, setPathNameParent] = useState<string>('');
    const [pathNameChild, setPathNameChild] = useState<string>('');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const { getCorrectPath } = useCorrectPath();
    useEffect(() => {
        if (pathname) {
            const parts = pathname.split("/");
            let basePath = '';
            if (getCorrectPath(pathname).split("/")[1] === 'admin') {
                basePath = parts.slice(0, 3).join("/");
            } else {
                basePath = parts.slice(0, 2).join("/");
            }

            const childbasePath = parts.slice(0, 4).join("/");
            setPathNameParent(basePath);
            setPathNameChild(childbasePath);
        }
    }, [pathname]);

    return (
        <aside className={`
          fixed sm:inset-y-4 sm:left-4 z-60 w-72 h-screen py-4 pl-4 transform transition-transform duration-300 ease-in-out lg:relative lg:inset-0 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'}
        `}>
            {/* Kita ubah GlassCard agar bentuknya mirip di gambar (putih bersih, rounded besar) */}
            <GlassCard className="h-full flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[32px]">

                {/* Close Button Mobile */}
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors lg:hidden rounded-full hover:bg-slate-100"
                >
                    <X size={20} />
                </button>

                {/* --- HEADER BRANDING (DIUBAH TOTAL AGAR PREMIUM) --- */}
                {/* Kita buat rata kiri, hapus kotak shadow aneh, dan tambahkan nama aplikasi */}
                <div className='flex items-center gap-3 px-8 pt-10 pb-8'>
                    <div className="w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-emerald-50">
                        {/* Hapus class shadow atau kotak putih di img ini jika ada dari CSS global */}
                        <img
                            src={`${baseUrl}/logo.png`}
                            alt="Logo"
                            className="w-7 h-7 object-contain"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-none">
                            Dashboard
                        </h2>
                        {/* Opsional: Tambahkan nama bisnis/user di bawahnya agar personal */}
                        <p className="text-xs font-medium text-slate-400 mt-1 truncate w-32">
                            {business?.name || "Business Panel"}
                        </p>
                    </div>
                </div>

                {/* --- NAVIGATION MENU --- */}
                {/* Padding diubah dari p-6 menjadi px-4 agar tombol aktif bisa membentang bagus */}
                <nav className="w-full flex-1 overflow-hidden flex flex-col px-4">
                    <div className='h-full overflow-y-auto no-scrollbar pb-6 space-y-1.5'>
                        {
                            menuSidebar?.map((ms, i) => {
                                const isOpen = pathNameParent === getCorrectPath(`${ms?.href}`);
                                const isLocked = ms?.label?.toLowerCase() === 'transaksi' && (
                                    business?.verified_status == 0 ||
                                    business?.subscription_status === 'expired' ||
                                    business?.subscription_status === 'canceled'
                                );

                                return (
                                    ms?.child ? (
                                        <NavItem
                                            key={i}
                                            icon={ms?.Icon}
                                            label={ms?.label}
                                            active={isOpen}
                                            children={ms?.child}
                                            parent={ms?.href}
                                            setLoading={setLoading}
                                            pathNameChild={pathNameChild}
                                            isLocked={isLocked}
                                        />
                                    ) : (
                                        <NavItem
                                            icon={ms?.Icon}
                                            label={ms?.label}
                                            key={i}
                                            setLoading={setLoading}
                                            active={isOpen}
                                            parent={ms?.href}
                                            isLocked={isLocked}
                                        />
                                    )
                                );
                            })
                        }
                    </div>
                </nav>
            </GlassCard>
        </aside>
    )
}

export default SidebarComponent