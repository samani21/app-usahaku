"use client";

import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";

import { MasterBanksType } from "@/types/Admin/Banks";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ImagePreview from "@/Components/CRUD/FormInput/ImagePreview";
import { AlertComponent } from "@/Components/Alert";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { formatImage } from "@/utils/formatImage";

// --- TYPES ---
type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: MasterBanksType | null;
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
    name: string;
    code: string;
}

interface FormErrors {
    name?: string | null;
    code?: string | null;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
const CreateOrUpdate = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {

    // --- FORM & VALIDATION STATE ---
    const [form, setForm] = useState<FormState>({ name: "", code: "" });
    const [error, setError] = useState<FormErrors>({});
    const [alert, setAlert] = useState<AlertType | null>(null);

    // --- IMAGE STATE ---
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileImage, setFileImage] = useState<File | null>(null);

    // ==========================================
    // EFFECTS
    // ==========================================

    useEffect(() => {
        if (alert?.isOpen) {
            const timer = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // Sinkronisasi data saat mode Edit / Tambah
    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                code: data.code || "",
            });

            if (data.logo) {
                const logo = formatImage(data?.logo ?? '');
                // Set preview dari server
                setPreviewImage(logo ?? '');
            } else {
                setPreviewImage("");
            }
        } else {
            setForm({ name: "", code: "" });
            setPreviewImage("");
        }
        setFileImage(null);
        setError({});
    }, [data]);

    // ==========================================
    // HANDLERS
    // ==========================================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Handler file baru (TANPA CROPPER)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            // Bersihkan URL object lama agar tidak memakan memori browser (Memory Leak Protection)
            if (previewImage && previewImage.startsWith("blob:")) {
                URL.revokeObjectURL(previewImage);
            }

            // Buat preview URL langsung dari file asli
            setPreviewImage(URL.createObjectURL(file));
            setFileImage(file);
        }
        // Reset input value agar user bisa memilih file yang sama lagi jika dibatalkan
        e.target.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Input
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.name.trim()) {
            newErrors.name = "Nama Bank harus diisi";
            hasError = true;
        }

        if (!form.code.trim()) {
            newErrors.code = "Kode Bank harus diisi";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        // 2. Eksekusi API
        setLoading(true);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('code', form.code);

        if (fileImage) {
            formData.append('logo', fileImage); // File dikirim utuh, menjaga transparan PNG!
        }

        handleFormSubmit(formData, data?.id ?? null);
    };

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                type="text"
                label="Nama Bank"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Bank Central Asia (BCA)"
                required
                error={error.name ?? ''}
            />

            <FormInput
                type="text"
                label="Kode Bank"
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="Contoh: 014"
                required
                error={error.code ?? ''}
            />

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon size={18} className="text-slate-400" /> Logo Bank (Opsional)
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all text-slate-600 text-sm cursor-pointer"
                />

                {/* Preview Image Component bawaan kamu */}
                <ImagePreview
                    imageUrl={previewImage}
                    fileName=""
                    handleDeleteImage={() => {
                        setPreviewImage('');
                        setFileImage(null);
                    }}
                />

                <p className="text-[11px] text-slate-400 font-medium">
                    *Gunakan logo format <strong>PNG transparan</strong> agar hasil lebih rapi di website.
                </p>
            </div>

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