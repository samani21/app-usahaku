import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null; // Tidak dipakai di layout ini, murni tipografi
    title: string; // <-- FIX: Menambahkan prop title
}

const Fourteen = ({ headline, subHeadline, ctaText, isDarkMode, title }: Props) => {

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full py-10 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6 sm:gap-8 md:gap-10">

                {/* Title / Kicker */}
                <span className={`inline-block text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase 
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                `}>
                    {title || "Premium"}
                </span>

                {/* Headline dengan efek gradasi yang elegan */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] sm:leading-[0.95] tracking-tighter uppercase px-2">
                    {headline.split(' ').map((w, i) => (
                        <span
                            key={i}
                            className={`inline-block ${i % 2 !== 0
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--hero-primary-color)] to-[var(--hero-secondary-color,#a855f7)] drop-shadow-sm'
                                : (isDarkMode ? 'text-white' : 'text-slate-900')
                            }`}
                        >
                            {w}{' '}
                        </span>
                    ))}
                </h2>

                {/* Subheadline dengan font yang lebih ringan untuk kontras */}
                <p className={`text-sm sm:text-base md:text-xl font-light max-w-2xl mx-auto leading-relaxed px-4 sm:px-0
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}
                `}>
                    {subHeadline}
                </p>

                {/* Tombol dengan aksen premium */}
                <div className="pt-2 sm:pt-4 w-full">
                    <button
                        onClick={handleScroll}
                        className="group inline-flex items-center justify-center gap-3 w-[90%] sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-[var(--hero-secondary-color)] font-bold text-sm sm:text-base transition-all duration-300 bg-[var(--hero-primary-color)] hover:shadow-[0_10px_25px_rgba(var(--hero-primary-color-rgb),0.35)] hover:-translate-y-1 active:translate-y-0"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Fourteen;