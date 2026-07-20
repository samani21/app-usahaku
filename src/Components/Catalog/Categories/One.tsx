import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import React from 'react'

type Props = {
    isDarkMode: boolean;
    categories: CategoriesType[];
    onClick?: (v: string | null) => void;
}

const One = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories?.reduce((sum, cat) => sum + (cat.count || 0), 0) || 0;

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
            {/* 
                Bento Grid Layout:
                Mobile: 1 Kolom (col-span-1)
                Tablet: 2 Kolom (col-span-2)
                Desktop: 3 atau 4 Kolom 
            */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[180px]">

                {/* TOMBOL "SEMUA" - Bento Box Utama (Selalu makan lebar penuh di row pertama) */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`relative group overflow-hidden rounded-[1.5rem] sm:rounded-3xl cursor-pointer col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl border
                        ${isDarkMode
                            ? "bg-slate-800/80 border-white/10 hover:bg-slate-800"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"
                        }`}
                >
                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
                        <LayoutGrid className="w-full h-full p-4 -rotate-6 scale-125" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-8">
                        <div className="z-10 flex flex-col justify-center h-full">
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1 sm:mb-2 text-[var(--category-primary-color,#6366f1)]">
                                Explorasi
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
                                Semua Kategori
                            </h3>
                            <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                Telusuri {totalItems} Koleksi Spesial
                            </p>
                        </div>
                        <div className={`p-3 rounded-full transition-all duration-500 group-hover:translate-x-2 shadow-sm
                            ${isDarkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900"}`}>
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* CATEGORIES LOOP */}
                {categories?.map((cat, i) => {
                    const isImage = cat?.icon?.startsWith("http");

                    return isImage ? (
                        /* ================= IMAGE CATEGORY ================= */
                        <div
                            key={i}
                            onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                            className={`relative group overflow-hidden rounded-[1.5rem] sm:rounded-3xl cursor-pointer col-span-1 row-span-1 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl border
                                ${isDarkMode ? "bg-slate-800/80 border-white/10" : "bg-white border-slate-200"}`}
                        >
                            {/* Image Layer - Cinematic Zoom */}
                            <img
                                src={cat.icon}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                alt={cat.name}
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-90 transition-opacity duration-500" />

                            {/* Content Section */}
                            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-10">
                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight mb-1.5">
                                        {cat.name}
                                    </h3>
                                    <div className="flex items-center gap-3 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                                        <p className="text-slate-200 text-xs sm:text-sm font-medium">
                                            {cat?.count || 0} Produk
                                        </p>
                                        <div className="h-[2px] w-0 group-hover:w-8 bg-white/70 transition-all duration-700 ease-out rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Action Button (Pojok Kanan Atas) */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                                <div className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-black transition-colors shadow-sm">
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ================= ICON CATEGORY ================= */
                        <div
                            key={i}
                            onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                            className={`relative group overflow-hidden rounded-[1.5rem] sm:rounded-3xl cursor-pointer col-span-1 row-span-1 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl border
                                ${isDarkMode ? "bg-slate-800/80 border-white/10 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                        >
                            {/* Watermark Icon (Besar di background) */}
                            <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700 pointer-events-none">
                                <Icon
                                    icon={cat?.icon || 'lucide:box'}
                                    className="w-40 h-40 sm:w-48 sm:h-48"
                                    color={cat?.color || (isDarkMode ? '#ffffff' : '#000000')}
                                />
                            </div>

                            {/* Konten */}
                            <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 z-10">
                                <div className="flex justify-between items-start">
                                    {/* Small Icon Badge */}
                                    <div
                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                                        style={{ backgroundColor: isDarkMode ? "#fff" : `${cat?.color || 'var(--category-primary-color)'}20` }}
                                    >
                                        <Icon
                                            icon={cat?.icon || 'lucide:box'}
                                            className="w-5 h-5 sm:w-6 sm:h-6"
                                            color={cat?.color || 'var(--category-primary-color)'}
                                        />
                                    </div>

                                    {/* Arrow Navigation */}
                                    <div className={`p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shadow-sm
                                        ${isDarkMode ? "bg-slate-700 text-white" : "bg-white border text-slate-900"}`}>
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-1 line-clamp-1 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                        {cat?.name}
                                    </h3>
                                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        {cat?.count || 0} Produk
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}

export default One;