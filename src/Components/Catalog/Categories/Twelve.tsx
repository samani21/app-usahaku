import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Icon } from '@iconify/react';
import { ArrowUpRight } from 'lucide-react';

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Twelve = ({ categories, isDarkMode, onClick }: Props) => {
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
        <section className="py-10 md:py-16 px-4 max-w-7xl mx-auto w-full">
            {/* Grid disesuaikan: 2 kolom di mobile, 3 di tablet, 4-5 di desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">

                {/* CARD: SEMUA KATEGORI */}
                <div
                    onClick={() => {
                        onClick?.(null)
                        handleScroll()
                    }}
                    className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 border border-transparent hover:border-slate-200/20"
                >
                    {/* Background Layer (Visual Depth) */}
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full flex items-center justify-center opacity-[0.03] transition-transform duration-[1500ms] group-hover:scale-150 ease-out">
                            <Icon icon={'cbi:bulb-general-group'} className='w-full h-full' />
                        </div>
                        {/* Overlay Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-700
                            ${isDarkMode
                                ? "from-slate-900/90 via-slate-900/60 to-black/90 group-hover:to-slate-900/80"
                                : "from-white/90 via-white/60 to-slate-100/90 group-hover:to-white/80"
                            }`}
                        />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 w-full h-full p-3 md:p-5 flex flex-col items-center justify-between">
                        {/* Icon Container */}
                        <div className="flex-1 w-full flex items-center justify-center">
                            <div className={`relative p-4 md:p-5 rounded-[1rem] md:rounded-[1.25rem] transition-all duration-700 ease-out backdrop-blur-md border group-hover:rotate-6 group-hover:scale-110 
                                ${isDarkMode
                                    ? "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20"
                                    : "bg-white/40 border-white/60 shadow-xl shadow-slate-200/50 group-hover:bg-white/60"}`}>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-[var(--category-primary-color)] flex items-center justify-center drop-shadow-sm">
                                    <Icon icon={'cbi:bulb-general-group'} className='w-full h-full' />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Label Info */}
                        <div className={`w-full mt-3 md:mt-4 flex items-center justify-between backdrop-blur-xl rounded-xl md:rounded-2xl py-2 md:py-2.5 px-3 md:px-4 border transition-all duration-500 
                            ${isDarkMode ? "bg-black/40 border-white/10 group-hover:bg-slate-800/80" : "bg-white/60 border-white/60 shadow-sm group-hover:bg-white"} 
                            group-hover:border-[var(--category-primary-color)]/30`}>

                            <div className="flex flex-col truncate pr-2">
                                <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold opacity-60 transition-colors
                                    ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
                                    Kategori
                                </span>
                                <h3 className={`font-bold text-[11px] sm:text-xs md:text-sm truncate mt-0.5 transition-colors
                                    ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    Semua
                                </h3>
                            </div>

                            {/* Button Action */}
                            <div className={`relative overflow-hidden flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12
                                ${isDarkMode ? "bg-white/10 text-white" : "bg-slate-900 text-white"}`}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[var(--category-primary-color)]" />
                                <ArrowUpRight size={14} className="relative z-10 md:w-[16px] md:h-[16px]" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>

                    {/* Subtle Inner Glow on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ background: `linear-gradient(to top right, var(--category-primary-color)15, transparent, var(--category-primary-color)20)` }}
                    />
                </div>

                {/* CATEGORIES MAPPING */}
                {categories?.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            onClick?.(cat?.name)
                            handleScroll()
                        }}
                        className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 border border-transparent hover:border-slate-200/20"
                    >
                        {/* Background Layer (Visual Depth) */}
                        <div className="absolute inset-0 z-0">
                            {cat?.icon ? (
                                cat.icon.startsWith("http") ? (
                                    <img
                                        src={cat.icon}
                                        loading="lazy"
                                        className={`w-full h-full object-cover transition-all duration-[1500ms] group-hover:scale-110 ease-out opacity-30 group-hover:opacity-50 
                                            ${isDarkMode ? "grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75" : "grayscale-[0.5] group-hover:grayscale-0"}`}
                                        alt={cat.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10 transition-transform duration-[1500ms] group-hover:scale-150 ease-out">
                                        <Icon icon={cat?.icon} className='w-full h-full' />
                                    </div>
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-10 transition-transform duration-[1500ms] group-hover:scale-150 ease-out">
                                    <Icon icon={'cbi:bulb-general-group'} className='w-full h-full text-[var(--category-primary-color)]' />
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-700
                                ${isDarkMode
                                    ? "from-slate-900/90 via-slate-900/70 to-black/90 group-hover:to-slate-900/80"
                                    : "from-white/90 via-white/70 to-slate-100/90 group-hover:to-white/80"
                                }`}
                            />
                        </div>

                        {/* Content Layer */}
                        <div className="relative z-10 w-full h-full p-3 md:p-5 flex flex-col items-center justify-between">
                            {/* Icon Container */}
                            <div className="flex-1 w-full flex items-center justify-center">
                                <div className={`relative p-4 md:p-5 rounded-[1rem] md:rounded-[1.25rem] transition-all duration-700 ease-out backdrop-blur-md border group-hover:rotate-6 group-hover:scale-110 
                                    ${isDarkMode
                                        ? "bg-white/5 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20"
                                        : "bg-white/40 border-white/60 shadow-xl shadow-slate-200/50 group-hover:bg-white/60"}`}>
                                    {cat?.icon ? (
                                        cat.icon.startsWith("http") ? (
                                            <img
                                                src={cat.icon}
                                                loading="lazy"
                                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain drop-shadow-xl"
                                                alt={cat.name}
                                            />
                                        ) : (
                                            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center drop-shadow-sm bg-white`}>
                                                <Icon color={cat?.color} icon={cat?.icon} className='w-full h-full' />
                                            </div>
                                        )
                                    ) : (
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center drop-shadow-sm">
                                            <Icon icon={'cbi:bulb-general-group'} className='w-full h-full text-[var(--category-primary-color)]' />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Label Info */}
                            <div className={`w-full mt-3 md:mt-4 flex items-center justify-between backdrop-blur-xl rounded-xl md:rounded-2xl py-2 md:py-2.5 px-3 md:px-4 border transition-all duration-500 
                                ${isDarkMode ? "bg-black/40 border-white/10 group-hover:bg-slate-800/80" : "bg-white/60 border-white/60 shadow-sm group-hover:bg-white"}`}
                                style={{
                                    borderColor: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>

                                <div className="flex flex-col truncate pr-2">
                                    <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold opacity-60 transition-colors
                                        ${isDarkMode ? "text-slate-300" : "text-slate-500"}`}>
                                        {cat.count || 0} Item
                                    </span>
                                    <h3 className={`font-bold text-[11px] sm:text-xs md:text-sm truncate mt-0.5 transition-colors
                                        ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                        {cat.name}
                                    </h3>
                                </div>

                                {/* Button Action with Dynamic Fill */}
                                <div className={`relative overflow-hidden flex-shrink-0 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12
                                    ${isDarkMode ? "bg-white/10 text-white" : "bg-slate-900 text-white"}`}>
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ backgroundColor: cat?.color || 'var(--category-primary-color)' }}
                                    />
                                    <ArrowUpRight size={14} className="relative z-10 md:w-[16px] md:h-[16px]" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Subtle Inner Glow on Hover (Dynamic Color) */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{ background: `linear-gradient(to top right, ${cat?.color || 'var(--category-primary-color)'}15, transparent, ${cat?.color || 'var(--category-primary-color)'}25)` }}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Twelve;