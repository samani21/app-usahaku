import React, { useState } from 'react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Fifteen = ({ categories, isDarkMode, onClick }: Props) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hoveredSemua, setHoveredSemua] = useState<boolean>(false);

    // Optional chaining added to prevent errors on empty array
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto w-full">
            <div className="flex flex-col gap-3 md:gap-4">

                {/* DIRECTORY ITEM: SEMUA KATEGORI */}
                <div
                    onMouseEnter={() => setHoveredSemua(true)}
                    onMouseLeave={() => setHoveredSemua(false)}
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative flex items-center justify-between p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden border
                        ${isDarkMode
                            ? 'bg-slate-800/40 border-transparent hover:border-slate-700 hover:bg-slate-800/80'
                            : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-xl'}`}
                >
                    {/* Background Reveal (Floating Image/Icon) */}
                    <div className="absolute right-[10%] md:right-[20%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 opacity-0 transition-all duration-[1000ms] ease-out pointer-events-none scale-75 rotate-12 group-hover:opacity-[0.04] group-hover:scale-100 group-hover:-rotate-6">
                        <Icon icon={'cbi:bulb-general-group'} className='w-full h-full text-[var(--category-primary-color)]' />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 flex items-center gap-4 sm:gap-6 md:gap-10">
                        <span className={`text-2xl sm:text-3xl md:text-5xl font-light opacity-30 group-hover:opacity-100 transition-colors duration-500 
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                            style={{ color: hoveredSemua ? 'var(--category-primary-color)' : '' }}>
                            00
                        </span>
                        <div className="flex flex-col">
                            <h3 className={`text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight transition-all duration-500 ease-out group-hover:translate-x-2
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                style={{ color: hoveredSemua ? 'var(--category-primary-color)' : '' }}>
                                Semua Koleksi
                            </h3>
                            <p className="text-[9px] sm:text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase opacity-50 mt-2 md:mt-3 group-hover:translate-x-4 transition-all duration-700 ease-out">
                                {totalItems} Item Tersedia
                            </p>
                        </div>
                    </div>

                    {/* Action Icon */}
                    <div
                        className={`relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 shadow-xl text-white`}
                        style={{ backgroundColor: 'var(--category-primary-color)' }}
                    >
                        <Icon icon="solar:arrow-right-up-bold" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                    </div>

                    {/* Bottom Line Decor */}
                    <div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-[1000ms] ease-out w-0 group-hover:w-full opacity-20"
                        style={{ color: 'var(--category-primary-color)' }}
                    />
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => {
                    const indexNumber = (i + 1).toString().padStart(2, '0');
                    const isHovered = hoveredIndex === i;
                    const activeColor = cat?.color || 'var(--category-primary-color)';

                    return (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => {
                                onClick?.(cat.name === "Semua" ? null : cat.name);
                                handleScroll();
                            }}
                            className={`group relative flex items-center justify-between p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden border
                                ${isDarkMode
                                    ? 'bg-slate-800/40 border-transparent hover:border-slate-700 hover:bg-slate-800/80'
                                    : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-xl'}`}
                        >
                            {/* Background Reveal (Floating Image/Icon) */}
                            <div className="absolute right-[10%] md:right-[20%] top-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 opacity-0 transition-all duration-[1000ms] ease-out pointer-events-none scale-75 rotate-12 group-hover:opacity-[0.08] group-hover:scale-100 group-hover:-rotate-6">
                                {cat?.icon?.startsWith("http") ? (
                                    <img src={cat.icon} loading="lazy" className="w-full h-full object-contain grayscale-[0.5]" alt={cat.name} />
                                ) : (
                                    <Icon icon={cat?.icon || 'cbi:bulb-general-group'} color={activeColor} className='w-full h-full' />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 flex items-center gap-4 sm:gap-6 md:gap-10">
                                <span
                                    className={`text-2xl sm:text-3xl md:text-5xl font-light opacity-30 group-hover:opacity-100 transition-colors duration-500
                                    ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                    style={{ color: isHovered ? activeColor : '' }}
                                >
                                    {indexNumber}
                                </span>
                                <div className="flex flex-col">
                                    <h3
                                        className={`text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight transition-all duration-500 ease-out group-hover:translate-x-2
                                        ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                        style={{ color: isHovered ? activeColor : '' }}
                                    >
                                        {cat.name}
                                    </h3>
                                    <p className="text-[9px] sm:text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase opacity-50 mt-2 md:mt-3 group-hover:translate-x-4 transition-all duration-700 ease-out">
                                        {cat.count || 0} Item Tersedia
                                    </p>
                                </div>
                            </div>

                            {/* Action Icon (Now uses Category Color) */}
                            <div
                                className={`relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 shadow-xl text-white`}
                                style={{ backgroundColor: activeColor }}
                            >
                                <Icon icon="solar:arrow-right-up-bold" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                            </div>

                            {/* Bottom Line Decor (Now uses Category Color) */}
                            <div
                                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-[1000ms] ease-out w-0 group-hover:w-full opacity-30"
                                style={{ color: activeColor }}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Fifteen;