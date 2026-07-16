import React from 'react'
import { CategoriesType } from "@/types/Admin/CategoriesType";
import { Icon } from "@iconify/react";
import { ArrowUpRight } from "lucide-react";

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Eight = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-sm hover:shadow-2xl border
                    ${isDarkMode
                            ? "bg-slate-800 border-white/5 hover:shadow-black/50"
                            : "bg-white border-slate-200 hover:shadow-slate-200"}`}
                >
                    {/* Inner Container (Padding for inner frame effect) */}
                    <div className="absolute inset-1.5 sm:inset-2 rounded-2xl overflow-hidden bg-slate-100">
                        <div className={`w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] group-hover:scale-105
                            ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                            {/* Decorative Background Icon */}
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-full h-full opacity-[0.03] absolute scale-[2] -rotate-12 transition-transform duration-[2000ms] group-hover:rotate-0'
                            />
                            {/* Main Icon */}
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-2/3 h-2/3 relative z-0 text-[var(--category-primary-color)] transition-transform duration-700 group-hover:scale-110'
                            />
                        </div>

                        {/* Subtle Dark Gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    </div>

                    {/* Floating Glass Label */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10">
                        <div className={`backdrop-blur-xl border p-3 flex items-center justify-between transition-all duration-500 rounded-2xl
                            ${isDarkMode
                                ? "bg-black/30 border-white/10 group-hover:bg-slate-800 group-hover:border-slate-700"
                                : "bg-white/20 border-white/30 group-hover:bg-white group-hover:border-white shadow-lg"}`}>

                            <div className="flex flex-col overflow-hidden text-white group-hover:text-slate-900 transition-colors duration-500">
                                <h3 className={`font-semibold text-xs sm:text-sm truncate tracking-tight
                                    ${isDarkMode && "group-hover:text-white"}`}>
                                    Semua Produk
                                </h3>
                                <span className={`text-[9px] sm:text-[10px] opacity-80 font-medium tracking-wider uppercase mt-0.5
                                    ${isDarkMode && "group-hover:text-slate-400"}`}>
                                    {totalItems} Koleksi
                                </span>
                            </div>

                            <div className={`p-1.5 rounded-xl transition-all duration-500
                                ${isDarkMode ? "bg-slate-700 text-white group-hover:bg-[var(--category-primary-color)]" : "bg-white/30 text-white group-hover:bg-[var(--category-primary-color)] group-hover:text-white"}`}>
                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative aspect-square rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1.5 shadow-sm hover:shadow-2xl border
                        ${isDarkMode
                                ? "bg-slate-800 border-white/5 hover:shadow-black/50"
                                : "bg-white border-slate-200 hover:shadow-slate-200"}`}
                        style={{
                            boxShadow: !isDarkMode ? `0 20px 40px -15px ${cat.color}20` : '',
                        }}
                    >
                        {/* Inner Container */}
                        <div className="absolute inset-1.5 sm:inset-2 rounded-2xl overflow-hidden">
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 ease-out"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] group-hover:scale-105"
                                    style={{ backgroundColor: `${cat.color}15` }}>
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-full h-full opacity-10 absolute scale-[2] -rotate-12 transition-transform duration-[2000ms] group-hover:rotate-0'
                                        style={{ color: cat.color }}
                                    />
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-2/3 h-2/3 relative z-0 transition-transform duration-700 group-hover:scale-110'
                                        style={{ color: cat.color }}
                                    />
                                </div>
                            )}

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                        </div>

                        {/* Floating Glass Label */}
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10">
                            <div className={`backdrop-blur-xl border p-3 flex items-center justify-between transition-all duration-500 rounded-2xl
                                ${isDarkMode
                                    ? "bg-black/30 border-white/10 group-hover:bg-slate-800 group-hover:border-slate-700"
                                    : "bg-white/20 border-white/30 group-hover:bg-white group-hover:border-white shadow-lg"}`}>

                                <div className="flex flex-col overflow-hidden text-white group-hover:text-slate-900 transition-colors duration-500">
                                    <h3 className={`font-semibold text-xs sm:text-sm truncate tracking-tight
                                        ${isDarkMode && "group-hover:text-white"}`}>
                                        {cat.name}
                                    </h3>
                                    <span className={`text-[9px] sm:text-[10px] opacity-80 font-medium tracking-wider uppercase mt-0.5
                                        ${isDarkMode && "group-hover:text-slate-400"}`}>
                                        {cat.count || 0} Produk
                                    </span>
                                </div>

                                <div className={`p-1.5 rounded-xl transition-all duration-500 text-white bg-[var(--category-primary-color)]`}>
                                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12" />
                                </div>
                            </div>
                        </div>

                        {/* Hover Subtle Border Inner Highlight */}
                        <div
                            className="absolute inset-0 border-2 border-transparent group-hover:border-current transition-colors duration-700 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-10"
                            style={{ color: cat.color || 'var(--category-primary-color)' }}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Eight