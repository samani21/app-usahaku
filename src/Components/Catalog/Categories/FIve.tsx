import { CategoriesType } from "@/types/Admin/CategoriesType";
import { Icon } from "@iconify/react";
import { ArrowUpRight } from "lucide-react";
import React from "react";

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Five = ({ categories, isDarkMode, onClick }: Props) => {

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    return (
        <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto w-full">
            {/* Flex Wrap Container untuk efek 'Chips/Tags' */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">

                {/* TOMBOL "SEMUA" - Standar UX Premium */}
                <button
                    onClick={() => {
                        onClick?.(null)
                        handleScroll()
                    }}
                    className={`group relative flex items-center justify-between gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-500 ease-out border w-full sm:w-auto overflow-hidden
                        ${isDarkMode
                            ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 shadow-none"
                            : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm hover:shadow-md"}`}
                >
                    {/* Hover Tint */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none bg-[var(--category-primary-color)]" />

                    <div className="flex items-center gap-3">
                        <div className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center shadow-sm
                            ${isDarkMode ? "bg-white" : "bg-slate-50"}`}>
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-4 h-4 sm:w-5 sm:h-5 text-[var(--category-primary-color)]'
                            />
                        </div>

                        <span className="relative z-10 text-sm sm:text-base font-semibold tracking-tight">
                            Semua Kategori
                        </span>
                    </div>

                    <div className="relative z-10 w-0 group-hover:w-5 transition-all duration-500 overflow-hidden flex items-center justify-end">
                        <ArrowUpRight
                            className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 text-[var(--category-primary-color)]"
                        />
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-[60%] transition-all duration-500 ease-out rounded-t-full bg-[var(--category-primary-color)] opacity-0 group-hover:opacity-100" />
                </button>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            onClick?.(cat?.name)
                            handleScroll()
                        }}
                        className={`group relative flex items-center justify-between gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-500 ease-out border w-full sm:w-auto overflow-hidden
                            ${isDarkMode
                                ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800 shadow-none"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm hover:shadow-md"}`}
                    >
                        {/* Hover Tint based on category color */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                            style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                        />

                        <div className="flex items-center gap-3">
                            <div
                                className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-110 shadow-sm"
                                style={{ backgroundColor: isDarkMode ? "#fff" : `${'var(--category-primary-color)'}15` }}
                            >
                                {cat?.icon?.startsWith("http") ? (
                                    <img
                                        src={cat.icon}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                        alt={cat.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                                        <Icon
                                            icon={cat?.icon || 'lucide:box'}
                                            className='w-4 h-4 sm:w-4 sm:h-4'
                                            style={{ color: cat.color || 'var(--category-primary-color)' }}
                                        />
                                    </div>
                                )}
                            </div>

                            <span className="relative z-10 text-sm sm:text-base font-semibold tracking-tight truncate">
                                {cat.name}
                            </span>
                        </div>

                        {/* Animated Arrow Icon */}
                        <div className="relative z-10 w-0 group-hover:w-5 transition-all duration-500 overflow-hidden flex items-center justify-end">
                            <ArrowUpRight
                                className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500"
                                style={{ color: cat.color || 'var(--category-primary-color)' }}
                            />
                        </div>

                        {/* Bottom Indicator Line */}
                        <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-[60%] transition-all duration-500 ease-out rounded-t-full opacity-0 group-hover:opacity-100"
                            style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                        />
                    </button>
                ))}
            </div>
        </section>
    )
}

export default Five;