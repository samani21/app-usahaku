"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import { AlertComponent } from "@/Components/Alert";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { BannerType } from "./page";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: BannerType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface AlertType {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

interface FormState {
    badge_text: string;
    normal_price: string;
    promo_price: string;
    title: string;
    highlight_text: string;
    description: string;
    button_text: string;
    theme: string;
}

interface FormErrors {
    [key: string]: string | null;
}

const CreateOrUpdate = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        badge_text: "", normal_price: "", promo_price: "", title: "",
        highlight_text: "", description: "", button_text: "", theme: "emerald"
    });

    const [error, setError] = useState<FormErrors>({});
    const [alert, setAlert] = useState<AlertType | null>(null);

    useEffect(() => {
        if (alert?.isOpen) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    useEffect(() => {
        if (data) {
            setForm({
                badge_text: data.badge_text || "",
                normal_price: data.normal_price ? String(data.normal_price) : "",
                promo_price: data.promo_price ? String(data.promo_price) : "",
                title: data.title || "",
                highlight_text: data.highlight_text || "",
                description: data.description || "",
                button_text: data.button_text || "",
                theme: data.theme || "emerald",
            });
        } else {
            setForm({
                badge_text: "", normal_price: "", promo_price: "", title: "",
                highlight_text: "", description: "", button_text: "", theme: "emerald"
            });
        }
        setError({});
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (error[name]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.title.trim()) { newErrors.title = "Judul Utama harus diisi"; hasError = true; }
        if (!form.highlight_text.trim()) { newErrors.highlight_text = "Teks Highlight harus diisi"; hasError = true; }
        if (!form.description.trim()) { newErrors.description = "Deskripsi harus diisi"; hasError = true; }
        if (!form.button_text.trim()) { newErrors.button_text = "Teks Tombol harus diisi"; hasError = true; }
        if (!form.badge_text.trim()) { newErrors.badge_text = "Badge harus diisi"; hasError = true; }

        if (hasError) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('highlight_text', form.highlight_text);
        formData.append('description', form.description);
        formData.append('badge_text', form.badge_text);
        formData.append('button_text', form.button_text);
        formData.append('theme', form.theme);

        // Kirim price jika ada nilainya
        if (form.normal_price) formData.append('normal_price', form.normal_price);
        if (form.promo_price) formData.append('promo_price', form.promo_price);

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    label="Teks Badge"
                    name="badge_text"
                    value={form.badge_text}
                    onChange={handleChange}
                    placeholder="Cth: 🔥 Promo Spesial"
                    required
                    error={error.badge_text ?? ''}
                />
                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Warna Tema</label>
                    <select
                        name="theme"
                        value={form.theme}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    >
                        <option value="emerald">Emerald (Hijau)</option>
                        <option value="blue">Blue (Biru)</option>
                        <option value="rose">Rose (Merah)</option>
                        <option value="amber">Amber (Kuning)</option>
                        <option value="slate">Slate (Abu-abu)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    label="Judul Utama"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Cth: Bundling Setahun,"
                    required
                    error={error.title ?? ''}
                />
                <FormInput
                    type="text"
                    label="Teks Highlight (Warna)"
                    name="highlight_text"
                    value={form.highlight_text}
                    onChange={handleChange}
                    placeholder="Cth: Lebih Hemat!"
                    required
                    error={error.highlight_text ?? ''}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormInput
                    type="number"
                    label="Harga Normal (Coret)"
                    name="normal_price"
                    value={form.normal_price}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak ada"
                />
                <FormInput
                    type="number"
                    label="Harga Promo"
                    name="promo_price"
                    value={form.promo_price}
                    onChange={handleChange}
                    placeholder="Kosongkan jika tidak ada"
                />
            </div>

            <div>
                <label className="text-[12px] font-bold text-slate-700 block mb-1">Deskripsi Promo <span className="text-rose-500">*</span></label>
                <textarea
                    name="description"
                    rows={3}
                    value={form.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700 resize-none"
                    placeholder="Cth: Bayar di muka untuk 1 tahun, dapatkan diskon ekstra..."
                />
                {error.description && <p className="text-rose-500 text-xs mt-1">{error.description}</p>}
            </div>

            <FormInput
                type="text"
                label="Teks Tombol (Button)"
                name="button_text"
                value={form.button_text}
                onChange={handleChange}
                placeholder="Cth: Ambil Promo"
                required
                error={error.button_text ?? ''}
            />

            {alert?.isOpen && (
                <div className="w-full">
                    <AlertComponent
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                    />
                </div>
            )}

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdate;