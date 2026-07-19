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
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 auto-rows-[140px] sm:auto-rows-[180px]">

                {/* TOMBOL "SEMUA" - Premium Clean Navigation */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`relative group overflow-hidden rounded-3xl cursor-pointer col-span-2 row-span-1 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl border
                      ${isDarkMode
                            ? "bg-slate-800/80 border-white/10 hover:bg-slate-800"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-900"}`}
                >
                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                        <LayoutGrid className="w-full h-full p-4 -rotate-12" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-between px-8">
                        <div className="z-10">
                            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-1">Semua Kategori</h3>
                            <p className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                Telusuri {totalItems} Koleksi
                            </p>
                        </div>
                        <div className={`p-3 rounded-full transition-transform duration-500 group-hover:translate-x-2 
                            ${isDarkMode ? "bg-slate-700/50 text-white" : "bg-slate-100 text-slate-900"}`}>
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* CATEGORIES LOOP */}
                {categories.map((cat, i) => {
                    const isLarge = i === 0 || i === 3;

                    return (
                        cat?.icon?.startsWith("http") ?
                            <div
                                key={i}
                                onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                                className={`relative group overflow-hidden rounded-3xl cursor-pointer col-span-2 row-span-1 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl border
                    ${isDarkMode ? "bg-slate-800/80 border-white/10 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                            >
                                {/* Image Layer - Cinematic Zoom */}
                                <img
                                    src={cat.icon}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    alt={cat.name}
                                />

                                {/* Overlay Gradient - Refined & Smooth */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-500" />

                                {/* Content Section */}
                                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end z-10">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30"
                                                style={{ backgroundColor: `${cat.color}40` }}
                                            >
                                                Kategori
                                            </span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight mb-2">
                                            {cat.name}
                                        </h3>
                                        <div className="flex items-center gap-3 overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                                            <p className="text-slate-300 text-sm font-medium">
                                                {cat?.count || 0} Produk
                                            </p>
                                            <div className="h-[1px] w-0 group-hover:w-12 bg-white/70 transition-all duration-700 ease-out" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Action Button */}
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                                    <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white hover:text-black transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                            :
                            /* Solid Color / Icon Grid Item */
                            <div
                                key={i}
                                onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                                className={`relative group overflow-hidden rounded-3xl cursor-pointer col-span-2 row-span-1 transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-xl border
                    ${isDarkMode ? "bg-slate-800/80 border-white/10 hover:bg-slate-800" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                            >
                                <div className="absolute -right-4 -bottom-4 opacity-[0.04] group-hover:opacity-[0.08] group-hover:scale-125 transition-all duration-700">
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className="w-40 h-40"
                                        color={cat?.color || (isDarkMode ? '#ffffff' : '#000000')}
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-8 z-10">
                                    <div>
                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: `${cat?.color}20` }}>
                                            <Icon icon={cat?.icon || 'cbi:bulb-general-group'} className="w-5 h-5" color={cat?.color} />
                                        </div>
                                        <h3 className={`text-lg sm:text-xl font-semibold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                            {cat?.name}
                                        </h3>
                                        <p className={`text-sm font-medium mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                            {cat?.count} Produk
                                        </p>
                                    </div>
                                    <div className={`p-2 rounded-full opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300
                                        ${isDarkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-900"}`}>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                    );
                })}
            </div>
        </section>
    )
}

export default One