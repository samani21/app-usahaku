"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { UserType } from "../page";

type Props = {
    handleFormSubmit: (form: FormData, id: number) => void;
    data: UserType;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

const UpdateUserForm = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState({
        name: "",
        whatsapp: "",
        role: "",
        status: "active", // Ganti state jadi status
    });

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                whatsapp: data.whatsapp || "",
                role: data.role || "user",
                status: data.status || "active",
            });
        }
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("whatsapp", form.whatsapp);
        formData.append("role", form.role);
        formData.append("status", form.status); // Kirim 'status'

        handleFormSubmit(formData, data.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
            <FormInput
                type="text"
                label="Nama Pengguna"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
            />

            <FormInput
                type="text"
                label="Nomor WhatsApp"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Role Akses</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin Bisnis</option>
                        <option value="staff">Staff / Kasir</option>
                        <option value="user">User Biasa</option>
                    </select>
                </div>

                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Status Akses (Blokir)</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm font-bold ${form.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                    >
                        <option value="active">Active (Bisa Login)</option>
                        <option value="suspended">Suspended (Diblokir)</option>
                    </select>
                </div>
            </div>

            <p className="text-[10px] text-slate-500 italic mt-1">
                *Catatan: Status verifikasi sistem (OTP/Email) tidak dapat diubah secara manual melalui form ini demi keamanan.
            </p>

            <div className="pt-2">
                <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
            </div>
        </form>
    );
};

export default UpdateUserForm;