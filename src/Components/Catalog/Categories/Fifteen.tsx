import React, { useState } from 'react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Fiften = ({ categories, isDarkMode, onClick }: Props) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [hoveredSemua, setHoveredSemua] = useState<boolean>(false);
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col gap-3">

                {/* DIRECTORY ITEM: SEMUA KATEGORI */}
                <div
                    onMouseEnter={() => setHoveredSemua(true)}
                    onMouseLeave={() => setHoveredSemua(false)}
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`group relative flex items-center justify-between p-6 md:p-10 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden border
                        ${isDarkMode
                            ? 'bg-slate-800/40 border-transparent hover:border-slate-700 hover:bg-slate-800/80'
                            : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-xl'}`}
                >
                    {/* Background Reveal (Floating Image/Icon) */}
                    <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 opacity-0 transition-all duration-[1000ms] ease-out pointer-events-none scale-75 rotate-12 group-hover:opacity-[0.04] group-hover:scale-100 group-hover:-rotate-6">
                        <Icon icon={'cbi:bulb-general-group'} className='w-full h-full text-[var(--category-primary-color)]' />
                    </div>

                    {/* Text Content */}
                    <div className="relative z-10 flex items-center gap-6 md:gap-12">
                        <span className={`text-3xl md:text-5xl font-light opacity-30 group-hover:opacity-100 transition-opacity duration-500 
                            ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                            style={{ color: hoveredSemua ? 'var(--category-primary-color)' : '' }}>
                            00
                        </span>
                        <div className="flex flex-col">
                            <h3 className={`text-3xl md:text-5xl font-semibold tracking-tight transition-all duration-500 ease-out group-hover:translate-x-2
                                ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                style={{ color: hoveredSemua ? 'var(--category-primary-color)' : '' }}>
                                Semua Koleksi
                            </h3>
                            <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase opacity-50 mt-3 group-hover:translate-x-4 transition-all duration-700 ease-out">
                                {totalItems} Item Tersedia
                            </p>
                        </div>
                    </div>

                    {/* Action Icon */}
                    <div
                        className={`relative z-10 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 shadow-xl
                        ${isDarkMode ? 'text-white' : 'text-white'}`}
                        style={{ backgroundColor: 'var(--category-primary-color)' }}
                    >
                        <Icon icon="solar:arrow-right-up-bold" className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                    </div>

                    {/* Bottom Line Decor */}
                    <div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-[1000ms] ease-out w-0 group-hover:w-full opacity-20"
                        style={{ color: 'var(--category-primary-color)' }}
                    />
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => {
                    const indexNumber = (i + 1).toString().padStart(2, '0');
                    const isHovered = hoveredIndex === i;

                    return (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => {
                                onClick?.(cat.name === "Semua" ? null : cat.name);
                                handleScroll();
                            }}
                            className={`group relative flex items-center justify-between p-6 md:p-10 rounded-3xl cursor-pointer transition-all duration-500 overflow-hidden border
                                ${isDarkMode
                                    ? 'bg-slate-800/40 border-transparent hover:border-slate-700 hover:bg-slate-800/80'
                                    : 'bg-transparent border-transparent hover:border-slate-200 hover:bg-slate-50 hover:shadow-xl'}`}
                        >
                            {/* Background Reveal (Floating Image/Icon) */}
                            <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 opacity-0 transition-all duration-[1000ms] ease-out pointer-events-none scale-75 rotate-12 group-hover:opacity-[0.08] group-hover:scale-100 group-hover:-rotate-6">
                                {cat?.icon?.startsWith("http") ? (
                                    <img src={cat.icon} className="w-full h-full object-contain grayscale-[0.5]" alt="" />
                                ) : (
                                    <Icon icon={cat?.icon || 'cbi:bulb-general-group'} color={cat.color || 'var(--category-primary-color)'} className='w-full h-full' />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 flex items-center gap-6 md:gap-12">
                                <span
                                    className={`text-3xl md:text-5xl font-light opacity-30 group-hover:opacity-100 transition-opacity duration-500
                                    ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                    style={{ color: isHovered ? (cat.color || 'var(--category-primary-color)') : '' }}
                                >
                                    {indexNumber}
                                </span>
                                <div className="flex flex-col">
                                    <h3
                                        className={`text-3xl md:text-5xl font-semibold tracking-tight transition-all duration-500 ease-out group-hover:translate-x-2
                                        ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                        style={{ color: isHovered ? (cat.color || 'var(--category-primary-color)') : '' }}
                                    >
                                        {cat.name}
                                    </h3>
                                    <p className="text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase opacity-50 mt-3 group-hover:translate-x-4 transition-all duration-700 ease-out">
                                        {cat.count || 0} Item Tersedia
                                    </p>
                                </div>
                            </div>

                            {/* Action Icon */}
                            <div
                                className={`relative z-10 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ease-out scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 shadow-xl text-white`}
                                style={{ backgroundColor: 'var(--category-primary-color)' }}
                            >
                                <Icon icon="solar:arrow-right-up-bold" className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                            </div>

                            {/* Bottom Line Decor */}
                            <div
                                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-[1000ms] ease-out w-0 group-hover:w-full opacity-20"
                                style={{ color: 'var(--category-primary-color)' }}
                            />
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Fiften;