"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { UserType } from "../page";

type Props = {
    handleResetSubmit: (form: FormData, id: number) => void;
    data: UserType;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

const ResetPasswordForm = ({ handleResetSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            alert("Password minimal 6 karakter!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("password", password);

        handleResetSubmit(formData, data.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-2">
            <div className="p-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-medium mb-4">
                Peringatan: Mereset password akan menimpa password lama milik <strong>{data.name}</strong>. Pastikan Anda menginformasikan password baru ini kepada user yang bersangkutan.
            </div>

            <FormInput
                type="text"
                label="Password Baru"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password baru (min. 6 karakter)"
                required
            />

            <div className="pt-2">
                <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
            </div>
        </form>
    );
};

export default ResetPasswordForm;