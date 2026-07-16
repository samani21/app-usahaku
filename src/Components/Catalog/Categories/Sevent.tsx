import { CategoriesType } from "@/types/Admin/CategoriesType";
import { ArrowRight } from "lucide-react"; // Pastikan import ini ada

type Props = {
    categories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const Sevent = ({ categories, isDarkMode, onClick }: Props) => {
    const totalItems = categories.reduce((sum, cat) => sum + (cat.count || 0), 0);

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
        <section className="py-12 px-4 max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-10 sm:gap-y-14">

                {/* LIST ITEM: SEMUA KATEGORI */}
                <div
                    onClick={() => {
                        onClick?.(null)
                        handleScroll()
                    }}
                    className="group relative flex gap-6 sm:gap-8 pb-8 cursor-pointer overflow-hidden"
                >
                    {/* Animated Bottom Border */}
                    <div className={`absolute bottom-0 left-0 w-full h-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[var(--category-primary-color)] transition-all duration-700 ease-out group-hover:w-full" />

                    {/* Editorial Number Index */}
                    <span className="text-4xl sm:text-5xl font-extralight text-slate-400 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-[var(--category-primary-color)]">
                        01
                    </span>

                    {/* Content Section */}
                    <div className="flex-1 mt-1">
                        <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-2 transition-transform duration-500 group-hover:translate-x-2
                            ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                            Semua Kategori
                        </h3>
                        <p className={`text-sm font-medium mb-6 transition-colors duration-300
                            ${isDarkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-700"}`}>
                            {totalItems} Koleksi Tersedia
                        </p>

                        {/* Call to Action with Sliding Arrow */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[var(--category-primary-color)]">
                                Jelajahi Sekarang
                            </span>
                            <ArrowRight
                                className="w-4 h-4 text-[var(--category-primary-color)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out"
                            />
                        </div>
                    </div>
                </div>

                {/* CATEGORIES MAPPING */}
                {categories.map((cat, i) => {
                    // Logic agar format nomor selalu 2 digit (02, 03.. 10, 11, dst)
                    const indexNumber = (i + 2).toString().padStart(2, '0');

                    return (
                        <div
                            key={i}
                            onClick={() => {
                                onClick?.(cat?.name)
                                handleScroll()
                            }}
                            className="group relative flex gap-6 sm:gap-8 pb-8 cursor-pointer overflow-hidden"
                        >
                            {/* Animated Bottom Border */}
                            <div className={`absolute bottom-0 left-0 w-full h-[1px] ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`} />
                            <div
                                className="absolute bottom-0 left-0 w-0 h-[1px] transition-all duration-700 ease-out group-hover:w-full"
                                style={{ backgroundColor: cat.color || 'var(--category-primary-color)' }}
                            />

                            {/* Editorial Number Index */}
                            <span
                                className="text-4xl sm:text-5xl font-extralight text-slate-400 opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-1"
                                style={{ color: 'inherit' }} // Fallback if no hover color
                            >
                                <span className="group-hover:hidden transition-opacity">{indexNumber}</span>
                                <span className="hidden group-hover:inline transition-opacity" style={{ color: cat.color || 'var(--category-primary-color)' }}>{indexNumber}</span>
                            </span>

                            {/* Content Section */}
                            <div className="flex-1 mt-1">
                                <h3 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-2 transition-transform duration-500 group-hover:translate-x-2 truncate
                                    ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                    {cat.name}
                                </h3>
                                <p className={`text-sm font-medium mb-6 transition-colors duration-300
                                    ${isDarkMode ? "text-slate-400 group-hover:text-slate-300" : "text-slate-500 group-hover:text-slate-700"}`}>
                                    {cat.count || 0} Produk Tersedia
                                </p>

                                {/* Call to Action with Sliding Arrow */}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[var(--category-primary-color)]">
                                        Jelajahi Sekarang
                                    </span>
                                    <ArrowRight
                                        className="w-4 h-4 text-[var(--category-primary-color)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out"
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

export default Sevent