import { CategoriesType } from "@/types/Admin/CategoriesType";
import { Icon } from "@iconify/react";
import { ArrowUpRight } from "lucide-react";

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Five = ({ categories, isDarkMode, onClick }: Props) => {
    // const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

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
        <section className="py-6 px-4 max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">

                {/* TOMBOL "SEMUA" - Dipindah ke awal (Standar UX Premium) */}
                <button
                    onClick={() => {
                        onClick?.(null)
                        handleScroll()
                    }}
                    className={`group relative flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 ease-out border w-full sm:w-auto overflow-hidden
                        ${isDarkMode
                            ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800"
                            : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm hover:shadow-md"}`}
                >
                    {/* Hover Tint */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none bg-[var(--category-primary-color)]" />

                    <div className={`relative z-10 w-8 h-8 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center
                        ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                        <Icon icon={'cbi:bulb-general-group'} className='w-4.5 h-4.5 text-[var(--category-primary-color)]' />
                    </div>

                    <span className="relative z-10 text-sm sm:text-base font-medium tracking-tight">
                        Semua Kategori
                    </span>

                    <div className="relative z-10 w-0 group-hover:w-5 transition-all duration-500 overflow-hidden flex items-center justify-end">
                        <ArrowUpRight
                            size={16}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 text-[var(--category-primary-color)]"
                        />
                    </div>

                    {/* Bottom Indicator */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] group-hover:w-[60%] transition-all duration-500 ease-out rounded-t-full bg-[var(--category-primary-color)] opacity-0 group-hover:opacity-100" />
                </button>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            onClick?.(cat?.name)
                            handleScroll()
                        }}
                        className={`group relative flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 ease-out border w-full sm:w-auto overflow-hidden
                            ${isDarkMode
                                ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800"
                                : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm hover:shadow-md"}`}
                    >
                        {/* Hover Tint based on category color */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                            style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                        />

                        <div className="relative z-10 w-8 h-8 rounded-full overflow-hidden flex-shrink-0 transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundColor: `${cat.color}15` }}>
                            {cat?.icon ? (
                                cat.icon.startsWith("http") ? (
                                    <img
                                        src={cat.icon}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                        alt={cat.name}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon icon={cat?.icon} className='w-4.5 h-4.5' style={{ color: cat.color }} />
                                    </div>
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon icon={'cbi:bulb-general-group'} className='w-4.5 h-4.5 text-[var(--category-primary-color)]' />
                                </div>
                            )}
                        </div>

                        <span className="relative z-10 text-sm sm:text-base font-medium tracking-tight">
                            {cat.name}
                        </span>

                        <div className="relative z-10 w-0 group-hover:w-5 transition-all duration-500 overflow-hidden flex items-center justify-end">
                            <ArrowUpRight
                                size={16}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75"
                                style={{ color: cat.color || 'var(--category-primary-color)' }}
                            />
                        </div>

                        {/* Bottom Indicator */}
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

export default Five