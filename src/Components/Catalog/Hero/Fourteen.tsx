import React from 'react';
import { ArrowRight } from 'lucide-react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
}

const Fourteen = ({ headline, subHeadline, ctaText, isDarkMode }: Props) => {

    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full py-16 md:py-24 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-10">

                {/* Headline dengan efek gradasi yang elegan */}
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tighter uppercase">
                    {headline.split(' ').map((w, i) => (
                        <span
                            key={i}
                            className={i % 2 !== 0
                                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--hero-primary-color)] to-[var(--hero-secondary-color, #a855f7)]'
                                : (isDarkMode ? 'text-white' : 'text-slate-900')
                            }
                        >
                            {w}{' '}
                        </span>
                    ))}
                </h2>

                {/* Subheadline dengan font yang lebih ringan untuk kontras */}
                <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {subHeadline}
                </p>

                {/* Tombol dengan aksen premium */}
                <div className="pt-4">
                    <button
                        onClick={handleScroll}
                        className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-base transition-all duration-300 bg-[var(--hero-primary-color)] hover:shadow-[0_10px_20px_rgba(var(--hero-primary-color-rgb),0.3)] hover:scale-105 active:scale-95"
                    >
                        {ctaText}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Fourteen;