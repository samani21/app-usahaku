import React from 'react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const FourTen = ({ categories, isDarkMode, onClick }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Neo-brutalism relies on stark contrasts. 
    // Usually pure black borders for light mode, and off-white/slate-300 for dark mode.
    const borderColor = isDarkMode ? 'border-slate-300' : 'border-slate-900';
    const cardBg = isDarkMode ? 'bg-slate-800' : 'bg-white';
    const labelBg = isDarkMode ? 'bg-slate-900' : 'bg-white';
    const textColor = isDarkMode ? 'text-white' : 'text-slate-900';

    return (
        <section className="py-12 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => { onClick?.(null); handleScroll(); }}
                    className="relative group cursor-pointer aspect-[4/5] block"
                >
                    {/* Solid Offset Shadow Layer (with border!) */}
                    <div className={`absolute inset-0 rounded-2xl translate-x-2.5 translate-y-2.5 border-[3px] ${borderColor} bg-[var(--category-primary-color)] transition-transform duration-200`} />

                    {/* Main Tactile Card */}
                    <div className={`relative z-10 h-full rounded-2xl border-[3px] ${borderColor} ${cardBg} overflow-hidden flex flex-col transition-transform duration-150 ease-out group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-2.5 group-active:translate-y-2.5`}>

                        {/* Visual Frame */}
                        <div className="flex-1 relative bg-[var(--category-primary-color)]/10 flex items-center justify-center p-8 overflow-hidden">
                            <Icon
                                icon={'cbi:bulb-general-group'}
                                className='w-full h-full text-[var(--category-primary-color)] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6'
                            />
                        </div>

                        {/* Text Label Area */}
                        <div className={`p-4 border-t-[3px] ${borderColor} ${labelBg}`}>
                            <h3 className={`font-black uppercase italic tracking-tighter text-base md:text-xl leading-none truncate ${textColor}`}>
                                Semua
                            </h3>
                            <p className="text-[10px] font-bold opacity-60 mt-1.5 uppercase tracking-widest">
                                Telusuri Semua
                            </p>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => { onClick?.(cat?.name); handleScroll(); }}
                        className="relative group cursor-pointer aspect-[4/5] block"
                    >
                        {/* Dynamic Offset Shadow Layer */}
                        <div
                            className={`absolute inset-0 rounded-2xl translate-x-2.5 translate-y-2.5 border-[3px] ${borderColor} transition-transform duration-200`}
                            style={{ backgroundColor: 'var(--category-primary-color)' }}
                        />

                        {/* Main Tactile Card */}
                        <div className={`relative z-10 h-full rounded-2xl border-[3px] ${borderColor} ${cardBg} overflow-hidden flex flex-col transition-transform duration-150 ease-out group-hover:translate-x-1 group-hover:translate-y-1 group-active:translate-x-2.5 group-active:translate-y-2.5`}>

                            {/* Visual Frame */}
                            <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden" style={{ backgroundColor: `${cat.color}15` }}>
                                {cat?.icon?.startsWith("http") ? (
                                    <img
                                        src={cat.icon}
                                        className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 ${isDarkMode ? 'brightness-90' : ''}`}
                                        alt={cat.name}
                                    />
                                ) : (
                                    <Icon
                                        icon={cat?.icon || 'cbi:bulb-general-group'}
                                        className='w-full h-full transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110'
                                        style={{ color: cat.color || 'var(--category-primary-color)' }}
                                    />
                                )}
                            </div>

                            {/* Text Label Area */}
                            <div className={`p-4 border-t-[3px] ${borderColor} ${labelBg}`}>
                                <h3 className={`font-black uppercase italic tracking-tighter text-base md:text-xl leading-none truncate ${textColor}`}>
                                    {cat.name}
                                </h3>
                                <p className="text-[10px] font-bold opacity-60 mt-1.5 uppercase tracking-widest">
                                    {cat.count || 0} Produk
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FourTen;