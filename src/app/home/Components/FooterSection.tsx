"use client"

import React, { Dispatch, SetStateAction, useState } from 'react'
import { Footer } from './type';
import { Icon } from '@iconify/react';
import { Loader2, ShoppingBag } from 'lucide-react';

type Props = {
    footer: Footer | undefined;
    handleNavigation: (v: string) => void;
    loadingAction: string | null;
    setLoadingAction: Dispatch<SetStateAction<string | null>>;
    setToastMessage: Dispatch<SetStateAction<string | null>>;
}

const FooterSection = ({ footer, handleNavigation, loadingAction, setLoadingAction, setToastMessage }: Props) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    const [email, setEmail] = useState<string>('');
    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || loadingAction) return;

        try {
            setLoadingAction('newsletter');
            // Simulasi API Call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setToastMessage('Berhasil berlangganan newsletter!');
            setEmail('');
        } catch (error) {
            setToastMessage('Gagal mendaftar, coba lagi nanti.');
        } finally {
            setLoadingAction(null);
        }
    };
    return (
        <div>
            <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">

                        <div className="md:col-span-5 lg:col-span-4">
                            <div className="flex items-center gap-2.5 mb-8 cursor-pointer" onClick={() => handleNavigation('/')}>
                                <div className="rounded-lg bg-[#10B981]/20 text-[#10B981]">
                                    <img src={`${baseUrl}/logo_usahaku.png`} className='w-12 rounded-lg' />
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    {footer?.brand_name || 'Usaha'}<span className="text-[#10B981]">{footer?.brand_highlight || 'Ku'}</span>
                                </span>
                            </div>
                            <p className="text-slate-400 mb-8 leading-relaxed text-lg pe-8">
                                {footer?.brand_desc || 'Merancang ulang cara Anda berbisnis. Ekosistem digital cerdas untuk pengusaha modern dan afiliator.'}
                            </p>
                            <div className="flex space-x-5">
                                {footer?.social_fb && <a href={footer?.social_fb} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 hover:bg-[#10B981] hover:text-white transition-all"><Icon icon={'ic:baseline-facebook'} fontSize={18} /></a>}
                                {footer?.social_tw && <a href={footer?.social_tw} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 hover:bg-[#10B981] hover:text-white transition-all"><Icon icon={'ri:threads-fill'} fontSize={18} /></a>}
                                {footer?.social_ig && <a href={footer?.social_ig} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-900 hover:bg-[#10B981] hover:text-white transition-all"><Icon icon={'mdi:instagram'} fontSize={18} /></a>}
                            </div>
                        </div>

                        <div className="md:col-span-3 lg:col-span-2 lg:col-start-6">
                            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Produk</h4>
                            <ul className="space-y-4 font-medium">
                                <li><a href="#fitur" className="hover:text-[#10B981] transition-colors">Fitur Unggulan</a></li>
                                <li><a href="#harga" className="hover:text-[#10B981] transition-colors">Harga & Paket</a></li>
                                <li><a href="#ecommerce" className="hover:text-[#10B981] transition-colors">E-commerce UMKM</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Afiliasi</a></li>
                            </ul>
                        </div>

                        <div className="md:col-span-4 lg:col-span-2">
                            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Perusahaan</h4>
                            <ul className="space-y-4 font-medium">
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Pusat Bantuan</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Syarat Layanan</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Kebijakan Privasi</a></li>
                                <li><a href="#" className="hover:text-[#10B981] transition-colors">Hubungi Kami</a></li>
                            </ul>
                        </div>

                        <div className="md:col-span-12 lg:col-span-3">
                            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Akses Eksklusif</h4>
                            <p className="text-slate-400 mb-6 font-medium">Dapatkan insight bisnis premium langsung di kotak masuk Anda.</p>
                            <form className="relative" onSubmit={handleNewsletterSubmit}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Alamat email Anda"
                                    required
                                    disabled={loadingAction === 'newsletter'}
                                    className="w-full bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={loadingAction === 'newsletter'}
                                    className="absolute right-2 top-2 bottom-2 px-4 rounded-lg font-bold text-slate-900 bg-[#10B981] hover:bg-emerald-400 transition-colors flex items-center justify-center disabled:opacity-70"
                                >
                                    {loadingAction === 'newsletter' ? <Loader2 size={18} className="animate-spin" /> : 'Kirim'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 font-medium text-sm">
                            &copy; {new Date().getFullYear()} {footer?.copyright || 'UsahaKu Inc. Hak Cipta Dilindungi.'}
                        </p>
                        <div className="flex items-center gap-2 font-medium text-slate-500 text-sm">
                            Didesain dengan <span className="text-[#10B981]">presisi</span> untuk Anda.
                        </div>
                    </div>
                </div>
            </footer>

            {/* FLOATING ACTION BUTTON (DATA DINAMIS) */}
            {footer?.show_fab !== false && (
                <a
                    href="#ecommerce"
                    className="fixed bottom-6 right-6 z-[60] bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 border-2 border-white group animate-in zoom-in duration-500"
                    title={footer?.fab_text || 'E-commerce UMKM'}
                >
                    <ShoppingBag size={24} />
                    <span className="hidden md:block font-black uppercase tracking-widest text-xs pr-2 overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-xs transition-all duration-300 ease-in-out">
                        {footer?.fab_text || 'E-commerce UMKM'}
                    </span>
                </a>
            )}
        </div>
    )
}

export default FooterSection