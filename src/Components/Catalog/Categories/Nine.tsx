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
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 px-4 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative overflow-hidden rounded-[2rem] flex h-40 sm:h-48 md:h-56 transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 border
                    ${isDarkMode ? 'bg-slate-800/80 border-slate-700/50 hover:border-slate-500/50' : 'bg-white border-slate-200/60 hover:border-slate-300 shadow-sm'}`}
                >
                    {/* Visual Side */}
                    <div className="w-2/5 sm:w-1/3 relative overflow-hidden h-full flex-shrink-0">
                        <div className={`w-full h-full flex items-center justify-center p-6 transition-transform duration-[1500ms] ease-out group-hover:scale-105
                            ${isDarkMode ? "bg-slate-50" : "bg-slate-50"}`}>
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-full h-full text-[var(--category-primary-color)] opacity-[0.03] absolute scale-[2] -rotate-12 transition-transform duration-700 group-hover:rotate-0'
                            />
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-12 h-12 sm:w-16 sm:h-16 text-[var(--category-primary-color)] relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm'
                            />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center relative z-10">
                        {/* Decorative Watermark */}
                        <span className={`absolute -bottom-4 -right-2 text-7xl sm:text-8xl md:text-9xl font-bold opacity-[0.03] pointer-events-none select-none transition-transform duration-700 group-hover:scale-110
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            S
                        </span>

                        <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1.5 sm:mb-2 transition-transform duration-500 ease-out group-hover:translate-x-1
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Semua
                        </h3>
                        <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-5 sm:mb-6 transition-colors duration-300
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {totalItems} Koleksi Produk
                        </p>

                        <div className="flex items-center">
                            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-500 relative overflow-hidden
                                ${isDarkMode
                                    ? 'border-slate-600 text-slate-300 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white'
                                    : 'border-slate-200 text-slate-600 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900'}`}>
                                <span className="text-[11px] sm:text-sm font-semibold tracking-wide relative z-10">
                                    Lihat Semua
                                </span>
                                {/* Smooth animated width arrow container */}
                                <div className="overflow-hidden flex items-center justify-center max-w-0 group-hover:max-w-[20px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out relative z-10">
                                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative overflow-hidden rounded-[2rem] flex h-40 sm:h-48 md:h-56 transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 border
                        ${isDarkMode ? 'bg-slate-800/80 border-slate-700/50 hover:border-slate-500/50' : 'bg-white border-slate-200/60 hover:border-slate-300 shadow-sm'}`}
                    >
                        {/* Hover Soft Background Tint */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                            style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                        />

                        {/* Visual Side */}
                        <div className="w-2/5 sm:w-1/3 relative overflow-hidden h-full flex-shrink-0"
                            style={{ backgroundColor: isDarkMode ? "#fff" : `${'var(--category-primary-color)'}15` }}>
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-6 transition-transform duration-[1500ms] group-hover:scale-105">
                                    <Icon
                                        color={cat?.color}
                                        icon={cat?.icon || 'lucide:box'}
                                        className='w-full h-full opacity-[0.05] absolute scale-[2.5] -rotate-12 transition-transform duration-700 group-hover:rotate-0'
                                    />
                                    <Icon
                                        color={cat?.color}
                                        icon={cat?.icon || 'lucide:box'}
                                        className='w-12 h-12 sm:w-16 sm:h-16 relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-sm'
                                    />
                                </div>
                            )}

                            {/* Inner gradient mask to smooth the edge between image and text area */}
                            <div className={`absolute inset-y-0 right-0 w-6 sm:w-8 bg-gradient-to-l to-transparent pointer-events-none transition-colors duration-500
                                ${isDarkMode ? 'from-slate-800/80 group-hover:from-slate-800' : 'from-white group-hover:from-white'}`} />
                        </div>

                        {/* Content Side */}
                        <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center relative z-10">
                            {/* Accent Background Letter */}
                            <span className={`absolute -bottom-4 -right-2 text-7xl sm:text-8xl md:text-9xl font-bold opacity-[0.03] pointer-events-none select-none transition-transform duration-700 group-hover:scale-110
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat?.name?.charAt(0) || 'C'}
                            </span>

                            <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-1.5 sm:mb-2 group-hover:translate-x-1 transition-transform duration-500 truncate
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-5 sm:mb-6 transition-colors duration-300
                                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {cat.count || 0} Item Tersedia
                            </p>

                            <div className="flex items-center">
                                {/* Button with dynamic hover fill */}
                                <div
                                    className={`relative inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border transition-all duration-500 overflow-hidden
                                    ${isDarkMode
                                            ? 'border-slate-600 text-slate-300 group-hover:border-transparent group-hover:text-white'
                                            : 'border-slate-200 text-slate-600 group-hover:border-transparent group-hover:text-white group-hover:shadow-lg'}`}
                                >
                                    {/* Hover Fill Color */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                                    />

                                    <span className="text-[11px] sm:text-sm font-semibold tracking-wide relative z-10">
                                        Jelajahi
                                    </span>
                                    {/* Smooth animated width arrow container */}
                                    <div className="overflow-hidden flex items-center justify-center max-w-0 group-hover:max-w-[20px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out relative z-10">
                                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Nine;