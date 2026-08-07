"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";
import { Business } from "../page"; // Sesuaikan dengan path interface Business kamu

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: Business | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
    onCancel: () => void;
};

interface FormState {
    plan: string;
    subscription_status: string;
    duration: string;
    start_time: string;
    end_time: string;
}

const UpdateSubscriptionForm = ({ handleFormSubmit, data, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        plan: "trial",
        subscription_status: "active",
        duration: "custom",
        start_time: "",
        end_time: "",
    });

    // Load data awal ketika modal dibuka
    useEffect(() => {
        if (data) {
            setForm({
                plan: data.plan?.toLowerCase() || "trial",
                subscription_status: data.subscription_status?.toLowerCase() || "active",
                duration: "custom",
                // Ambil hanya YYYY-MM-DD dari format datetime database
                start_time: data.start_time ? data.start_time.split(" ")[0].split("T")[0] : "",
                end_time: data.end_time ? data.end_time.split(" ")[0].split("T")[0] : "",
            });
        }
    }, [data]);

    // Handler umum untuk input text/select
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handler khusus untuk perubahan Durasi (1, 2, 3 bulan)
    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;

        if (val !== "custom" && form.start_time) {
            // Kalkulasi otomatis Tanggal Selesai berdasarkan Tanggal Mulai
            const startDate = new Date(form.start_time);
            startDate.setMonth(startDate.getMonth() + parseInt(val));
            const endStr = startDate.toISOString().split("T")[0];

            setForm((prev) => ({ ...prev, duration: val, end_time: endStr }));
        } else {
            setForm((prev) => ({ ...prev, duration: val }));
        }
    };

    // Handler khusus saat Tanggal Mulai diubah manual (agar End Date ter-update jika durasi dipilih)
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        setForm((prev) => {
            const newState = { ...prev, start_time: newStart };
            if (prev.duration !== "custom" && newStart) {
                const startDate = new Date(newStart);
                startDate.setMonth(startDate.getMonth() + parseInt(prev.duration));
                newState.end_time = startDate.toISOString().split("T")[0];
            }
            return newState;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("plan", form.plan);
        formData.append("subscription_status", form.subscription_status);

        // Kirim tanggal dengan penambahan jam agar sesuai format datetime DB (bisa disesuaikan dengan DB kamu)
        formData.append("start_time", form.start_time ? `${form.start_time} 00:00:00` : "");
        formData.append("end_time", form.end_time ? `${form.end_time} 23:59:59` : "");

        handleFormSubmit(formData, data?.id ?? null);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 p-2">

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Paket Layanan (Plan)</label>
                    <select
                        name="plan"
                        value={form.plan}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    >
                        <option value="trial">Trial</option>
                        <option value="premium">Premium</option>
                        <option value="permanent">Permanent</option>
                    </select>
                </div>
                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Status Langganan</label>
                    <select
                        name="subscription_status"
                        value={form.subscription_status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    >
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-2">
                <label className="text-[12px] font-bold text-slate-700 block mb-1">Perpanjang Cepat (Durasi)</label>
                <select
                    name="duration"
                    value={form.duration}
                    onChange={handleDurationChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-emerald-50 text-emerald-700 focus:bg-white focus:border-emerald-500 transition-all outline-none text-sm font-bold"
                >
                    <option value="custom">Custom (Atur Manual)</option>
                    <option value="1">1 Bulan</option>
                    <option value="2">2 Bulan</option>
                    <option value="3">3 Bulan</option>
                </select>
                <p className="text-[10px] text-slate-500 mt-1">*Pilih durasi untuk menghitung Tanggal Selesai secara otomatis.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Tanggal Mulai</label>
                    <input
                        type="date"
                        name="start_time"
                        value={form.start_time}
                        onChange={handleStartDateChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    />
                </div>
                <div>
                    <label className="text-[12px] font-bold text-slate-700 block mb-1">Tanggal Selesai</label>
                    <input
                        type="date"
                        name="end_time"
                        value={form.end_time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-sm font-medium text-slate-700"
                    />
                </div>
            </div>

            <div className="pt-2">
                <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
            </div>
        </form>
    );
};

export default UpdateSubscriptionForm;