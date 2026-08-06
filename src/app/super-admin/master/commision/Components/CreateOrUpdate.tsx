"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import { AlertComponent } from "@/Components/Alert";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { CommissionSettingType } from "../page";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: CommissionSettingType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface FormState {
    commission_type: string;
    amount: string;
}

interface FormErrors {
    [key: string]: string | null;
}

const CreateOrUpdate = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        commission_type: "", amount: ""
    });

    const [error, setError] = useState<FormErrors>({});

    useEffect(() => {
        if (data) {
            setForm({
                commission_type: data.commission_type || "",
                amount: data.amount ? String(data.amount) : "",
            });
        } else {
            setForm({ commission_type: "", amount: "" });
        }
        setError({});
    }, [data]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        // Auto uppercase khusus untuk tipe komisi
        const finalValue = name === 'commission_type' ? value.toUpperCase() : value;

        setForm((prev) => ({ ...prev, [name]: finalValue }));

        if (error[name]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.commission_type.trim()) {
            newErrors.commission_type = "Tipe Komisi harus diisi";
            hasError = true;
        }
        if (!form.amount.trim() || Number(form.amount) < 0) {
            newErrors.amount = "Nominal harus diisi dengan angka valid";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('commission_type', form.commission_type);
        formData.append('amount', form.amount);

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-1">
                <FormInput
                    type="text"
                    label="Tipe Komisi"
                    name="commission_type"
                    value={form.commission_type}
                    onChange={handleChange}
                    placeholder="Contoh: FIRST_MONTH atau RENEWAL"
                    required
                    error={error.commission_type ?? ''}
                />
                <p className="text-[11px] text-slate-400 font-medium px-1">
                    *Gunakan format uppercase tanpa spasi (cth: REWARD_AGEN).
                </p>
            </div>

            <FormInput
                type="price"
                label="Nominal Komisi (Rp)"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Contoh: 15000"
                required
                error={error.amount ?? ''}
            />

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdate;