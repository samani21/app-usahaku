"use client";

import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Get } from "@/utils/Get";
import { ProductsType } from "@/types/Admin/ProductsType";
import FormInput from "@/Components/CRUD/FormInput/FormInput";
import ButtonSubmit from "@/Components/CRUD/FormInput/ButtonSubmit";

// --- TYPES & INTERFACES ---
type Props = {
    handleFormSubmit: (form: FormData) => void;
    loading: boolean;
    onCancel: () => void;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

interface OptionsType {
    label: string;
    value: string | number;
}

interface FormState {
    outlet_id: string | number;
    product_id: string | number;
    product_variant_id: string | number;
    date: string;
    stock: string | number;
    reference_type: string;
    note: string;
}

interface FormErrors {
    outlet_id?: string | null;
    product_id?: string | null;
    product_variant_id?: string | null;
    date?: string | null;
    stock?: string | null;
    reference_type?: string | null;
    note?: string | null;
}

const selectOptions: OptionsType[] = [
    { label: "Tambah Stok (In)", value: 'restock' },
    { label: "Pengurangan Stok (Out)", value: 'adjustment' },
];

// ==========================================
// CUSTOM HOOKS
// ==========================================

const useOutlets = () => {
    const [outlets, setOutlets] = useState<OptionsType[]>([]);

    useEffect(() => {
        const fetchOutlets = async () => {
            try {
                const res = await Get<{ success: boolean, data: any[] }>('client/outlet?limit=10000');
                if (res?.success && res.data) {
                    const formatted = res.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }));
                    setOutlets(formatted);
                }
            } catch (error) {
                // Handle error gracefully
            }
        };
        fetchOutlets();
    }, []);

    return { outlets };
};

const useProducts = (outletId: string | number, outlets: OptionsType[]) => {
    const [products, setProducts] = useState<ProductsType[]>([]);
    const [productOptions, setProductOptions] = useState<OptionsType[]>([]);

    useEffect(() => {
        if (!outletId) {
            setProducts([]);
            setProductOptions([]);
            return;
        }

        const fetchProducts = async () => {
            try {
                const outletLabel = outlets.find((o) => String(o.value) === String(outletId))?.label;
                if (!outletLabel) return;

                // Hanya mengambil produk yang is_stock/is_qty nya dikelola
                const res = await Get<{ success: boolean, data: { data: ProductsType[] } }>(`client/products?limit=10000&outlet=${outletLabel}&is_stock=1`);

                if (res?.success && res.data?.data) {
                    setProducts(res.data.data);
                    setProductOptions(res.data.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })));
                }
            } catch (error) {
                // Handle error gracefully
            }
        };

        fetchProducts();
    }, [outletId, outlets]);

    return { products, productOptions };
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const CreateOrUpdateProductStock = ({ handleFormSubmit, loading, setLoading, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        outlet_id: "",
        product_id: "",
        product_variant_id: "",
        date: "",
        stock: "",
        reference_type: "",
        note: "",
    });

    const [error, setError] = useState<FormErrors>({});

    const { outlets } = useOutlets();
    const { products, productOptions } = useProducts(form.outlet_id, outlets);

    // Auto-select Outlet
    useEffect(() => {
        if (outlets.length === 1 && !form.outlet_id) {
            setForm((prev) => ({ ...prev, outlet_id: outlets[0].value }));
        }
    }, [outlets, form.outlet_id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const files = (e.target as HTMLInputElement).files;

        setForm((prev) => ({
            ...prev,
            [name]: type === "file" && files ? files[0] : value,
        }));

        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const variantOptions = useMemo(() => {
        const product = products.find((p) => String(p.id) === String(form.product_id));
        return product?.variants?.map((item: any) => ({
            label: item.name,
            value: item.id,
        })) || [];
    }, [form.product_id, products]);

    const product = useMemo(() => {
        return products.find((p) => String(p.id) === String(form.product_id));
    }, [form.product_id, products]);

    const stockNow = useMemo(() => {
        if (product?.has_variant && !product?.is_shared_stock) {
            return product?.variants?.find((v) => String(v?.id) === String(form.product_variant_id))?.product_variant_stock ?? 0;
        }
        return product?.product_stock ?? 0
    }, [product?.product_stock, product?.variants, product?.has_variant, product?.is_shared_stock, form?.product_variant_id])

    const totalStock = useMemo(() => {
        let currentStock = 0;
        if (product?.has_variant && !product?.is_shared_stock) {
            currentStock = product?.variants?.find((v) => String(v?.id) === String(form.product_variant_id))?.product_variant_stock ?? 0;
        } else {
            currentStock = Number(product?.product_stock || 0);
        }

        const inputStock = Number(form.stock || 0);

        if (form.reference_type === 'restock') {
            return currentStock + inputStock;
        } else if (form.reference_type === 'adjustment') {
            return currentStock - inputStock;
        }
        return currentStock;
    }, [product?.product_stock, product?.variants, product?.has_variant, product?.is_shared_stock, form.stock, form.reference_type, form?.product_variant_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- VALIDASI ---
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.outlet_id || form.outlet_id === "undefined") {
            newErrors.outlet_id = "Cabang outlet harus dipilih";
            hasError = true;
        }
        if (!form.product_id) {
            newErrors.product_id = "Produk harus dipilih";
            hasError = true;
        }
        if (!form.date) {
            newErrors.date = "Tanggal transaksi harus diisi";
            hasError = true;
        }
        if (variantOptions.length > 0 && !form.product_variant_id && !product?.is_shared_stock) {
            newErrors.product_variant_id = "Varian produk harus dipilih";
            hasError = true;
        }
        if (!form.reference_type) {
            newErrors.reference_type = "Tipe transaksi harus dipilih";
            hasError = true;
        }
        if (!form.stock || Number(form.stock) <= 0) {
            newErrors.stock = "Kuantitas stok tidak valid";
            hasError = true;
        }
        if (totalStock < 0) {
            newErrors.stock = "Kuantitas pengurangan melebihi stok saat ini!";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, val]) => {
                if (val !== null && val !== undefined && val !== "") {
                    formData.append(key, String(val));
                }
            });

            await handleFormSubmit(formData);
        } catch (err) {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                type="autocomplete"
                label="Cabang (Outlet)"
                name="outlet_id"
                value={form.outlet_id}
                onChange={handleChange}
                options={outlets}
                error={error.outlet_id ?? ''}
            />

            <FormInput
                type="autocomplete"
                label="Pilih Produk"
                name="product_id"
                value={form.product_id}
                onChange={handleChange}
                options={productOptions}
                error={error.product_id ?? ''}
                disabled={!form.outlet_id}
            />

            {variantOptions.length > 0 && !product?.is_shared_stock && (
                <FormInput
                    type="autocomplete"
                    label="Pilih Varian"
                    name="product_variant_id"
                    value={form.product_variant_id}
                    onChange={handleChange}
                    options={variantOptions}
                    error={error.product_variant_id ?? ''}
                />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="date"
                    label="Tanggal Transaksi"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    error={error.date ?? ''}
                />

                <FormInput
                    type="select"
                    label="Jenis Penyesuaian"
                    name="reference_type"
                    value={form.reference_type}
                    onChange={handleChange}
                    options={selectOptions}
                    error={error.reference_type ?? ''}
                />
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="w-full">
                    <FormInput
                        type="number"
                        label="Stok Saat Ini"
                        name=""
                        value={stockNow}
                        onChange={() => { }}
                        placeholder="0"
                        disabled={true}
                    />
                </div>

                <div className="w-full">
                    <FormInput
                        type="number"
                        label="Kuantitas (Qty)"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="Misal: 10"
                        error={error.stock ?? ''}
                        disabled={!form.reference_type}
                    />
                </div>

                <div className="w-full">
                    <FormInput
                        type="number"
                        label="Estimasi Akhir"
                        name=""
                        value={totalStock}
                        onChange={() => { }}
                        placeholder="0"
                        disabled={true}
                        error={totalStock < 0 ? 'Stok tidak cukup' : ''}
                    />
                </div>
            </div>

            {form.reference_type === 'adjustment' && (
                <FormInput
                    type="textarea"
                    label="Catatan Pengurangan Stok"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    error={error.note ?? ''}
                    placeholder="Contoh: Barang kedaluwarsa, rusak, dll..."
                />
            )}

            <div className="pt-2">
                <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
            </div>
        </form>
    );
};

export default CreateOrUpdateProductStock;