import React from 'react'
import { ChevronRight } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Three = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {/* TOMBOL SEMUA - Premium Clean Card */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative p-7 rounded-3xl flex flex-col items-start justify-between min-h-[220px] transition-all duration-500 ease-out cursor-pointer border hover:-translate-y-1.5 overflow-hidden
                        ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600 shadow-none' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl'}`}
                >
                    {/* Subtle Background Glow */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none
                        ${isDarkMode ? 'bg-gradient-to-br from-white/[0.02] to-transparent' : 'bg-gradient-to-br from-slate-900/[0.01] to-transparent'}`}
                    />

                    {/* Top Icon Section */}
                    <div className="w-full flex justify-between items-start relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-md
                            ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}
                        >
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-7 h-7 text-[var(--category-primary-color)] transition-transform duration-500 group-hover:rotate-12'
                            />
                        </div>

                        <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0
                            ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mt-8 relative z-10 w-full">
                        <h3 className={`text-xl font-semibold tracking-tight leading-tight group-hover:translate-x-1 transition-transform duration-500
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Semua Kategori
                        </h3>
                        <div className="flex items-center mt-3">
                            <span className={`text-[11px] font-medium px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors
                                ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                {totalItems} Koleksi
                            </span>
                        </div>

                        {/* Bottom Elegant Accent Line */}
                        <div className={`w-full h-[2px] mt-6 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                            <div className="w-4 group-hover:w-full h-full bg-[var(--category-primary-color)] transition-all duration-700 ease-in-out" />
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative p-7 rounded-3xl flex flex-col items-start justify-between min-h-[220px] transition-all duration-500 ease-out cursor-pointer border hover:-translate-y-1.5 overflow-hidden
                        ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        style={{
                            boxShadow: !isDarkMode ? `0 10px 40px -10px ${cat.color}15` : '',
                        }}
                    >
                        {/* Soft Color Splash Background (Hover) */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none"
                            style={{ backgroundColor: cat.color }}
                        />

                        {/* Top Icon Section */}
                        <div className="w-full flex justify-between items-start relative z-10">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:shadow-md overflow-hidden"
                                style={{ backgroundColor: `${cat.color}10` }}>

                                {cat?.icon?.startsWith("http") ? (
                                    <img
                                        src={cat.icon}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={cat.name}
                                    />
                                ) : (
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-7 h-7 transition-transform duration-500 group-hover:rotate-12'
                                        style={{ color: cat.color }}
                                    />
                                )}
                            </div>

                            <div
                                className="p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0"
                                style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="mt-8 relative z-10 w-full">
                            <h3 className={`text-xl font-semibold tracking-tight leading-tight group-hover:translate-x-1 transition-transform duration-500 truncate
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            <div className="flex items-center mt-3">
                                <span className={`text-[11px] font-medium px-3 py-1.5 rounded-md uppercase tracking-wider transition-colors
                                ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                                    {cat.count || 0} Produk
                                </span>
                            </div>

                            {/* Bottom Elegant Accent Line */}
                            <div className={`w-full h-[2px] mt-6 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
                                <div
                                    className="w-4 group-hover:w-full h-full transition-all duration-700 ease-in-out"
                                    style={{ backgroundColor: cat.color }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Three