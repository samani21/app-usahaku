import React from 'react'
import { CategoriesType } from "@/types/Admin/CategoriesType";
import { Icon } from "@iconify/react";

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Elevent = ({ categories, isDarkMode, onClick }: Props) => {
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
        <section className="py-16 px-6 max-w-7xl mx-auto overflow-visible">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12 pt-4">

                {/* POLAROID CARD: SEMUA */}
                <div
                    onClick={() => {
                        onClick?.(null)
                        handleScroll()
                    }}
                    className={`group relative p-3 pb-10 md:p-4 md:pb-12 shadow-md transition-all duration-700 ease-out cursor-pointer -rotate-2 hover:rotate-0 hover:scale-105 hover:z-20
                        ${isDarkMode ? 'bg-slate-800 border border-slate-700/50 shadow-black/50' : 'bg-[#fcfcfc] border border-slate-200/60 shadow-slate-300/50'}`}
                    style={{
                        boxShadow: !isDarkMode ? '' : undefined,
                    }}
                >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                        style={{ boxShadow: `0 20px 40px -15px var(--category-primary-color)` }}
                    />

                    {/* Realistic Frosted Tape */}
                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-7 backdrop-blur-md rotate-[4deg] z-10 transition-opacity duration-500 shadow-sm
                        ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white/40 border border-white/60'}`}
                    />

                    {/* Image Container */}
                    <div className={`relative aspect-square overflow-hidden mb-5 rounded-sm transition-colors duration-500
                        ${isDarkMode ? 'bg-slate-100' : 'bg-slate-100'}`}>
                        <div className="w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] ease-out group-hover:scale-110">
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                                style={{ color: 'var(--category-primary-color)' }}
                            />
                        </div>

                        {/* Subtle Vintage Texture Overlay */}
                        <div className={`absolute inset-0 pointer-events-none mix-blend-multiply opacity-30 transition-opacity duration-700 group-hover:opacity-0
                            ${isDarkMode ? 'bg-black/20' : 'bg-orange-900/5'}`}
                        />

                        {/* Inner Shadow for depth */}
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                    </div>

                    {/* Category Text (Fine-Art Style) */}
                    <div className="px-2 text-center relative">
                        <h3 className={`font-serif text-lg md:text-xl font-medium italic tracking-wide leading-tight transition-colors duration-300
                            ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-black'}`}>
                            Semua Koleksi
                        </h3>
                        <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-2 font-sans font-bold transition-colors duration-300
                            ${isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}
                        >
                            {totalItems} Produk
                        </p>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => {
                    // Refined realistic rotations
                    const rotations = ['rotate-2', '-rotate-1', 'rotate-3', '-rotate-2', 'rotate-1'];
                    const tapeRotations = ['-rotate-3', 'rotate-2', '-rotate-4', 'rotate-3', '-rotate-2'];

                    const randomRotation = rotations[i % rotations.length];
                    const randomTapeRot = tapeRotations[i % tapeRotations.length];

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                onClick?.(cat?.name)
                                handleScroll()
                            }}
                            className={`group relative p-3 pb-10 md:p-4 md:pb-12 shadow-md transition-all duration-700 ease-out cursor-pointer ${randomRotation} hover:rotate-0 hover:scale-105 hover:z-20
                                ${isDarkMode ? 'bg-slate-800 border border-slate-700/50 shadow-black/50' : 'bg-[#fcfcfc] border border-slate-200/60 shadow-slate-300/50'}`}
                        >
                            {/* Hover Glow Effect based on category color */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none -z-10"
                                style={{ boxShadow: `0 20px 40px -15px ${cat?.color || 'rgba(0,0,0,0.2)'}` }}
                            />

                            {/* Realistic Frosted Tape */}
                            <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-7 backdrop-blur-md ${randomTapeRot} z-10 transition-opacity duration-500 shadow-sm
                                ${isDarkMode ? 'bg-white/10 border border-white/10' : 'bg-white/40 border border-white/60'}`}
                            />

                            {/* Image Container */}
                            <div className={`relative aspect-square overflow-hidden mb-5 rounded-sm transition-colors duration-500
                                ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                                {cat?.icon ? (
                                    cat.icon.startsWith("http") ? (
                                        <img
                                            src={cat.icon}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-all duration-[1500ms] ease-out group-hover:scale-110 grayscale-[0.6] opacity-90 group-hover:grayscale-0 group-hover:opacity-100"
                                            alt={cat.name}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                                            style={{ backgroundColor: isDarkMode ? "#fff" : `${cat?.color || 'var(--category-primary-color)'}10` }}>
                                            <Icon color={cat?.color} icon={cat?.icon} className='w-full h-full opacity-70 group-hover:opacity-100 transition-opacity duration-700' />
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-8 transition-transform duration-[1500ms] ease-out group-hover:scale-110">
                                        <Icon icon={'cbi:bulb-general-group'} className='w-full h-full opacity-60 group-hover:opacity-100' style={{ color: cat?.color || 'var(--category-primary-color)' }} />
                                    </div>
                                )}

                                {/* Subtle Vintage Texture Overlay */}
                                <div className={`absolute inset-0 pointer-events-none mix-blend-multiply opacity-40 transition-opacity duration-700 group-hover:opacity-0
                                    ${isDarkMode ? 'bg-black/30' : 'bg-orange-900/10'}`}
                                />

                                {/* Inner Shadow for depth */}
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
                            </div>

                            {/* Category Text (Fine-Art Style) */}
                            <div className="px-2 text-center relative">
                                <h3 className={`font-serif text-lg md:text-xl font-medium italic tracking-wide leading-tight truncate transition-colors duration-300
                                    ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-slate-800 group-hover:text-black'}`}>
                                    {cat.name}
                                </h3>
                                <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-2 font-sans font-bold transition-colors duration-300
                                    ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}
                                >
                                    <span
                                        className="transition-colors duration-500"
                                        style={{ color: 'inherit' }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = cat?.color || 'var(--category-primary-color)'}
                                        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                                    >
                                        {cat?.count || 0} Produk
                                    </span>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    )
}

export default Elevent