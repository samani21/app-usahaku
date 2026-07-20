import React from 'react'
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Three = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 md:py-20 px-4 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">

                {/* TOMBOL SEMUA - Premium Glass Card */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative p-6 sm:p-7 rounded-[2rem] flex flex-col items-start justify-between min-h-[200px] sm:min-h-[220px] transition-all duration-500 ease-out cursor-pointer border hover:-translate-y-2 overflow-hidden backdrop-blur-xl
                        ${isDarkMode
                            ? 'bg-slate-800/80 border-slate-700/60 hover:border-slate-500/60 shadow-none'
                            : 'bg-white/90 border-slate-200/60 hover:border-slate-300/80 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50'}`}
                >
                    {/* Subtle Background Glow */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
                        ${isDarkMode ? 'bg-gradient-to-br from-white/[0.03] to-transparent' : 'bg-gradient-to-br from-[var(--category-primary-color)]/[0.02] to-transparent'}`}
                    />

                    {/* Top Icon Section */}
                    <div className="w-full flex justify-between items-start relative z-10">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-md
                            ${isDarkMode ? 'bg-white' : 'bg-slate-50'}`}
                        >
                            <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--category-primary-color)] transition-transform duration-500 group-hover:rotate-6" />
                        </div>

                        <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 shadow-sm
                            ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-white border text-slate-900'}`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mt-8 relative z-10 w-full">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--category-primary-color)] mb-2 block opacity-80 group-hover:opacity-100 transition-opacity">
                            Explorasi
                        </span>
                        <h3 className={`text-xl sm:text-2xl font-bold tracking-tight leading-tight group-hover:translate-x-1 transition-transform duration-500
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Semua Kategori
                        </h3>
                        <div className="flex items-center mt-3">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors
                                ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-slate-100/80 text-slate-600'}`}>
                                {totalItems} Koleksi
                            </span>
                        </div>

                        {/* Bottom Elegant Accent Line */}
                        <div className={`w-full h-[3px] mt-6 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                            <div className="w-6 group-hover:w-full h-full bg-[var(--category-primary-color)] transition-all duration-700 ease-in-out" />
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative p-6 sm:p-7 rounded-[2rem] flex flex-col items-start justify-between min-h-[200px] sm:min-h-[220px] transition-all duration-500 ease-out cursor-pointer border hover:-translate-y-2 overflow-hidden backdrop-blur-xl
                            ${isDarkMode
                                ? 'bg-slate-800/80 border-slate-700/60 hover:border-slate-500/60'
                                : 'bg-white/90 border-slate-200/60 hover:border-slate-300/80'}`}
                        style={{
                            boxShadow: !isDarkMode ? `0 10px 40px -10px ${cat?.color || 'var(--category-primary-color)'}15` : '',
                        }}
                    >
                        {/* Soft Color Splash Background (Hover) */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none"
                            style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                        />

                        {/* Top Icon Section */}
                        <div className="w-full flex justify-between items-start relative z-10">
                            <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-md overflow-hidden"
                                style={{ backgroundColor: isDarkMode ? "#FFF" : `${'var(--category-primary-color)'}15` }}
                            >

                                {cat?.icon?.startsWith("http") ? (
                                    <img
                                        src={cat.icon}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                        alt={cat.name}
                                    />
                                ) : (
                                    <Icon
                                        icon={cat?.icon || 'lucide:box'}
                                        className='w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500 group-hover:rotate-6'
                                        style={{ color: cat?.color || 'var(--category-primary-color)' }}
                                    />
                                )}
                            </div>

                            <div
                                className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 shadow-sm"
                                style={{
                                    backgroundColor: isDarkMode ? `${cat?.color || 'var(--category-primary-color)'}20` : `${cat?.color || 'var(--category-primary-color)'}15`,
                                    color: cat?.color || 'var(--category-primary-color)'
                                }}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="mt-8 relative z-10 w-full">
                            <span
                                className="text-[10px] font-bold uppercase tracking-widest mb-2 block opacity-80 group-hover:opacity-100 transition-opacity truncate"
                                style={{ color: 'var(--category-primary-color)' }}
                            >
                                Kategori
                            </span>
                            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight leading-tight group-hover:translate-x-1 transition-transform duration-500 truncate
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            <div className="flex items-center mt-3">
                                <span className={`text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors
                                    ${isDarkMode ? 'bg-slate-900/50 text-slate-300' : 'bg-slate-100/80 text-slate-600'}`}>
                                    {cat.count || 0} Produk
                                </span>
                            </div>

                            {/* Bottom Elegant Accent Line */}
                            <div className={`w-full h-[3px] mt-6 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                                <div
                                    className="w-6 group-hover:w-full h-full transition-all duration-700 ease-in-out"
                                    style={{ backgroundColor: 'var(--category-primary-color)' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Three;