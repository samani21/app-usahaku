import React from 'react'
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';
import { ArrowUpRight } from 'lucide-react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Nine = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative overflow-hidden rounded-3xl flex h-48 sm:h-56 transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 border
                    ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                >
                    {/* Visual Side */}
                    <div className="w-2/5 sm:w-1/3 relative overflow-hidden h-full flex-shrink-0">
                        <div className={`w-full h-full flex items-center justify-center p-6 transition-transform duration-[1500ms] ease-out group-hover:scale-105
                            ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-full h-full text-[var(--category-primary-color)] opacity-[0.05] absolute scale-[2] -rotate-12 transition-transform duration-700 group-hover:rotate-0'
                            />
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-16 h-16 text-[var(--category-primary-color)] relative z-10 transition-transform duration-500 group-hover:scale-110'
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center relative z-10 bg-gradient-to-r from-transparent to-white/5">
                        {/* Decorative Watermark */}
                        <span className={`absolute -bottom-6 -right-2 text-8xl font-bold opacity-[0.02] pointer-events-none select-none transition-transform duration-700 group-hover:scale-110
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            S
                        </span>

                        <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-500
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Semua
                        </h3>
                        <p className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider mb-6 transition-colors duration-300
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {totalItems} Koleksi Produk
                        </p>

                        <div className="flex items-center">
                            <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-500
                                ${isDarkMode
                                    ? 'border-slate-600 text-slate-300 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white'
                                    : 'border-slate-200 text-slate-600 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900'}`}>
                                <span className="text-xs sm:text-sm font-semibold tracking-wide">
                                    Lihat Semua
                                </span>
                                <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative overflow-hidden rounded-3xl flex h-48 sm:h-56 transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 border
                        ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                    >
                        {/* Hover Soft Background Tint */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                            style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                        />

                        {/* Visual Side */}
                        <div className="w-2/5 sm:w-1/3 relative overflow-hidden h-full flex-shrink-0"
                            style={{ backgroundColor: `${cat.color}10` }}>
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-6 transition-transform duration-[1500ms] group-hover:scale-105">
                                    <Icon
                                        color={cat?.color}
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-full h-full opacity-10 absolute scale-[2] -rotate-12 transition-transform duration-700 group-hover:rotate-0'
                                    />
                                    <Icon
                                        color={cat?.color}
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-16 h-16 relative z-10 transition-transform duration-500 group-hover:scale-110'
                                    />
                                </div>
                            )}

                            {/* Inner gradient to smooth the edge between image and text */}
                            <div className={`absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent pointer-events-none
                                ${isDarkMode ? 'from-slate-800/80 group-hover:from-slate-800' : 'from-white group-hover:from-white'}`} />
                        </div>

                        {/* Content Side */}
                        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center relative z-10 bg-gradient-to-r from-transparent to-white/5">
                            {/* Accent Background Letter */}
                            <span className={`absolute -bottom-6 -right-2 text-8xl font-bold opacity-[0.02] pointer-events-none select-none transition-transform duration-700 group-hover:scale-110
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name.charAt(0)}
                            </span>

                            <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-500 truncate
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            <p className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider mb-6 transition-colors duration-300
                                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {cat.count || 0} Item Tersedia
                            </p>

                            <div className="flex items-center">
                                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-500
                                ${isDarkMode
                                        ? 'border-slate-600 text-slate-300 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white'
                                        : 'border-slate-200 text-slate-600 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900'}`}>
                                    <span className="text-xs sm:text-sm font-semibold tracking-wide">
                                        Jelajahi
                                    </span>
                                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 w-0 overflow-hidden group-hover:w-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Nine