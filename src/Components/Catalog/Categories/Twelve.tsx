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
        <section className="py-4 md:py-8 px-4 max-w-7xl mx-auto">
            {/* Grid disesuaikan: 2 kolom di mobile, 3 di tablet, 4-5 di desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                <div onClick={() => {
                    onClick && onClick(null)
                    handleScroll()
                }}
                    className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                    {/* Background Layer (Visual Depth) */}
                    <div className="absolute inset-0 z-0">
                        <div className="w-full h-full flex items-center justify-center opacity-10 transition-transform duration-700 group-hover:scale-150">
                            <Icon icon={'cbi:bulb-general-group'} className='w-full h-full' />
                        </div>
                        {/* Overlay Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode
                            ? "from-slate-900/90 via-slate-900/60 to-black"
                            : "from-white/90 via-white/60 to-slate-100"
                            }`} />
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-1 w-full h-full p-3 md:p-5 flex flex-col items-center justify-between">

                        {/* Icon Container */}
                        <div className="flex-1 w-full flex items-center justify-center">
                            <div className={`relative p-3 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500  backdrop-blur-md border border-white/20 group-hover:rotate-6 group-hover:scale-110 ${isDarkMode ? "bg-white/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]" : "bg-white/40 shadow-lg shadow-black/5"}`}>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16  text-[var(--category-primary-color)] flex items-center justify-center">
                                    <Icon icon={'cbi:bulb-general-group'} className='w-full h-full' />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Label Info */}
                        <div className={`w-full mt-2 md:mt-4 flex items-center justify-between  backdrop-blur-xl rounded-xl md:rounded-2xl py-2 px-3 md:px-4  border border-white/20 transition-all duration-300 ${isDarkMode ? "bg-black/40" : "bg-white/60 shadow-sm"} group-hover:border-[var(--category-primary-color)]/50`}>
                            <div className="flex flex-col truncate pr-1">
                                <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold opacity-50 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                    Kategori
                                </span>
                                <h3 className={`font-bold text-[11px] sm:text-xs md:text-sm truncate mt-0.5 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                    Semua
                                </h3>
                            </div>

                            <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full transition-all duration-500 ${isDarkMode ? "bg-white/10 text-white" : "bg-slate-800 text-white"} group-hover:bg-[var(--category-primary-color)] group-hover:scale-110 group-hover:rotate-45`}>
                                <ArrowUpRight size={12} className="md:w-[14px] md:h-[14px]" />
                            </div>
                        </div>
                    </div>

                    {/* Subtle Inner Glow on Hover */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-[var(--category-primary-color)]/5 via-transparent to-[var(--category-primary-color)]/10`} />
                </div>
                {categories.map((cat, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            onClick && onClick(cat?.name)
                            handleScroll()
                        }}
                        className="group relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                        {/* Background Layer (Visual Depth) */}
                        <div className="absolute inset-0 z-0">
                            {
                                cat?.icon ? (
                                    cat.icon.startsWith("http") ? (
                                        <img
                                            src={cat.icon}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-125 opacity-20 ${isDarkMode ? "grayscale brightness-50" : "grayscale-0"
                                                }`}
                                            alt=""
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10 transition-transform duration-700 group-hover:scale-150">
                                            <Icon color={cat?.color} icon={cat?.icon} className='w-full h-full' />
                                        </div>
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-10 transition-transform duration-700 group-hover:scale-150">
                                        <Icon icon={'cbi:bulb-general-group'} className='w-full h-full text-[var(--category-primary-color)]' />
                                    </div>
                                )
                            }
                            {/* Overlay Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode
                                ? "from-slate-900/90 via-slate-900/60 to-black"
                                : "from-white/90 via-white/60 to-slate-100"
                                }`} />
                        </div>

                        {/* Content Layer */}
                        <div className="relative z-1 w-full h-full p-3 md:p-5 flex flex-col items-center justify-between">

                            {/* Icon Container */}
                            <div className="flex-1 w-full flex items-center justify-center">
                                <div className={`relative p-3 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500  backdrop-blur-md border border-white/20 group-hover:rotate-6 group-hover:scale-110 ${isDarkMode ? "bg-white/5 shadow-[0_0_20px_rgba(0,0,0,0.3)]" : "bg-white/40 shadow-lg shadow-black/5"}`}>
                                    {
                                        cat?.icon ? (
                                            cat.icon.startsWith("http") ? (
                                                <img
                                                    src={cat.icon}
                                                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain drop-shadow-xl"
                                                    alt={cat.name}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
                                                    <Icon color={cat?.color} icon={cat?.icon} className='w-full h-full' />
                                                </div>
                                            )
                                        ) : (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center">
                                                <Icon icon={'cbi:bulb-general-group'} className='w-full h-full text-[var(--category-primary-color)]' />
                                            </div>
                                        )
                                    }
                                </div>
                            </div>

                            {/* Bottom Label Info */}
                            <div className={`w-full mt-2 md:mt-4 flex items-center justify-between  backdrop-blur-xl rounded-xl md:rounded-2xl py-2 px-3 md:px-4  border border-white/20 transition-all duration-300 ${isDarkMode ? "bg-black/40" : "bg-white/60 shadow-sm"} group-hover:border-[var(--category-primary-color)]/50`}>
                                <div className="flex flex-col truncate pr-1">
                                    <span className={`text-[8px] md:text-[9px] uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold opacity-50 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                        Kategori
                                    </span>
                                    <h3 className={`font-bold text-[11px] sm:text-xs md:text-sm truncate mt-0.5 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                                        {cat.name}
                                    </h3>
                                </div>

                                <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full transition-all duration-500 ${isDarkMode ? "bg-white/10 text-white" : "bg-slate-800 text-white"} group-hover:bg-[var(--category-primary-color)] group-hover:scale-110 group-hover:rotate-45`}>
                                    <ArrowUpRight size={12} className="md:w-[14px] md:h-[14px]" />
                                </div>
                            </div>
                        </div>

                        {/* Subtle Inner Glow on Hover */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-tr from-[var(--category-primary-color)]/5 via-transparent to-[var(--category-primary-color)]/10`} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Twelve