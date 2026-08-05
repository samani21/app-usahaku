import { ArrowRight, Loader2, Menu, X } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react'
import { Footer } from './type';

type Props = {
    scrolled: boolean;
    handleNavigation: (v: string) => void;
    footer: Footer | undefined;
    loadingAction: string | null;
    setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
    isMobileMenuOpen: boolean;
}

const HeaderSection = ({ scrolled, handleNavigation, footer, loadingAction, setIsMobileMenuOpen, isMobileMenuOpen }: Props) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    return (
        <header className={`fixed w-full z-50 transition-all duration-500 px-4 sm:px-6 lg:px-8 ${scrolled ? 'top-4' : 'top-0'}`}>
            <div className={`max-w-7xl mx-auto transition-all duration-500 relative ${scrolled ? 'bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-xl rounded-full py-3 px-6' : 'bg-transparent py-6 px-0'}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleNavigation('/')}>
                        <img src={`${baseUrl}/logo_usahaku.png`} alt="Logo" className='w-12 rounded-xl group-hover:shadow-emerald-500/40 transition-all' />
                        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            {footer?.brand_name || 'Usaha'}<span className="text-emerald-500">{footer?.brand_highlight || 'Ku'}</span>
                        </span>
                    </div>

                    {/* Navigasi Desktop */}
                    <nav className="hidden md:flex items-center gap-10">
                        {['Beranda', 'Fitur', 'Harga', 'E-commerce'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-600 hover:text-slate-900">{item}</a>
                        ))}
                        <button
                            onClick={() => handleNavigation('/login')}
                            disabled={loadingAction === '/login'}
                            className="group inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 disabled:opacity-70 transition-all shadow-md"
                        >
                            {loadingAction === '/login' ? <Loader2 size={16} className="animate-spin" /> : (
                                <>Masuk Aplikasi <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </nav>

                    {/* Tombol Menu Mobile */}
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 bg-slate-100 rounded-full">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    )
}

export default HeaderSection