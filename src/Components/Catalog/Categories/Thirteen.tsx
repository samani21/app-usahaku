import React from 'react'
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Thirteen = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            {/* Wrapper Grid dengan border atas dan kiri untuk menghindari double-border */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l
                ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative p-6 sm:p-8 border-b border-r transition-colors duration-500 cursor-pointer flex flex-col h-full
                    ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                    <div className="flex items-start justify-between mb-8">
                        <h3 className={`text-sm sm:text-base font-medium uppercase tracking-[0.3em] transition-colors
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Semua
                        </h3>
                        <span className={`text-[10px] font-semibold tracking-widest uppercase opacity-40
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {totalItems} Item
                        </span>
                    </div>

                    {/* Visual Frame */}
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-10 bg-transparent flex items-center justify-center">
                        <div className={`w-full h-full flex items-center justify-center transition-transform duration-[1500ms] ease-out group-hover:scale-110
                            ${isDarkMode ? "bg-slate-800/50" : "bg-[var(--category-primary-color)]/5"}`}
                        >
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-20 h-20 text-[var(--category-primary-color)] opacity-80 group-hover:opacity-100 transition-opacity'
                            />
                        </div>
                    </div>

                    {/* Minimalist CTA */}
                    <div className="mt-auto">
                        <button className="flex items-center gap-4 font-semibold text-xs tracking-widest uppercase text-[var(--category-primary-color)] w-full">
                            Explore
                            <div className="flex-1 h-[1px] bg-[var(--category-primary-color)]/20 relative">
                                <div className="absolute top-0 left-0 h-full w-0 bg-[var(--category-primary-color)] transition-all duration-700 ease-out group-hover:w-full" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative p-6 sm:p-8 border-b border-r transition-colors duration-500 cursor-pointer flex flex-col h-full
                        ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/40' : 'border-slate-200 hover:bg-slate-50'}`}
                    >
                        <div className="flex items-start justify-between mb-8">
                            <h3 className={`text-sm sm:text-base font-medium uppercase tracking-[0.3em] transition-colors truncate pr-4
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            <span className={`text-[10px] font-semibold tracking-widest uppercase opacity-40 whitespace-nowrap
                                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {cat.count || 0} Item
                            </span>
                        </div>

                        {/* Visual Frame */}
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-10 flex items-center justify-center">
                            {cat?.icon?.startsWith("http") ? (
                                <div className="w-full h-full overflow-hidden">
                                    <img
                                        src={cat.icon}
                                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                                        alt={cat.name}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                                    style={{ backgroundColor: `${cat.color}10` }}>
                                    <Icon
                                        color={cat?.color}
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className="w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Minimalist CTA */}
                        <div className="mt-auto">
                            <button
                                className="flex items-center gap-4 font-semibold text-xs tracking-widest uppercase w-full transition-colors duration-300"
                                style={{ color: 'var(--category-primary-color)' }}
                            >
                                Explore
                                <div className="flex-1 h-[1px] relative opacity-30 group-hover:opacity-100 transition-opacity"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                    <div
                                        className="absolute top-0 left-0 h-full w-0 transition-all duration-700 ease-out group-hover:w-full"
                                        style={{ backgroundColor: 'var(--category-primary-color)' }}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Thirteen