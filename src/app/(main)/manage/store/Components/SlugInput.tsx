"use client";

import React, { useEffect, useState } from "react";
import { Get } from "@/utils/Get";

// --- TYPES ---
type Props = {
    form: string;
    onChange: (e: string) => void;
};

// ==========================================
// UTILS: Formatting Slug Murni
// ==========================================
const formatToSlug = (value: string) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter selain huruf, angka, spasi, dan strip
        .replace(/\s+/g, "-")         // Ubah spasi menjadi strip
        .replace(/-+/g, "-");         // Gabungkan strip beruntun menjadi satu
};

// ==========================================
// CUSTOM HOOK: Logika Pengecekan Ketersediaan Slug (Debounced)
// ==========================================
const useSlugAvailability = (slug: string) => {
    const [loading, setLoading] = useState(false);
    const [slugStatus, setSlugStatus] = useState<null | "used" | "available">(null);
    const [textStatusSlug, setTextStatusSlug] = useState<string>('');

    useEffect(() => {
        // Reset status jika input kosong
        if (!slug) {
            setSlugStatus(null);
            setTextStatusSlug('');
            return;
        }

        // Debounce: Tunggu user selesai mengetik selama 1.5 detik sebelum memanggil API
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await Get<{ success: boolean; message: string }>(`/check-slug?slug=${slug}`);
                if (res?.success) {
                    setTextStatusSlug(res.message);
                    setSlugStatus('available');
                } else {
                    setSlugStatus("used");
                }
            } catch (error) {
                setSlugStatus("used");
            } finally {
                setLoading(false);
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [slug]);

    return { loading, slugStatus, textStatusSlug };
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function SlugInput({ form, onChange }: Props) {
    // Inisialisasi Custom Hook
    const { loading, slugStatus, textStatusSlug } = useSlugAvailability(form);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedSlug = formatToSlug(e.target.value);
        onChange(formattedSlug);
    };

    return (
        <div className="space-y-2">
            {/* --- INPUT FIELD --- */}
            <div className="flex group">
                <div className="flex items-center px-4 rounded-l-2xl border border-r-0 border-slate-200 bg-slate-100 text-slate-400 font-bold text-sm">
                    /
                </div>
                <input
                    type="text"
                    name="slug"
                    value={form}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 rounded-r-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm md:text-base w-full"
                    placeholder="contoh-slug-url"
                />
            </div>

            {/* --- STATUS INDIKATOR --- */}
            <div className="min-h-[20px] px-1">
                {loading && (
                    <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Mengecek slug...
                    </div>
                )}

                {!loading && slugStatus === "used" && (
                    <div className="flex items-center gap-2 text-xs text-rose-500 font-medium">
                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                        Slug telah digunakan
                    </div>
                )}

                {!loading && slugStatus === "available" && (
                    <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        {textStatusSlug || "Slug tersedia"}
                    </div>
                )}
            </div>
        </div>
    );
}