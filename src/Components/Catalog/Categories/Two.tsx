import React from 'react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';
import { LayoutGrid } from 'lucide-react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Two = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 md:py-20 px-4 max-w-7xl mx-auto">
            {/* Flex-wrap dengan gap yang disesuaikan untuk Mobile, Tablet, dan Desktop */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-14">

                {/* TOMBOL SEMUA - Premium Clean Accent */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className="group flex flex-col items-center cursor-pointer w-16 sm:w-20 md:w-24"
                >
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 md:mb-5">
                        {/* Elegant Outer Ripple */}
                        <div className="absolute inset-0 rounded-full border border-[var(--category-primary-color)]/30 scale-100 group-hover:scale-[1.15] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out" />

                        {/* Soft Glow */}
                        <div className="absolute inset-2 rounded-full blur-xl bg-[var(--category-primary-color)] opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

                        {/* Main Circle */}
                        <div className={`relative z-10 w-full h-full rounded-full flex items-center justify-center transition-all duration-500 shadow-sm group-hover:shadow-xl border
                            ${isDarkMode ? 'bg-white border-slate-700 group-hover:border-slate-600' : 'bg-white border-slate-100 group-hover:border-slate-200'}`}>

                            <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[var(--category-primary-color)] transform transition-transform duration-500 ease-out group-hover:scale-110" />
                        </div>

                        {/* Badge Count */}
                        <div
                            className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[var(--category-primary-color)] flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-bold text-white shadow-md border-[2px] sm:border-[3px] z-20 transition-transform duration-500 group-hover:scale-110
                                ${isDarkMode ? 'border-slate-900' : 'border-white'}`}
                        >
                            {totalItems}
                        </div>
                    </div>

                    {/* Modern Label */}
                    <div className="text-center w-full px-1">
                        <h3 className={`text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 truncate
                            ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                            Semua
                        </h3>
                        <div className="h-[2px] w-0 group-hover:w-1/2 mx-auto mt-1 sm:mt-1.5 transition-all duration-500 ease-out rounded-full bg-[var(--category-primary-color)] opacity-0 group-hover:opacity-100" />
                    </div>
                </div>

                {/* CATEGORIES LOOP */}
                {categories?.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className="group flex flex-col items-center cursor-pointer w-16 sm:w-20 md:w-24"
                    >
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 md:mb-5">

                            {/* Refined Colored Ripple */}
                            <div
                                className="absolute inset-0 rounded-full border scale-100 group-hover:scale-[1.15] opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                                style={{ borderColor: `${cat?.color || 'var(--category-primary-color)'}50` }}
                            />

                            {/* Soft Cinematic Glow */}
                            <div
                                className="absolute inset-2 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                                style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                            />

                            {/* Main Circle Holder */}
                            <div className={`relative z-10 w-full h-full rounded-full p-1 transition-all duration-500 shadow-sm group-hover:shadow-xl border
                                ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>

                                <div className={`w-full h-full rounded-full overflow-hidden relative flex items-center justify-center transition-colors duration-500
                                    ${!cat?.icon?.startsWith("http") && (isDarkMode ? 'bg-white group-hover:bg-slate-700/50' : 'group-hover:bg-slate-50')}`}>

                                    {cat?.icon?.startsWith("http") ? (
                                        <img
                                            src={cat.icon}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                                            alt={cat.name}
                                        />
                                    ) : (
                                        <>
                                            {/* Subtle Decorative Background */}
                                            <div
                                                className="absolute inset-0 opacity-[0.03] scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-45 pointer-events-none"
                                                style={{ color: cat?.color || 'var(--category-primary-color)' }}
                                            >
                                                <Icon icon={cat?.icon || 'lucide:box'} className="w-full h-full" />
                                            </div>

                                            {/* Main Icon */}
                                            <Icon
                                                icon={cat?.icon || 'lucide:box'}
                                                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 relative z-10 transition-transform duration-500 ease-out group-hover:scale-110"
                                                style={{ color: cat?.color || (isDarkMode ? '#ffffff' : '#000000') }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Sleek Integrated Badge */}
                            <div
                                className={`absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs font-bold text-white shadow-md border-[2px] sm:border-[3px] z-20 transition-transform duration-500 group-hover:scale-110
                                    ${isDarkMode ? 'border-slate-900' : 'border-white'}`}
                                style={{ backgroundColor: 'var(--category-primary-color)' }}
                            >
                                {cat.count || 0}
                            </div>
                        </div>

                        {/* Modern Label */}
                        <div className="text-center w-full px-1">
                            <h3 className={`text-xs sm:text-sm font-medium tracking-wide truncate transition-colors duration-300 
                                ${isDarkMode ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            {/* Animated Underline */}
                            <div
                                className="h-[2px] w-0 group-hover:w-1/2 mx-auto mt-1 sm:mt-1.5 transition-all duration-500 ease-out rounded-full opacity-0 group-hover:opacity-100"
                                style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Two;