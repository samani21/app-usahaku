import React from 'react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';
import { ArrowRight } from 'lucide-react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Teen = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 px-4 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[160px] md:auto-rows-[220px] gap-4 md:gap-6">

                {/* BIG FEATURE CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative col-span-2 row-span-2 rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 ease-out hover:-translate-y-2 border
                    ${isDarkMode
                            ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 shadow-none'
                            : 'bg-slate-50 border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-xl'}`}
                >
                    {/* Cinematic Background Decoration */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700
                            ${isDarkMode ? 'bg-white' : 'bg-[var(--category-primary-color)]'}`}
                        />
                        <Icon
                            icon="solar:widget-6-bold-duotone"
                            className="absolute -right-12 -bottom-12 w-64 h-64 md:w-72 md:h-72 opacity-[0.04] group-hover:opacity-[0.08] rotate-12 group-hover:-rotate-6 transition-all duration-[2000ms] ease-out"
                            style={{ color: 'var(--category-primary-color)' }}
                        />
                    </div>

                    <div className="relative z-10 h-full p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                        <div>
                            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-4 bg-[var(--category-primary-color)]/10 text-[var(--category-primary-color)] border border-[var(--category-primary-color)]/20 shadow-sm">
                                Katalog Global
                            </span>
                            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] transition-colors
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Telusuri<br />Koleksi Kami
                            </h2>
                        </div>

                        <div className="flex items-end justify-between mt-8">
                            <div className="flex flex-col">
                                <p className={`text-xs sm:text-sm font-semibold tracking-wide uppercase
                                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Total {totalItems} Produk
                                </p>
                                <div className="h-[2px] w-8 bg-[var(--category-primary-color)] mt-2.5 rounded-full group-hover:w-16 transition-all duration-700 ease-out" />
                            </div>

                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:translate-x-2 group-hover:scale-105 group-hover:shadow-lg bg-[var(--category-primary-color)] text-white shadow-[var(--category-primary-color)]/30">
                                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* DYNAMIC CATEGORY CARDS */}
                {categories?.map((cat, i) => {
                    const indexNumber = (i + 1).toString().padStart(2, '0');

                    // Logic grid bento: i % 3 === 0 jadi memanjang (col-span-2), sisanya kotak (col-span-1)
                    const isWide = i % 3 === 0;

                    return (
                        <div
                            key={i}
                            onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                            className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1.5 border
                            ${isWide ? 'col-span-2 md:col-span-2' : 'col-span-1 md:col-span-1'} 
                            ${isDarkMode
                                    ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                                    : 'bg-white border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-xl'}`}
                        >
                            {/* Hover Background Accent */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"
                                style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                            />

                            <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6 overflow-hidden flex-shrink-0"
                                        style={{ backgroundColor: isDarkMode ? "#fff" : `${'var(--category-primary-color)'}15` }}>
                                        {cat?.icon?.startsWith("http") ? (
                                            <img src={cat.icon} loading="lazy" className="w-full h-full object-cover" alt={cat.name} />
                                        ) : (
                                            <Icon
                                                icon={cat?.icon || 'lucide:box'}
                                                className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300"
                                                style={{ color: cat?.color || 'var(--category-primary-color)' }}
                                            />
                                        )}
                                    </div>

                                    {/* Number Index */}
                                    <span className={`text-xs font-bold opacity-30 group-hover:opacity-100 transition-opacity duration-500
                                        ${isDarkMode ? 'text-slate-100' : 'text-slate-400'}`}
                                    >
                                        {indexNumber}
                                    </span>
                                </div>

                                <div className="mt-4 sm:mt-6">
                                    <h3 className={`text-base sm:text-lg md:text-xl font-bold tracking-tight mb-1.5 truncate transition-colors duration-300
                                        ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {cat.name}
                                    </h3>
                                    <div className="flex items-center gap-2.5 mt-2">
                                        <div
                                            className="h-[2px] w-4 rounded-full opacity-40 transition-all duration-700 ease-out group-hover:w-10 group-hover:opacity-100"
                                            style={{ backgroundColor: 'var(--category-primary-color)' }}
                                        />
                                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest
                                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                            {cat.count || 0} Produk
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Image Reveal Decoration */}
                            {cat?.icon?.startsWith("http") && (
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-28 sm:h-28 opacity-0 group-hover:opacity-10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-[1500ms] ease-out pointer-events-none rounded-full overflow-hidden blur-[2px] group-hover:blur-sm z-0">
                                    <img src={cat.icon} loading="lazy" className="w-full h-full object-cover" alt="" />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Teen;