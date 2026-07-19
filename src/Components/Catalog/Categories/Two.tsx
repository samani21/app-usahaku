import React from 'react'
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Two = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-16 px-4 max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-8 md:gap-14">

                {/* TOMBOL SEMUA - Premium Clean Accent */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className="group flex flex-col items-center cursor-pointer w-20 md:w-28"
                >
                    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-5">
                        {/* Elegant Outer Ripple */}
                        <div className="absolute inset-0 rounded-full border border-[var(--category-primary-color)]/20 scale-100 group-hover:scale-[1.2] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />

                        {/* Soft Glow */}
                        <div className="absolute inset-2 rounded-full blur-xl bg-[var(--category-primary-color)] opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

                        {/* Main Circle */}
                        <div className={`relative z-10 w-full h-full rounded-full flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-xl border
                            ${isDarkMode ? 'bg-slate-800 border-slate-700 group-hover:border-slate-600' : 'bg-white border-slate-100 group-hover:border-slate-200'}`}>

                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className="w-8 h-8 md:w-10 md:h-10 text-[var(--category-primary-color)] transform transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                        </div>
                        <div
                            className={`absolute -top-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--category-primary-color)] flex items-center justify-center text-[10px] md:text-xs font-semibold text-white shadow-md border-[3px] z-20 transition-transform duration-500 group-hover:scale-110
                                    ${isDarkMode ? 'border-slate-900' : 'border-white'}`}
                        >
                            {totalItems}
                        </div>
                    </div>

                    {/* Modern Label */}
                    <div className="text-center">
                        <h3 className={`text-sm font-medium tracking-wide transition-colors duration-300 
                            ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                            Semua
                        </h3>
                        <div className="h-[2px] w-0 group-hover:w-full mx-auto mt-1.5 transition-all duration-500 rounded-full bg-[var(--category-primary-color)] opacity-0 group-hover:opacity-100" />
                    </div>
                </div>

                {/* CATEGORIES LOOP */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className="group flex flex-col items-center cursor-pointer w-20 md:w-28"
                    >
                        <div className="relative w-20 h-20 md:w-24 md:h-24 mb-5">

                            {/* Refined Colored Ripple */}
                            <div
                                className="absolute inset-0 rounded-full border scale-100 group-hover:scale-[1.2] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                                style={{ borderColor: `${cat?.color}40` }}
                            />

                            {/* Soft Cinematic Glow */}
                            <div
                                className="absolute inset-2 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                                style={{ backgroundColor: cat?.color }}
                            />

                            {/* Main Circle Holder */}
                            <div className={`relative z-10 w-full h-full rounded-full p-1 transition-all duration-500 shadow-sm group-hover:shadow-xl border
                                ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>

                                <div className={`w-full h-full rounded-full overflow-hidden relative flex items-center justify-center transition-colors duration-500
                                    ${!cat?.icon?.startsWith("http") && (isDarkMode ? 'group-hover:bg-slate-700/50' : 'group-hover:bg-slate-50')}`}>

                                    {cat?.icon?.startsWith("http") ? (
                                        <img
                                            src={cat.icon}
                                            className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                                            alt={cat.name}
                                        />
                                    ) : (
                                        <>
                                            {/* Subtle Decorative Background */}
                                            <div
                                                className="absolute inset-0 opacity-[0.03] scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-45"
                                                style={{ color: cat?.color }}
                                            >
                                                <Icon icon={cat?.icon || 'cbi:bulb-general-group'} className="w-full h-full" />
                                            </div>

                                            {/* Main Icon */}
                                            <Icon
                                                icon={cat?.icon || 'cbi:bulb-general-group'}
                                                className="w-8 h-8 md:w-10 md:h-10 relative z-10 transition-transform duration-500 ease-out group-hover:scale-110"
                                                style={{ color: cat?.color || (isDarkMode ? '#fff' : '#000') }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Sleek Integrated Badge */}
                            <div
                                className={`absolute -top-1 -right-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[var(--category-primary-color)] flex items-center justify-center text-[10px] md:text-xs font-semibold text-white shadow-md border-[3px] z-20 transition-transform duration-500 group-hover:scale-110
                                    ${isDarkMode ? 'border-slate-900' : 'border-white'}`}
                            >
                                {cat.count || 0}
                            </div>
                        </div>

                        {/* Modern Label */}
                        <div className="text-center w-full">
                            <h3 className={`text-sm font-medium tracking-wide truncate transition-colors duration-300 
                                ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            {/* Animated Underline */}
                            <div
                                className="h-[2px] w-0 group-hover:w-1/2 mx-auto mt-1.5 transition-all duration-500 ease-out rounded-full opacity-0 group-hover:opacity-100"
                                style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Two