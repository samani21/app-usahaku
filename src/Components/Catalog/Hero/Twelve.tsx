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

const Twelve = ({ isDarkMode, headline, subHeadline, ctaText, imageHero }: Props) => {
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
        <section className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 transition-all duration-500
                ${isDarkMode
                    ? 'bg-slate-900 border border-slate-800'
                    : 'bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100'
                }`}
            >
                {/* Background Gradient Subtle */}
                <div className={`absolute inset-0 opacity-50 ${isDarkMode ? 'bg-gradient-to-br from-indigo-900/20 to-transparent' : 'bg-gradient-to-br from-[var(--hero-primary-color)]/5 to-transparent'}`} />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Teks Content */}
                    <div className="max-w-xl">
                        <h2 className={`text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter leading-[1.1] italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {headline}
                        </h2>
                        <p className={`text-base md:text-lg mb-8 leading-relaxed opacity-70 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {subHeadline}
                        </p>
                        <button
                            onClick={handleScroll}
                            className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)] rounded-full font-bold shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all"
                        >
                            {ctaText}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Orbital Element (Image Container) */}
                    <div className="flex-shrink-0">
                        <div className="relative w-48 h-48 md:w-60 md:h-60 rounded-full border border-current/10 flex items-center justify-center">
                            {/* Inner Circle with Pulse */}
                            <div className="w-40 h-40 md:w-48 md:h-48 bg-current/5 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                {imageHero && (
                                    <img
                                        src={imageHero}
                                        className='rounded-full object-cover w-36 h-36 md:w-44 md:h-44 shadow-2xl'
                                        alt="Hero"
                                    />
                                )}
                            </div>
                            {/* Decorative Dot/Ring */}
                            <div className="absolute top-2 left-2 w-3 h-3 bg-[var(--hero-primary-color)] rounded-full shadow-[0_0_10px_var(--hero-primary-color)]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Twelve;