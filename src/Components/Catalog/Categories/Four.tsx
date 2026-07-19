import React from 'react'
import { ArrowUpRight } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Four = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* LIST ITEM: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative flex items-center p-4 sm:p-5 rounded-3xl transition-all duration-500 ease-out cursor-pointer border overflow-hidden
                    ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
                >
                    {/* Hover Left Indicator Line */}
                    <div className="absolute inset-y-6 left-0 w-1.5 bg-[var(--category-primary-color)] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out rounded-r-full" />

                    {/* Icon Container */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mr-5 flex-shrink-0">
                        <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6
                            ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-7 h-7 sm:w-8 sm:h-8 text-[var(--category-primary-color)]'
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className={`text-lg font-semibold tracking-tight transition-colors duration-300
                            ${isDarkMode ? 'text-white' : 'text-slate-900 group-hover:text-[var(--category-primary-color)]'}`}>
                            Semua Produk
                        </h3>
                        <p className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider mt-1
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {totalItems} Koleksi
                        </p>
                    </div>

                    {/* Action Icon (Smooth Slide-in) */}
                    <div className={`mr-2 p-2.5 rounded-full transition-all duration-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0
                        ${isDarkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-[var(--category-primary-color)]"}`}>
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:rotate-12" />
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`group relative flex items-center p-4 sm:p-5 rounded-3xl transition-all duration-500 ease-out cursor-pointer border overflow-hidden
                        ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'}`}
                    >
                        {/* Soft Hover Background Tint */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                            style={{ backgroundColor: cat.color }}
                        />

                        {/* Hover Left Indicator Line */}
                        <div
                            className="absolute inset-y-6 left-0 w-1.5 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out rounded-r-full z-10"
                            style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                        />

                        {/* Icon Container */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden mr-5 flex-shrink-0"
                            style={{ backgroundColor: `${cat.color}10` }}>
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-300'
                                        style={{ color: cat.color }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative z-10">
                            <h3 className={`text-lg font-semibold tracking-tight transition-colors duration-300 truncate
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {cat.name}
                            </h3>
                            <p className={`text-[11px] sm:text-xs font-medium uppercase tracking-wider mt-1
                            ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {cat.count || 0} Produk
                            </p>
                        </div>

                        {/* Action Icon (Smooth Slide-in) */}
                        <div
                            className="mr-2 p-2.5 rounded-full transition-all duration-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 z-10"
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:rotate-12" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Four