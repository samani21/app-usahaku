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

const Fifteen = ({ headline, subHeadline, ctaText, imageHero }: Props) => {
    const handleScroll = () => {
        const el = document.getElementById("product-section");
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 bg-[var(--hero-primary-color)] text-white rounded-3xl overflow-hidden shadow-2xl">

                {/* Bagian Teks */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start text-left order-2 md:order-1">
                    <div className="w-12 h-[2px] bg-white/50 mb-8" />

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6 leading-[1.1] italic">
                        {headline}
                    </h2>

                    <p className="text-white/80 mb-10 max-w-sm text-base md:text-lg leading-relaxed">
                        {subHeadline}
                    </p>

                    <button
                        onClick={handleScroll}
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-[var(--hero-primary-color)] font-bold uppercase tracking-[0.15em] text-sm hover:bg-slate-100 transition-all duration-300"
                    >
                        {ctaText}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                {/* Bagian Gambar */}
                <div className="relative order-1 md:order-2 h-[250px] md:h-auto bg-[var(--hero-primary-color)]">
                    {imageHero && (
                        <>
                            <img
                                src={imageHero}
                                alt="Hero"
                                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[2s] hover:scale-105"
                            />
                            {/* Gradasi Overlay agar teks tetap terbaca di mode mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--hero-primary-color)] via-transparent to-transparent md:bg-gradient-to-r" />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Fifteen;