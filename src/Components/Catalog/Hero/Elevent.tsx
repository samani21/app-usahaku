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

const Elevent = ({ isDarkMode, headline, subHeadline, ctaText, imageHero }: Props) => {
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
        <section className="w-full max-w-7xl mx-auto py-6 px-4">
            <div className={`rounded-3xl p-6 md:p-10 transition-all flex flex-col md:flex-row items-center gap-8 md:gap-12
                ${isDarkMode
                    ? 'bg-slate-900 border border-slate-800 text-white'
                    : 'bg-white shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-slate-100'
                }`}
            >
                {imageHero && (
                    <div className="w-full md:w-1/3 aspect-square max-w-[240px] flex-shrink-0">
                        <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-2xl rotate-[-4deg] transition-transform duration-500 hover:rotate-0 hover:scale-105 border-[3px] border-white/20">
                            <img src={imageHero} alt="Hero" className="w-full h-full object-cover" />
                        </div>
                    </div>
                )}

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-[1.1] tracking-tight">
                        {headline}
                    </h2>
                    <p className={`text-base md:text-lg mb-8 opacity-80 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {subHeadline}
                    </p>
                    <button
                        onClick={handleScroll}
                        className="group inline-flex items-center gap-3 px-8 py-3.5 bg-[var(--hero-primary-color)] text-white rounded-full font-bold shadow-lg hover:shadow-[0_8px_20px_rgba(var(--hero-primary-color-rgb),0.3)] transition-all"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Elevent;