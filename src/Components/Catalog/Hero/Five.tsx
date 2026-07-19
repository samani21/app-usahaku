import React from 'react';
import { Zap } from 'lucide-react'; // Menggunakan ikon Zap (petir) untuk kesan energik

type Props = {
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null;
}

const Five = ({ isDarkMode, headline, subHeadline, ctaText, imageHero }: Props) => {

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
            {/* Kontainer Utama yang Compact */}
            <div className={`relative rounded-[2rem] overflow-hidden flex items-center p-6 md:p-10 lg:p-12 transition-colors duration-500
                ${isDarkMode
                    ? 'bg-[#0a0a0a] border border-white/5 shadow-2xl'
                    : 'bg-slate-100 border border-slate-300/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
                }`}
            >
                {/* Efek Cahaya Belakang (Glow) yang lebih dramatis tapi halus */}
                <div className="absolute top-0 right-0 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] opacity-30 blur-[80px] pointer-events-none translate-x-1/4 -translate-y-1/4 bg-gradient-to-bl from-[var(--hero-primary-color)] via-[var(--hero-secondary-color)] to-transparent rounded-full" />

                {/* Pola Grid Halus di Latar Belakang (Opsional untuk kesan Tech/Sport) */}
                <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM4ODgiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')] pointer-events-none ${isDarkMode ? 'opacity-100' : 'opacity-40'}`} />

                <div className="grid md:grid-cols-2 items-center gap-8 lg:gap-12 w-full relative z-10">

                    {/* Sisi Teks */}
                    <div className="order-2 md:order-1 flex flex-col items-start w-full">

                        {/* Headline Dinamis dengan efek selang-seling warna */}
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black flex flex-wrap gap-x-3 gap-y-1 italic uppercase leading-[1.05] tracking-tighter mb-6">
                            {headline.split(' ').map((word, i) => (
                                <span
                                    key={i}
                                    className={`block ${i % 2 === 0
                                        ? (isDarkMode ? 'text-white drop-shadow-md' : 'text-slate-900')
                                        : 'text-transparent bg-clip-text bg-gradient-to-r from-[var(--hero-primary-color)] to-[var(--hero-primary-color)]/80 drop-shadow-sm'
                                        }`}
                                >
                                    {word}
                                </span>
                            ))}
                        </h2>

                        {/* Sub-judul dengan aksen garis vertikal elegan */}
                        <div className="relative mb-8 pl-5 max-w-sm">
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full bg-gradient-to-b from-[var(--hero-primary-color)] to-transparent" />
                            <p className={`text-sm md:text-base font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {subHeadline}
                            </p>
                        </div>

                        {/* Tombol Premium Edgy/Sport */}
                        <button
                            onClick={handleScroll}
                            className="group relative inline-flex items-center justify-center px-8 py-3.5 italic uppercase text-white transition-all duration-300"
                        >
                            {/* Latar Belakang Tombol yang Miring (Skewed) */}
                            <div className="absolute inset-0 bg-[var(--hero-primary-color)] -skew-x-12 transition-transform duration-300 group-hover:bg-opacity-90 group-hover:scale-105 group-active:scale-95 shadow-[0_0_20px_rgba(var(--hero-primary-color-rgb),0.3)]" />

                            {/* Border Aksen di luar tombol */}
                            <div className="absolute inset-0 border border-[var(--hero-primary-color)] -skew-x-12 translate-x-1.5 translate-y-1.5 transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2 pointer-events-none opacity-50" />

                            {/* Teks di dalam tombol diluruskan kembali (skew-x-12) agar tajam */}
                            <span className="relative z-10 flex items-center gap-2 font-black tracking-widest text-sm md:text-base skew-x-12">
                                {ctaText} <Zap className="w-4 h-4" />
                            </span>
                        </button>
                    </div>

                    {/* Sisi Gambar */}
                    {imageHero && (
                        <div className="order-1 md:order-2 w-full flex justify-center md:justify-end relative group perspective-1000">
                            {/* Jika gambar memiliki background transparan, drop-shadow ini akan membuatnya "menyala" */}
                            <img
                                src={imageHero}
                                alt="Hero"
                                className={`w-full max-w-[450px] h-[220px] sm:h-[280px] lg:h-[320px] object-cover rounded-[1.5rem] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 
                                ${isDarkMode
                                        ? 'drop-shadow-[0_0_40px_rgba(var(--hero-primary-color-rgb),0.3)]'
                                        : 'drop-shadow-[0_15px_30px_rgba(0,0,0,0.15)]'
                                    }`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Five;