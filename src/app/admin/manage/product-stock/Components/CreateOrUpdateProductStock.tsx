"use client";

import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Get } from "@/utils/Get";
import { ProductStockType } from "@/types/Admin/ProductStockType";
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
    { label: "Tambah stok", value: 'restock' },
    { label: "Penyesuaian/Kurangi stok", value: 'adjustment' },
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
                // console.error("Gagal mengambil data outlet:", error);
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

                // REFACTOR: Tambahkan parameter is_qty=1 (atau is_stock=1) di sini
                // agar backend hanya mereturn produk yang stoknya dikelola
                const res = await Get<{ success: boolean, data: { data: ProductsType[] } }>(`client/products?limit=10000&outlet=${outletLabel}&is_stock=1`);

                if (res?.success && res.data?.data) {
                    setProducts(res.data.data);
                    setProductOptions(res.data.data.map((item) => ({
                        label: item.name,
                        value: item.id,
                    })));
                }
            } catch (error) {
                // console.error("Gagal mengambil data produk:", error);
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
    // 1. Inisialisasi State (Langsung dari data update jika ada)
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

    // 2. Mengambil data Options dari Custom Hooks
    const { outlets } = useOutlets();
    const { products, productOptions } = useProducts(form.outlet_id, outlets);

    // Auto-select Outlet jika hanya ada 1 dan sedang dalam mode "Create"
    useEffect(() => {
        if (outlets.length === 1 && !form.outlet_id) {
            setForm((prev) => ({ ...prev, outlet_id: outlets[0].value }));
        }
    }, [outlets, form.outlet_id]);

    // 3. Handlers & Computed Values
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const files = (e.target as HTMLInputElement).files;

        setForm((prev) => ({
            ...prev,
            [name]: type === "file" && files ? files[0] : value,
        }));

        // Hapus pesan error saat user mengetik
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
        }
        return currentStock - inputStock;
    }, [product?.product_stock, product?.variants, product?.has_variant, product?.is_shared_stock, form.stock, form.reference_type, form?.product_variant_id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- VALIDASI ---
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.outlet_id || form.outlet_id === "undefined") {
            newErrors.outlet_id = "Outlet harus diisi";
            hasError = true;
        }
        if (!form.product_id) {
            newErrors.product_id = "Product harus diisi";
            hasError = true;
        }
        if (!form.date) {
            newErrors.date = "Tanggal harus diisi";
            hasError = true;
        }
        if (variantOptions.length > 0 && !form.product_variant_id && !product?.is_shared_stock) {
            newErrors.product_variant_id = "Variant harus diisi";
            hasError = true;
        }
        if (!form.reference_type) {
            newErrors.reference_type = "Reference harus diisi";
            hasError = true;
        }
        if (!form.stock) {
            newErrors.stock = "Stock harus diisi";
            hasError = true;
        }
        if (totalStock < 0) {
            newErrors.stock = "Kuantitas tidak boleh melebihi stok saat ini.";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        // --- PROSES SUBMIT ---
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, val]) => {
                // Hindari mengirim data kosong/null
                if (val !== null && val !== undefined && val !== "") {
                    formData.append(key, String(val));
                }
            });

            await handleFormSubmit(formData);
        } catch (err) {
            // console.error("Gagal memproses data stok produk:", err);
            setLoading(false); // Pastikan loading mati jika error catch blok ini aktif
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                type="autocomplete"
                label="Cabang"
                name="outlet_id"
                value={form.outlet_id}
                onChange={handleChange}
                options={outlets}
                error={error.outlet_id ?? ''}
            />

            <FormInput
                type="autocomplete"
                label="Produk"
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
                    label="Produk Variant"
                    name="product_variant_id"
                    value={form.product_variant_id}
                    onChange={handleChange}
                    options={variantOptions}
                    error={error.product_variant_id ?? ''}
                />
            )}

            <FormInput
                type="date"
                label="Tanggal"
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

            <div className="flex items-center gap-4">
                <div className="w-full">
                    <FormInput
                        type="number"
                        label="Stok Saat Ini"
                        name="" // Dikosongkan karena tidak masuk ke FormState
                        value={stockNow}
                        onChange={() => { }}
                        placeholder="Type number"
                        disabled={true}
                    />
                    {/* Placeholder space jika kolom Kuantitas memiliki error */}
                    {(error.stock) && <div className="h-5 mt-1"></div>}
                </div>

                <FormInput
                    type="number"
                    label="Kuantitas"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Type number"
                    error={error.stock ?? ''}
                    disabled={!form.reference_type}
                />
            </div>

            <FormInput
                type="number"
                label="Estimasi Stok Akhir"
                name=""
                value={totalStock}
                onChange={() => { }}
                placeholder="Type number"
                disabled={true}
                error={totalStock < 0 ? 'Jumlah tidak boleh lebih besar dari stok saat ini.' : ''}
            />

            {form.reference_type === 'adjustment' && (
                <FormInput
                    type="textarea"
                    label="Catatan"
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                    error={error.note ?? ''}
                />
            )}

            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdateProductStock;