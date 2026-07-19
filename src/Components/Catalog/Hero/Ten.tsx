import React from 'react';

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
    title: string;
}

const Ten = ({ headline, subHeadline, ctaText, isDarkMode }: Props) => {
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
        <section className="w-full max-w-7xl mx-auto py-10 px-4">
            <div className={`relative overflow-hidden p-8 md:p-16 rounded-3xl text-center border transition-all duration-500
                ${isDarkMode
                    ? 'bg-slate-900 border-white/10'
                    : 'bg-white border-slate-100 shadow-2xl shadow-slate-200/50'
                }`}
            >
                {/* Aksen Cahaya Belakang (Soft Glow) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[var(--hero-primary-color)]/5 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className={`text-3xl md:text-5xl font-bold mb-6 tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {headline}
                    </h2>

                    <p className={`mb-10 text-base md:text-lg leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                        {subHeadline}
                    </p>

                    <button
                        onClick={handleScroll}
                        className={`px-10 py-3.5 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] 
                            ${isDarkMode
                                ? 'bg-white text-slate-900 hover:bg-slate-200'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        {ctaText}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Ten;