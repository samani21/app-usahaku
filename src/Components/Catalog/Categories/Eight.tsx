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
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 px-4 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 shadow-sm hover:shadow-2xl border
                    ${isDarkMode
                            ? "bg-slate-800 border-white/5 hover:shadow-black/50"
                            : "bg-white border-slate-200/60 hover:shadow-slate-200/50"}`}
                >
                    {/* Inner Container (Padding for inner frame effect) */}
                    <div className="absolute inset-1.5 sm:inset-2 rounded-[1.5rem] overflow-hidden bg-slate-100">
                        <div className={`w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] group-hover:scale-110 ease-out
                            ${isDarkMode ? 'bg-slate-50' : 'bg-slate-50'}`}>
                            {/* Decorative Background Icon */}
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-full h-full opacity-[0.03] absolute scale-[2.5] -rotate-12 transition-transform duration-[2000ms] group-hover:rotate-0'
                            />
                            {/* Main Icon */}
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-1/2 h-1/2 relative z-0 text-[var(--category-primary-color)] transition-transform duration-700 group-hover:scale-110 drop-shadow-sm'
                            />
                        </div>

                        {/* Subtle Dark Gradient for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* Floating Glass Label */}
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10">
                        <div className={`backdrop-blur-md border p-3 flex items-center justify-between transition-all duration-500 rounded-2xl
                            ${isDarkMode
                                ? "bg-black/40 border-white/10 group-hover:bg-slate-800 group-hover:border-slate-700"
                                : "bg-white/20 border-white/40 group-hover:bg-white group-hover:border-white group-hover:shadow-xl"}`}>

                            <div className="flex flex-col overflow-hidden text-white group-hover:text-slate-900 transition-colors duration-500">
                                <h3 className={`font-bold text-xs sm:text-sm truncate tracking-tight
                                    ${isDarkMode && "group-hover:text-white"}`}>
                                    Semua Produk
                                </h3>
                                <span className={`text-[9px] sm:text-[10px] opacity-90 font-semibold tracking-widest uppercase mt-0.5
                                    ${isDarkMode && "group-hover:text-slate-400"}`}>
                                    {totalItems} Koleksi
                                </span>
                            </div>

                            <div className={`p-1.5 rounded-xl transition-all duration-500
                                ${isDarkMode ? "bg-slate-700 text-white group-hover:bg-[var(--category-primary-color)]" : "bg-white/30 text-white group-hover:bg-[var(--category-primary-color)] group-hover:text-white group-hover:shadow-md"}`}>
                                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:-translate-y-2 shadow-sm hover:shadow-2xl border
                        ${isDarkMode
                                ? "bg-slate-800 border-white/5 hover:shadow-black/50"
                                : "bg-white border-slate-200/60 hover:shadow-slate-200/50"}`}
                        style={{
                            boxShadow: !isDarkMode ? `0 20px 40px -20px ${cat?.color || 'var(--category-primary-color)'}30` : '',
                        }}
                    >
                        {/* Inner Container */}
                        <div className="absolute inset-1.5 sm:inset-2 rounded-[1.5rem] overflow-hidden bg-slate-900">
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 ease-out"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] group-hover:scale-110 ease-out relative"
                                    style={{ backgroundColor: `#fff` }}>
                                    <Icon
                                        icon={cat?.icon || 'lucide:box'}
                                        className='w-full h-full opacity-10 absolute scale-[2.5] -rotate-12 transition-transform duration-[2000ms] group-hover:rotate-0'
                                        style={{ color: cat?.color || 'var(--category-primary-color)' }}
                                    />
                                    <Icon
                                        icon={cat?.icon || 'lucide:box'}
                                        className='w-1/2 h-1/2 relative z-0 transition-transform duration-700 group-hover:scale-110 drop-shadow-sm'
                                        style={{ color: cat?.color || 'var(--category-primary-color)' }}
                                    />
                                </div>
                            )}

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                        </div>

                        {/* Floating Glass Label */}
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10">
                            <div className={`backdrop-blur-md border p-3 flex items-center justify-between transition-all duration-500 rounded-2xl
                                ${isDarkMode
                                    ? "bg-black/40 border-white/10 group-hover:bg-slate-800 group-hover:border-slate-700"
                                    : "bg-white/20 border-white/40 group-hover:bg-white group-hover:border-white group-hover:shadow-xl"}`}>

                                <div className="flex flex-col overflow-hidden text-white group-hover:text-slate-900 transition-colors duration-500">
                                    <h3 className={`font-bold text-xs sm:text-sm truncate tracking-tight
                                        ${isDarkMode && "group-hover:text-white"}`}>
                                        {cat.name}
                                    </h3>
                                    <span className={`text-[9px] sm:text-[10px] opacity-90 font-semibold tracking-widest uppercase mt-0.5
                                        ${isDarkMode && "group-hover:text-slate-400"}`}>
                                        {cat.count || 0} Produk
                                    </span>
                                </div>

                                {/* Button with Dynamic Category Color */}
                                <div
                                    className="p-1.5 rounded-xl transition-all duration-500 text-white group-hover:shadow-md"
                                    style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                                >
                                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Hover Subtle Border Inner Highlight */}
                        <div
                            className="absolute inset-0 border-2 border-transparent group-hover:border-current transition-colors duration-700 rounded-[2rem] pointer-events-none opacity-0 group-hover:opacity-10"
                            style={{ color: cat?.color || 'var(--category-primary-color)' }}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Eight;