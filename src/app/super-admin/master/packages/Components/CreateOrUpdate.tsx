"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import { AlertComponent } from "@/Components/Alert";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { PackageType } from "../page";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: PackageType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface FormState {
    name: string;
    base_price: string;
}

interface FormErrors {
    [key: string]: string | null;
}

const CreateOrUpdate = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        name: "", base_price: ""
    });

    const [error, setError] = useState<FormErrors>({});

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                base_price: data.base_price ? String(data.base_price) : "",
            });
        } else {
            setForm({ name: "", base_price: "" });
        }
        setError({});
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
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

        if (!form.name.trim()) {
            newErrors.name = "Nama Paket harus diisi";
            hasError = true;
        }
        if (!form.base_price.trim() || Number(form.base_price) < 0) {
            newErrors.base_price = "Harga Dasar harus diisi dengan angka valid";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('base_price', form.base_price);

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <FormInput
                type="text"
                label="Nama Paket"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Subscription, Premium, dll"
                required
                error={error.name ?? ''}
            />

            <FormInput
                type="price"
                label="Harga Dasar (Rp)"
                name="base_price"
                value={form.base_price}
                onChange={handleChange}
                placeholder="Contoh: 50000"
                required
                error={error.base_price ?? ''}
            />

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdate;