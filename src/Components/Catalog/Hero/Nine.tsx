import { Zap, ArrowRight } from 'lucide-react';
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

const Nine = ({ headline, subHeadline, ctaText, imageHero, title }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0f172a] text-white rounded-2xl overflow-hidden grid md:grid-cols-12 shadow-2xl">
                {/* Kolom Teks */}
                <div className="md:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 mb-6 text-[var(--hero-primary-color)] font-bold uppercase tracking-widest text-[10px] md:text-xs">
                        <Zap className="w-3.5 h-3.5 fill-current" /> {title}
                    </div>

                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 uppercase tracking-tighter leading-[1.1]">
                        {headline}
                    </h2>

                    <p className="text-slate-400 text-base md:text-lg mb-10 max-w-lg leading-relaxed">
                        {subHeadline}
                    </p>

                    <button
                        onClick={handleScroll}
                        className="group w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--hero-primary-color-rgb),0.4)] bg-[var(--hero-primary-color)] text-[var(--hero-secondary-color)]"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Kolom Gambar dengan Cinematic Overlay */}
                <div className="md:col-span-5 relative h-[250px] md:h-auto overflow-hidden">
                    {imageHero && (
                        <img
                            src={imageHero}
                            alt="Hero"
                            className="absolute inset-0 w-full h-full object-cover grayscale opacity-60 transition-transform duration-[2s] hover:scale-105"
                        />
                    )}
                    {/* Gradient Overlay yang lebih menyatu dengan background */}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0f172a] via-[#0f172a]/50 to-transparent" />
                </div>
            </div>
        </section>
    );
}

export default Nine;