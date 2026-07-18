"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SelectOption } from "@/types/Public";
import { OutletsType } from "@/types/Admin/OutletType";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";

const MapWithSearch = dynamic(() => import('@/Components/Maps/MapWithSearch'), {
    ssr: false,
});

// --- TYPES ---
type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: OutletsType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface FormState {
    name: string;
    address: string;
    day_open: string;
    day_close: string;
    time_open: string;
    time_close: string;
}

interface FormErrors {
    name?: string | null;
    address?: string | null;
    day_open?: string | null;
    day_close?: string | null;
    time_open?: string | null;
    time_close?: string | null;
}

const selectOptions: SelectOption[] = [
    { label: "Senin", value: "Senin" },
    { label: "Selasa", value: "Selasa" },
    { label: "Rabu", value: "Rabu" },
    { label: "Kamis", value: "Kamis" },
    { label: "Jumat", value: "Jumat" },
    { label: "Sabtu", value: "Sabtu" },
    { label: "Minggu", value: "Minggu" },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
const CreateOrUpdateOutlet = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {

    // Inisialisasi State
    const [form, setForm] = useState<FormState>({
        name: "",
        address: "",
        day_open: "",
        day_close: "",
        time_open: "",
        time_close: "",
    });

    const [error, setError] = useState<FormErrors>({});

    const [latLng, setLatLng] = useState<{ lat: number; lng: number; } | null>(null);

    // Sinkronisasi data saat mode Edit vs Tambah
    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                address: data.address || "",
                day_open: data.day_open || "",
                day_close: data.day_close || "",
                time_open: data.time_open ? data.time_open.split(":").slice(0, 2).join(":") : "",
                time_close: data.time_close ? data.time_close.split(":").slice(0, 2).join(":") : "",
            });

            if (data.lat && data.lng) {
                setLatLng({
                    lat: Number(data.lat),
                    lng: Number(data.lng),
                });
            }
        } else {
            // Reset form jika buka modal "Tambah"
            setForm({
                name: "", address: "", day_open: "", day_close: "", time_open: "", time_close: "",
            });
            setLatLng(null);
        }
        setError({}); // Clear error saat modal dibuka
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Hapus pesan error spesifik saat user mulai memperbaiki input
        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Serentak
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.name.trim()) { newErrors.name = "Nama outlet harus diisi"; hasError = true; }
        if (!form.address.trim()) { newErrors.address = "Alamat harus diisi"; hasError = true; }
        if (!form.day_open) { newErrors.day_open = "Hari buka harus dipilih"; hasError = true; }
        if (!form.day_close) { newErrors.day_close = "Hari tutup harus dipilih"; hasError = true; }
        if (!form.time_open) { newErrors.time_open = "Jam buka harus diisi"; hasError = true; }
        if (!form.time_close) { newErrors.time_close = "Jam tutup harus diisi"; hasError = true; }

        if (hasError) {
            setError(newErrors);
            return;
        }

        // 2. Eksekusi Submit
        setLoading(true);
        const formData = new FormData();

        // Lebih rapi dan clean
        Object.entries(form).forEach(([key, val]) => {
            if (val) { // Ini otomatis menyaring "", null, dan undefined
                formData.append(key, String(val));
            }
        });

        if (latLng) {
            formData.append('lat', String(latLng.lat));
            formData.append('lng', String(latLng.lng));
        }

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                type="text"
                label="Nama Outlet"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Cabang Utama Sudirman"
                error={error.name ?? ''}
                required
            />

            <FormInput
                type="textarea"
                label="Alamat Lengkap"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Detail alamat outlet..."
                error={error.address ?? ''}
                required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="select"
                    label="Hari Buka"
                    name="day_open"
                    value={form.day_open}
                    options={selectOptions}
                    onChange={handleChange}
                    error={error.day_open ?? ''}
                    required
                />
                <FormInput
                    type="select"
                    label="Hari Tutup"
                    name="day_close"
                    value={form.day_close}
                    options={selectOptions}
                    onChange={handleChange}
                    error={error.day_close ?? ''}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="time"
                    label="Jam Buka"
                    name="time_open"
                    value={form.time_open}
                    onChange={handleChange}
                    error={error.time_open ?? ''}
                    required
                />
                <FormInput
                    type="time"
                    label="Jam Tutup"
                    name="time_close"
                    value={form.time_close}
                    onChange={handleChange}
                    error={error.time_close ?? ''}
                    required
                />
            </div>

            {/* Bagian Maps */}
            <div className="w-full space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Tandai Lokasi di Peta
                </label>
                <div className="w-full rounded-2xl overflow-hidden border border-slate-200">
                    <MapWithSearch
                        onSelect={(lat, lng) => setLatLng({ lat, lng })}
                        lat={latLng?.lat ?? -3.4406} // Default ke Banjarbaru
                        lng={latLng?.lng ?? 114.8315} // Default ke Banjarbaru
                    />
                </div>
            </div>

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdateOutlet;