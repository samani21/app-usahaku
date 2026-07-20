import React from 'react'
import { ArrowUpRight } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Six = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 md:py-20 px-4 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`relative h-60 sm:h-72 md:h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border
                        ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}
                >
                    {/* Background Layer - Clean & Elegant */}
                    <div className={`absolute inset-0 transition-transform duration-[2000ms] ease-out group-hover:scale-110 flex items-center justify-center 
                       bg-white`}
                    >
                        {/* Subtle Static Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-[var(--category-primary-color)]/30 blur-[60px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-[var(--category-primary-color)]/20 blur-[50px] rounded-full" />
                        <Icon icon={'cbi:bulb-general-group'} className='w-24 h-24 md:w-32 md:h-32 text-[var(--category-primary-color)] -rotate-12' />
                    </div>

                    {/* Dark Overlay Gradient (Selalu gelap agar teks putih tetap terbaca) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Content Section - Perfect Centering with Flex */}
                    <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-white z-10">
                        <div className="flex flex-col items-center text-center w-full transform transition-all duration-500 ease-out group-hover:-translate-y-5">

                            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight mb-3 px-2 line-clamp-2">
                                Semua
                            </h3>

                            <div className="flex items-center justify-center gap-3 opacity-80 w-full">
                                <div className="h-[1px] w-6 sm:w-8 bg-white/40" />
                                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                                    {totalItems} Koleksi
                                </span>
                                <div className="h-[1px] w-6 sm:w-8 bg-white/40" />
                            </div>
                        </div>

                        {/* Hover Action Button - Absolute diposisikan agar muncul tepat di bawah teks */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-none">
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white text-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xl">
                                Telusuri <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* Inner Glass Border */}
                    <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none z-20" />
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`relative h-60 sm:h-72 md:h-80 rounded-[2rem] overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border
                            ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 w-full h-full bg-slate-900 overflow-hidden">
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center transition-colors duration-700 relative"
                                    style={{ backgroundColor: "#fff" }}>

                                    <div
                                        className="absolute inset-0 opacity-30 blur-[60px]"
                                        style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                                    />
                                    <Icon
                                        icon={cat?.icon || 'lucide:box'}
                                        className='w-24 h-24 sm:w-32 sm:h-32 opacity-20 group-hover:opacity-40 transition-all duration-700 group-hover:scale-110'
                                        style={{ color: cat?.color || 'var(--category-primary-color)' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Overlay Gradient (Selalu hitam agar estetik seragam) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-95 transition-opacity duration-700" />

                        {/* Content Section */}
                        <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-white z-10">
                            <div className="flex flex-col items-center text-center w-full transform transition-all duration-500 ease-out group-hover:-translate-y-5">

                                <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-tight mb-3 px-2 line-clamp-2">
                                    {cat.name}
                                </h3>

                                <div className="flex items-center justify-center gap-3 w-full opacity-80">
                                    <div className="h-[1px] w-4 sm:w-6 transition-colors duration-500" style={{ backgroundColor: cat?.color || 'rgba(255,255,255,0.4)' }} />
                                    <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap">
                                        {cat.count || 0} Produk
                                    </span>
                                    <div className="h-[1px] w-4 sm:w-6 transition-colors duration-500" style={{ backgroundColor: cat?.color || 'rgba(255,255,255,0.4)' }} />
                                </div>
                            </div>

                            {/* Hover Button Effect */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out pointer-events-none">
                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white text-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xl">
                                    Telusuri <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Thin Inner Glass Border */}
                        <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none z-20" />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Six;