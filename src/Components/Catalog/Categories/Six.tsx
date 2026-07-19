import React from 'react'
import { ArrowUpRight } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Six = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="py-8 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className={`relative h-56 sm:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-1.5 border
                        ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                >
                    {/* Background Layer - Clean & Elegant */}
                    <div className={`absolute inset-0 transition-transform duration-[2000ms] ease-out group-hover:scale-110 flex items-center justify-center 
                        ${isDarkMode ? "bg-slate-800" : "bg-slate-900"}`}
                    >
                        {/* Subtle Static Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--category-primary-color)]/20 blur-[60px] rounded-full" />
                        <Icon icon={'cbi:bulb-general-group'} className='w-32 h-32 text-white/5 -rotate-12' />
                    </div>

                    {/* Dark Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-700" />

                    {/* Content Section */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        <div className="transform transition-transform duration-700 ease-out group-hover:-translate-y-4 flex flex-col items-center text-center w-full">
                            <h3 className="text-xl sm:text-2xl font-semibold uppercase tracking-widest leading-tight mb-3">
                                Semua
                            </h3>
                            <div className="flex items-center justify-center gap-3 opacity-80 w-full">
                                <div className="h-[1px] w-6 sm:w-8 bg-white/40" />
                                <span className="text-[10px] font-medium tracking-[0.2em] uppercase whitespace-nowrap">
                                    {totalItems} Koleksi
                                </span>
                                <div className="h-[1px] w-6 sm:w-8 bg-white/40" />
                            </div>
                        </div>

                        {/* Hover Action Button */}
                        <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-white text-slate-900 px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                                Telusuri <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* Inner Glass Border */}
                    <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className={`relative h-56 sm:h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-1.5 border
                            ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}
                    >
                        {/* Dynamic Background */}
                        <div className="absolute inset-0 w-full h-full bg-slate-100">
                            {cat?.icon?.startsWith("http") ? (
                                <img
                                    src={cat.icon}
                                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                                    alt={cat.name}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center transition-colors duration-700"
                                    style={{ backgroundColor: `${cat.color}20` }}>
                                    <div
                                        className="absolute inset-0 opacity-40 blur-[50px]"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-1/2 h-1/2 opacity-30 group-hover:opacity-50 transition-all duration-700 group-hover:scale-110'
                                        style={{ color: cat.color }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-700" />

                        {/* Text Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 z-10">
                            <div className="transform transition-transform duration-700 ease-out group-hover:-translate-y-4 flex flex-col items-center text-center w-full">
                                <h3 className="text-xl sm:text-2xl font-semibold uppercase tracking-widest leading-tight mb-3 px-2">
                                    {cat.name}
                                </h3>
                                <div className="flex items-center justify-center gap-3 w-full opacity-80">
                                    <div className="h-[1px] w-4 sm:w-6 transition-colors duration-500" style={{ backgroundColor: cat.color || 'rgba(255,255,255,0.4)' }} />
                                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase whitespace-nowrap">
                                        {cat.count || 0} Produk
                                    </span>
                                    <div className="h-[1px] w-4 sm:w-6 transition-colors duration-500" style={{ backgroundColor: cat.color || 'rgba(255,255,255,0.4)' }} />
                                </div>
                            </div>

                            {/* Hover Button Effect */}
                            <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-white text-slate-900 px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform">
                                    Telusuri <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Thin Inner Glass Border */}
                        <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none z-20" />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Six