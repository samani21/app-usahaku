"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from '@iconify/react'; // Iconify
import { Search } from "lucide-react"; // Hanya untuk icon UI search

import FormInput from "@/Components/CRUD/FormInput/FormInput";
import { AlertComponent } from "@/Components/Alert";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { CategoryType } from "../page";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: CategoryType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface FormState {
    name: string;
    icon: string;
    color: string;
    is_active: boolean;
}

interface FormErrors {
    [key: string]: string | null;
}

// Preset Icon Pilihan Umum
const PRESET_ICONS = [
    "mdi:silverware-fork-knife", "ph:t-shirt-fill", "mdi:volleyball",
    "mdi:wrench", "mdi:palette", "mdi:leaf",
    "fluent:sparkle-24-filled", "mdi:monitor", "mdi:car",
    "mdi:shopping-outline", "mdi:heart-pulse", "mdi:book-open-page-variant",
    "mdi:camera", "mdi:printer", "mdi:dots-grid"
];

const CreateOrUpdate = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        name: "", icon: "mdi:dots-grid", color: "bg-slate-100 text-slate-600", is_active: true
    });

    const [error, setError] = useState<FormErrors>({});

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                icon: data.icon || "mdi:dots-grid",
                color: data.color || "bg-slate-100 text-slate-600",
                is_active: data.is_active == 1 ? true : false,
            });
        } else {
            setForm({
                name: "", icon: "mdi:dots-grid", color: "bg-emerald-100 text-emerald-600", is_active: true
            });
        }
        setError({});
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setForm((prev) => ({ ...prev, [name]: checked }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

        if (error[name]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.name.trim()) { newErrors.name = "Nama Kategori harus diisi"; hasError = true; }
        if (!form.icon.trim()) { newErrors.icon = "Ikon harus dipilih atau diisi"; hasError = true; }
        if (!form.color.trim()) { newErrors.color = "Warna harus dipilih"; hasError = true; }

        if (hasError) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('icon', form.icon);
        formData.append('color', form.color);
        formData.append('is_active', form.is_active ? '1' : '0');

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="text"
                    label="Nama Kategori"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Kuliner, Fashion..."
                    required
                    error={error.name ?? ''}
                />

                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Preset Warna Utama</label>
                    <select
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    >
                        <option value="bg-emerald-100 text-emerald-600">Emerald (Hijau)</option>
                        <option value="bg-orange-100 text-orange-600">Orange</option>
                        <option value="bg-pink-100 text-pink-600">Pink</option>
                        <option value="bg-red-100 text-red-600">Merah</option>
                        <option value="bg-blue-100 text-blue-600">Biru</option>
                        <option value="bg-purple-100 text-purple-600">Ungu</option>
                        <option value="bg-cyan-100 text-cyan-600">Cyan</option>
                        <option value="bg-amber-100 text-amber-600">Kuning / Amber</option>
                        <option value="bg-slate-100 text-slate-600">Slate (Abu-abu)</option>
                    </select>
                </div>
            </div>

            {/* AREA ICON PICKER CUSTOM */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <label className="text-[12px] font-bold text-slate-700 block mb-3">Pilih atau Cari Ikon (Iconify)</label>

                <div className="flex gap-4 items-start">
                    {/* Live Preview Kotak */}
                    <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center shadow-sm border border-white ${form.color}`}>
                        <Icon icon={form.icon || 'mdi:help-circle-outline'} className="text-3xl" />
                    </div>

                    <div className="flex-1 space-y-3">
                        {/* Input Cari / Ketik Manual */}
                        <div className="relative">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="icon"
                                value={form.icon}
                                onChange={handleChange}
                                placeholder="Ketik nama icon (cth: mdi:food)"
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                            />
                        </div>

                        {/* Quick Picks */}
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Pilihan Cepat:</p>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_ICONS.map((preset) => (
                                    <button
                                        key={preset}
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, icon: preset }))}
                                        className={`p-2 rounded-lg border transition-all ${form.icon === preset ? 'bg-emerald-100 border-emerald-300 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-100'}`}
                                        title={preset}
                                    >
                                        <Icon icon={preset} className="text-xl" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">
                            Cari ikon lainnya di <a href="https://icon-sets.iconify.design/" target="_blank" className="text-blue-500 hover:underline">icon-sets.iconify.design</a>. <i>Copy</i> namanya dan <i>Paste</i> di kolom atas.
                        </p>
                    </div>
                </div>
                {error.icon && <p className="text-rose-500 text-xs mt-2">{error.icon}</p>}
            </div>

            {/* TOGGLE STATUS */}
            <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl bg-white">
                <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="w-5 h-5 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="is_active" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Aktifkan Kategori Ini
                </label>
            </div>

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdate;