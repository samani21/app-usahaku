"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { OutletsType } from "@/types/Admin/OutletType";
import { ExpenseForm, ExpensesType } from "./type";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData, id: number | null) => void;
    dataUpdate?: ExpensesType | null;
    outlets: OutletsType[]; // Untuk dropdown pilih cabang
    loading: boolean;
};

// Pilihan default untuk kategori pengeluaran
const CATEGORY_OPTIONS = [
    { label: "Gaji Karyawan", value: "Gaji Karyawan" },
    { label: "Listrik & Air", value: "Listrik & Air" },
    { label: "Sewa Tempat / Outlet", value: "Sewa Tempat" },
    { label: "Belanja Bahan Baku (Luar Sistem)", value: "Bahan Baku" },
    { label: "Marketing & Iklan", value: "Marketing" },
    { label: "Perawatan & Perbaikan (Maintenance)", value: "Maintenance" },
    { label: "Operasional Lainnya", value: "Operasional" },
];

// Helper Format Uang
const formatCurrency = (val: string | number | undefined) => {
    if (val === undefined || val === null || val === "") return "";
    const numericStr = String(val).replace(/[^0-9]/g, "");
    return numericStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ExpenseFormModalContent({ isOpen, onClose, onSubmit, dataUpdate, outlets, loading }: Props) {
    const initialState: ExpenseForm = {
        outlet_id: "",
        category: CATEGORY_OPTIONS[0].value, // Default ke pilihan pertama
        amount: "",
        expense_date: new Date().toISOString().split('T')[0], // Default hari ini
        notes: "",
    };

    const [formData, setFormData] = useState<ExpenseForm>(initialState);
    const [errors, setErrors] = useState<Partial<ExpenseForm>>({});

    // Mapping Outlets untuk FormInput select
    const outletOptions = [
        { label: "Pusat / Semua Cabang (Opsional)", value: "" },
        ...outlets.map((o) => ({ label: o.name, value: String(o.id) })),
    ];

    useEffect(() => {
        if (isOpen) {
            if (dataUpdate) {
                setFormData({
                    outlet_id: dataUpdate.outlet_id ? String(dataUpdate.outlet_id) : "",
                    category: dataUpdate.category,
                    amount: String(dataUpdate.amount),
                    expense_date: dataUpdate.expense_date,
                    notes: dataUpdate.notes ?? "",
                });
            } else {
                setFormData(initialState);
            }
            setErrors({});
        }
    }, [isOpen, dataUpdate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue = value;

        // Custom formatting untuk nominal uang
        if (name === "amount") {
            newValue = value.replace(/[^0-9]/g, "");
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (errors[name as keyof ExpenseForm]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validasi Sederhana
        let hasError = false;
        const newErrors: Partial<ExpenseForm> = {};

        if (!formData.amount || Number(formData.amount) <= 0) {
            newErrors.amount = "Nominal pengeluaran wajib diisi";
            hasError = true;
        }
        if (!formData.expense_date) {
            newErrors.expense_date = "Tanggal wajib diisi";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Siapkan FormData
        const payload = new FormData();
        if (formData.outlet_id) payload.append("outlet_id", formData.outlet_id);
        payload.append("category", formData.category);
        payload.append("amount", formData.amount.toString());
        payload.append("expense_date", formData.expense_date);
        if (formData.notes) payload.append("notes", formData.notes);

        onSubmit(payload, dataUpdate?.id ?? null);
    };

    if (!isOpen) return null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="autocomplete"
                    label="Outlet / Cabang"
                    name="outlet_id"
                    value={formData.outlet_id}
                    onChange={handleChange}
                    options={outletOptions}
                    information="Kosongkan jika ini adalah pengeluaran pusat (tidak terikat cabang tertentu)."
                />

                <FormInput
                    type="autocomplete"
                    label="Kategori Pengeluaran"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={CATEGORY_OPTIONS}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Nominal Pengeluaran (Rp)"
                    type="price"
                    name="amount"
                    value={formatCurrency(formData.amount)}
                    onChange={handleChange}
                    error={errors.amount}
                    required
                />

                <FormInput
                    label="Tanggal Pengeluaran"
                    type="date"
                    name="expense_date"
                    value={formData.expense_date}
                    onChange={handleChange}
                    error={errors.expense_date}
                    required
                />
            </div>

            <FormInput
                label="Catatan Lengkap (Opsional)"
                type="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Misal: Bayar tagihan listrik bulan Agustus 2026..."
            />

            <div className="pt-4 border-t border-slate-200">
                <ButtonSubmit onClose={onClose} isSubmitting={loading} />
            </div>
        </form>
    );
}