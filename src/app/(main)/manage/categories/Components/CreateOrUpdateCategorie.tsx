"use client";

import React, { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Check, ImageIcon, Scissors } from "lucide-react";
import Cropper, { Area } from "react-easy-crop";

import { getCroppedImg } from "@/utils/cropImage";
import { CategoriesType } from "@/types/Admin/CategoriesType";
import IconAutocomplete from "./IconAutocomplete";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ImagePreview from "@/Components/CRUD/FormInput/ImagePreview";
import { AlertComponent } from "@/Components/Alert";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";

// --- TYPES ---
type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: CategoriesType | null;
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
    color: string;
}

interface FormErrors {
    name?: string | null;
    color?: string | null;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
const CreateOrUpdateCategorie = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {

    // --- FORM & VALIDATION STATE ---
    const [form, setForm] = useState<FormState>({ name: "", color: "" });
    const [error, setError] = useState<FormErrors>({});
    const [alert, setAlert] = useState<AlertType | null>(null);

    // --- ICON & IMAGE STATE ---
    const [icon, setIcon] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileImage, setFileImage] = useState<File | null>(null);

    // --- CROPPER STATE ---
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    // ==========================================
    // EFFECTS
    // ==========================================

    // Auto-hide alert timer
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
                color: data.color || "",
            });

            if (data.icon?.startsWith("http")) {
                setPreviewImage(data.icon);
                setIcon("");
            } else {
                setIcon(data.icon || "");
                setPreviewImage("");
            }
        } else {
            setForm({ name: "", color: "" });
            setIcon("");
            setPreviewImage("");
        }
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

        // Hapus pesan error saat user mengetik
        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result as string);
                setIsCropping(true);
            };
            reader.readAsDataURL(file);
        }
        // Reset input value agar bisa pilih file yang sama lagi jika dibatalkan
        e.target.value = '';
    };

    const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleApplyCrop = async () => {
        try {
            if (imageToCrop && croppedAreaPixels) {
                const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
                const croppedFile = new File([croppedBlob], "category_image.jpg", { type: 'image/jpeg' });

                // Hapus cache URL preview sebelumnya dari memori browser
                if (previewImage && previewImage.startsWith("blob:")) {
                    URL.revokeObjectURL(previewImage);
                }

                setPreviewImage(URL.createObjectURL(croppedBlob));
                setFileImage(croppedFile);
                setIsCropping(false);
                setImageToCrop(null);
            }
        } catch (e) {
            console.error("Gagal memotong gambar:", e);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validasi Input
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.name.trim()) {
            newErrors.name = "Nama Kategori harus diisi";
            hasError = true;
        }

        if (icon && (fileImage || previewImage)) {
            setAlert({
                type: "error",
                message: "Pilih salah satu: Gunakan Icon atau Gambar, tidak boleh keduanya.",
                isOpen: true,
            });
            return; // Berhenti langsung jika ada bentrok media
        }

        if (icon && !form.color && !icon?.startsWith('usahaku')) {
            newErrors.color = "Warna icon harus dipilih";
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

        if (fileImage) {
            formData.append('icon', fileImage);
        } else if (icon) {
            formData.append('icon', icon);
            if (form.color) {
                formData.append('color', form.color);
            }
        }

        handleFormSubmit(formData, data?.id ?? null);
    };

    // ==========================================
    // RENDER
    // ==========================================
    return (
        <>
            {/* MODAL CROPPER */}
            {isCropping && imageToCrop && (
                <div className="absolute inset-0 z-[100] bg-zinc-900 flex flex-col rounded-3xl overflow-hidden">
                    <div className="p-4 bg-zinc-800 text-white flex justify-between items-center shadow-md z-10">
                        <span className="flex items-center gap-2 font-semibold">
                            <Scissors size={18} /> Potong Gambar
                        </span>
                        <div className="flex gap-2 text-sm font-medium">
                            <button onClick={() => setIsCropping(false)} className="px-4 py-2 bg-zinc-600 hover:bg-zinc-500 rounded-xl transition-colors">
                                Batal
                            </button>
                            <button onClick={handleApplyCrop} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 transition-colors">
                                <Check size={16} /> Gunakan
                            </button>
                        </div>
                    </div>

                    <div className="relative flex-1 bg-black">
                        <Cropper
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Aspek ratio 1:1
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    <div className="p-6 bg-zinc-800 z-10">
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <p className="text-center text-zinc-400 text-xs mt-3 font-medium">Geser untuk Zoom</p>
                    </div>
                </div>
            )}

            {/* FORM KATEGORI */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormInput
                    type="text"
                    label="Nama Kategori"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Contoh: Makanan, Minuman, Pakaian..."
                    required
                    error={error.name ?? ''}
                />

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Icon (Opsional)</label>
                        <IconAutocomplete
                            value={icon}
                            onChange={(val) => setIcon(val)}
                            handleDelete={() => setIcon('')}
                        />
                        <p className="text-[11px] text-slate-400 font-medium">
                            Ketik nama icon (cth: fa-solid:home). Jika menggunakan Icon, jangan unggah gambar.
                        </p>
                    </div>

                    {icon && (
                        <FormInput
                            type="color"
                            label="Warna Icon"
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                            required
                            error={error.color ?? ''}
                        />
                    )}
                </div>

                <div className="flex items-center text-slate-400 gap-4 opacity-70">
                    <div className="border-t border-slate-300 w-full" />
                    <p className="text-xs font-bold uppercase tracking-widest">Atau</p>
                    <div className="border-t border-slate-300 w-full" />
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                        <ImageIcon size={18} className="text-slate-400" /> Gambar Kategori (Opsional)
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-all text-slate-600 text-sm cursor-pointer"
                    />
                    <ImagePreview
                        imageUrl={previewImage}
                        fileName=""
                        handleDeleteImage={() => {
                            setPreviewImage('');
                            setFileImage(null);
                        }}
                    />
                    <p className="text-[11px] text-slate-400 font-medium">
                        Unggah gambar berformat kotak (1:1). Jika menggunakan Gambar, kosongkan kolom Icon.
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
        </>
    );
};

export default CreateOrUpdateCategorie;