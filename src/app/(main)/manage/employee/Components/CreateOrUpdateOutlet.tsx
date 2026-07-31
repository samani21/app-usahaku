"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { EmployeeType } from "../page";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: EmployeeType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface FormState {
    full_name: string;
    email: string;
    whatsapp: string;
}

interface FormErrors {
    full_name?: string | null;
    email?: string | null;
    whatsapp?: string | null;
}

const CreateOrUpdateEmployee = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {

    // Inisialisasi State Form Pegawai
    const [form, setForm] = useState<FormState>({
        full_name: "",
        email: "",
        whatsapp: "",
    });

    const [error, setError] = useState<FormErrors>({});

    // Sinkronisasi data saat mode Edit vs Tambah
    useEffect(() => {
        if (data) {
            setForm({
                full_name: data.full_name || "",
                email: data.user?.email || "",
                whatsapp: data.user?.whatsapp || "",
            });
        } else {
            // Reset form jika buka modal "Tambah"
            setForm({ full_name: "", email: "", whatsapp: "" });
        }
        setError({}); // Clear error saat modal dibuka
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let finalValue = value;

        // --- SOP: Auto-Format WhatsApp (UX Mulus) ---
        if (name === "whatsapp") {
            // 1. Hapus semua karakter selain angka (termasuk spasi, strip, dan +)
            let cleaned = value.replace(/\D/g, "");

            // 2. Cek dan ubah awalan
            if (cleaned.startsWith("0")) {
                // Jika mulai dengan '0' (contoh: 0812...), ubah '0' jadi '62'
                cleaned = "62" + cleaned.substring(1);
            } else if (cleaned.startsWith("8")) {
                // Jika mulai dengan '8' (contoh: 812...), tambahkan '62' di depan
                cleaned = "62" + cleaned;
            }
            // Jika sudah mulai dengan '62' (baik dari ketikan atau paste +62), biarkan saja

            finalValue = cleaned;
        }

        setForm((prev) => ({ ...prev, [name]: finalValue }));

        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Frontend
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.full_name.trim()) { newErrors.full_name = "Nama pegawai harus diisi"; hasError = true; }
        if (!form.email.trim()) { newErrors.email = "Email login harus diisi"; hasError = true; }
        if (!form.whatsapp.trim()) {
            newErrors.whatsapp = "No WhatsApp harus diisi";
            hasError = true;
        } else if (form.whatsapp.length < 10) {
            newErrors.whatsapp = "No WhatsApp tidak valid";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        // 2. Eksekusi Submit
        setLoading(true);
        const formData = new FormData();

        Object.entries(form).forEach(([key, val]) => {
            // Jika mode edit, email tidak perlu dikirim karena tidak boleh diubah
            if (data && key === 'email') return;

            if (val) {
                formData.append(key, String(val));
            }
        });

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                type="text"
                label="Nama Lengkap Pegawai"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                error={error.full_name ?? ''}
                required
            />

            <FormInput
                type="email"
                label="Email (Login ID)"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Contoh: budi@tokosepatu.com"
                error={error.email ?? ''}
                required
                disabled={!!data} // Kunci input email saat Edit (hanya bisa diisi saat Tambah)
            />
            {!!data && (
                <p className="-mt-4 text-xs text-slate-400">Email login tidak dapat diubah setelah akun dibuat.</p>
            )}

            <FormInput
                type="text"
                label="Nomor WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Contoh: 6281234567890"
                error={error.whatsapp ?? ''}
                required
            />

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdateEmployee;