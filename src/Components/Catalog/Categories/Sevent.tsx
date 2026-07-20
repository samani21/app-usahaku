import React from 'react';
import { CategoriesType } from "@/types/Admin/CategoriesType";
import { ArrowRight } from "lucide-react";

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Sevent = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

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
        <section className="py-10 sm:py-16 md:py-20 px-4 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-24 gap-y-10 sm:gap-y-14">

                {/* LIST ITEM: SEMUA KATEGORI */}
                <div
                    onClick={() => {
                        onClick?.(null)
                        handleScroll()
                    }}
                    className="group relative flex items-start gap-4 sm:gap-8 pb-8 cursor-pointer overflow-hidden"
                >
                    {/* Animated Bottom Border */}
                    <div className={`absolute bottom-0 left-0 w-full h-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--category-primary-color)] transition-all duration-700 ease-out group-hover:w-full" />

                    {/* Editorial Number Index */}
                    <div className="relative w-12 sm:w-16 flex-shrink-0 pt-1">
                        {/* Static Default Color */}
                        <span className="absolute top-0 left-0 text-4xl sm:text-5xl font-extralight text-slate-400 opacity-40 transition-opacity duration-500 group-hover:opacity-0">
                            01
                        </span>
                        {/* Hover Colored Element */}
                        <span className="absolute top-0 left-0 text-4xl sm:text-5xl font-extralight text-[var(--category-primary-color)] opacity-0 -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                            01
                        </span>
                        {/* Spacer for layout */}
                        <span className="text-4xl sm:text-5xl font-extralight opacity-0 pointer-events-none">01</span>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-1 sm:mb-2 transition-transform duration-500 ease-out group-hover:translate-x-2 truncate
                            ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Semua Kategori
                        </h3>
                        <p className={`text-xs sm:text-sm font-medium mb-5 sm:mb-6 transition-colors duration-300
                            ${isDarkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-700"}`}>
                            {totalItems} Koleksi Tersedia
                        </p>

                        {/* Call to Action with Sliding Arrow */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[var(--category-primary-color)] transition-transform duration-500 group-hover:translate-x-1">
                                Jelajahi Sekarang
                            </span>
                            <ArrowRight
                                className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--category-primary-color)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 ease-out"
                            />
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => {
                    // Logic agar format nomor selalu 2 digit (02, 03.. 10, 11, dst)
                    const indexNumber = (i + 2).toString().padStart(2, '0');

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                onClick?.(cat?.name)
                                handleScroll()
                            }}
                            className="group relative flex items-start gap-4 sm:gap-8 pb-8 cursor-pointer overflow-hidden"
                        >
                            {/* Animated Bottom Border */}
                            <div className={`absolute bottom-0 left-0 w-full h-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />
                            <div
                                className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-700 ease-out group-hover:w-full"
                                style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                            />

                            {/* Editorial Number Index */}
                            <div className="relative w-12 sm:w-16 flex-shrink-0 pt-1">
                                {/* Static Default Color */}
                                <span className="absolute top-0 left-0 text-4xl sm:text-5xl font-extralight text-slate-400 opacity-40 transition-opacity duration-500 group-hover:opacity-0">
                                    {indexNumber}
                                </span>
                                {/* Hover Colored Element (Crossfade) */}
                                <span
                                    className="absolute top-0 left-0 text-4xl sm:text-5xl font-extralight opacity-0 -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                                    style={{ color: cat.color || 'var(--category-primary-color)' }}
                                >
                                    {indexNumber}
                                </span>
                                {/* Spacer for layout */}
                                <span className="text-4xl sm:text-5xl font-extralight opacity-0 pointer-events-none">{indexNumber}</span>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-1 sm:mb-2 transition-transform duration-500 ease-out group-hover:translate-x-2 truncate
                                    ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {cat.name}
                                </h3>
                                <p className={`text-xs sm:text-sm font-medium mb-5 sm:mb-6 transition-colors duration-300
                                    ${isDarkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-700"}`}>
                                    {cat.count || 0} Produk Tersedia
                                </p>

                                {/* Call to Action with Sliding Arrow */}
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase transition-transform duration-500 group-hover:translate-x-1"
                                        style={{ color: 'var(--category-primary-color)' }}
                                    >
                                        Jelajahi Sekarang
                                    </span>
                                    <ArrowRight
                                        className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 ease-out"
                                        style={{ color: 'var(--category-primary-color)' }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}

export default Sevent;