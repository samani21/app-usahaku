"use client"

import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useCallback, useEffect, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { AlertTriangle, Check, ImageIcon, PlusCircle, Scissors, Trash2, ScanBarcode } from 'lucide-react';

import { CategoriesType } from '@/types/Admin/CategoriesType';
import { initialProductState, ProductForm, ProductsType, Variant } from '@/types/Admin/ProductsType';
import { getCroppedImg } from '@/utils/cropImage';
import { Get } from '@/utils/Get';

import ButtonSubmit from '@/Components/CRUD/FormInput/ButtonSubmit';
import FormInput from '@/Components/CRUD/FormInput/FormInput';
import ImagePreview from '@/Components/CRUD/FormInput/ImagePreview';
import ToggleSwitch from '@/Components/ui/ToggleSwitch';
import { formatImage } from '@/utils/formatImage';

// --- TYPES ---
type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData, id: number | null) => void;
    dataUpdate?: ProductsType | null;
    loading: boolean;
    setLoading: Dispatch<SetStateAction<boolean>>;
}

interface OptionsType {
    label: string;
    value: number;
}

interface FormErrors {
    name?: string;
    price?: string;
    is_shared_stock?: string;
    image?: string;
    variants?: { name?: string; price?: string }[];
}

const useParentStock = [
    { label: "Satu kesatuan stok (Stok Induk)", value: "1" },
    { label: "Stok terpisah per varian", value: "0" },
];

// --- HELPER FORMAT UANG ---
const formatCurrency = (val: string | number) => {
    if (!val) return "";
    const numericStr = String(val).replace(/[^0-9]/g, ""); // Hanya sisakan angka
    return numericStr.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Tambahkan titik setiap 3 digit
};

const ServiceFormModalContent = ({ isOpen, onClose, onSubmit, dataUpdate, loading }: Props) => {
    // --- MAIN STATE ---
    const [productData, setProductData] = useState<ProductForm>(initialProductState);
    const [error, setError] = useState<FormErrors>({});
    const [categories, setCategories] = useState<OptionsType[]>([]);
    const [deleteVariants, setDeleteVariants] = useState<number[]>([]);

    // --- CROPPER STATE ---
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [idVariant, setIdVariant] = useState<number | null>(null);

    // ==========================================
    // EFFECTS & HELPERS
    // ==========================================
    const resetForm = useCallback(() => {
        if (productData.imagePreviewUrl) URL.revokeObjectURL(productData.imagePreviewUrl);
        productData.variants.forEach(v => {
            if (v.imagePreviewUrl) URL.revokeObjectURL(v.imagePreviewUrl);
        });

        setProductData(initialProductState);
        setError({});
        setImageToCrop(null);
        setIsCropping(false);
        setDeleteVariants([]);
    }, [productData.imagePreviewUrl, productData.variants]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await Get<{ success: boolean, data: any[] }>('client/categorie?limit=10000');
            if (res?.success) {
                const formatted = res.data.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }));
                setCategories(formatted);
            }
        } catch (e) {
            // console.error("Gagal mengambil kategori", e);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        } else {
            resetForm();
        }
    }, [isOpen, fetchCategories, resetForm]);

    useEffect(() => {
        if (dataUpdate && isOpen) {
            const mappedVariants: Variant[] = dataUpdate.variants?.map((v: any) => ({
                name: v?.name || "",
                price: v?.price ?? "",
                id: v?.id ?? 0,
                image: null,
                imagePreviewUrl: v?.image || null,
                is_package: v?.qty_package > 1,
                qty_package: v?.qty_package
            })) || [];

            setProductData({
                name: dataUpdate.name,
                description: dataUpdate.description,
                price: dataUpdate.price,
                category: dataUpdate.product_category_id ?? null,
                image: null,
                imagePreviewUrl: dataUpdate.image,
                has_variant: dataUpdate.has_variant ? 1 : 0,
                variants: mappedVariants,
                is_qty: dataUpdate.is_qty ?? false,
                is_shared_stock: String(dataUpdate.is_shared_stock),
                qrcode: dataUpdate.qrcode ?? ''
            });
        }
    }, [dataUpdate, isOpen]);

    // ==========================================
    // HANDLERS: CROPPER
    // ==========================================
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, targetVariantId: number | null) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageToCrop(reader.result as string);
                setIsCropping(true);
                setIdVariant(targetVariantId);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleApplyCrop = async () => {
        try {
            if (imageToCrop && croppedAreaPixels) {
                const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
                const croppedFile = new File([croppedBlob], "product_image.jpg", { type: 'image/jpeg' });
                const newPreviewUrl = URL.createObjectURL(croppedBlob);

                if (idVariant) {
                    setProductData(prev => {
                        const newVariants = [...prev.variants];
                        const currentVariant = newVariants[idVariant - 1];

                        if (currentVariant.imagePreviewUrl && !currentVariant.imagePreviewUrl.startsWith('http')) {
                            URL.revokeObjectURL(currentVariant.imagePreviewUrl);
                        }

                        newVariants[idVariant - 1] = {
                            ...currentVariant,
                            image: croppedFile,
                            imagePreviewUrl: newPreviewUrl
                        } as Variant;

                        return { ...prev, variants: newVariants };
                    });
                    setIdVariant(null);
                } else {
                    setProductData(prev => {
                        if (prev.imagePreviewUrl && !prev.imagePreviewUrl.startsWith('http')) {
                            URL.revokeObjectURL(prev.imagePreviewUrl);
                        }
                        return {
                            ...prev,
                            image: croppedFile,
                            imagePreviewUrl: newPreviewUrl,
                        };
                    });
                }
                setIsCropping(false);
                setImageToCrop(null);
            }
        } catch (e) {
            // console.error("Gagal memotong gambar:", e);
        }
    };

    // ==========================================
    // HANDLERS: INPUT
    // ==========================================
    const handleProductChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | number | boolean = value;

        // Custom formatting untuk price agar hanya menyimpan angka murni
        if (name === 'price') {
            newValue = value.replace(/[^0-9]/g, "");
        } else if (type === 'number') {
            newValue = value === '' ? '' : Number(value);
        } else if (type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        setProductData(prev => ({ ...prev, [name]: newValue }));

        if (error[name as keyof FormErrors]) {
            setError(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleVariantToggle = (isChecked: boolean) => {
        const newValue = isChecked ? 1 : 0;
        setProductData(prev => ({
            ...prev,
            has_variant: newValue,
            variants: newValue === 1 ? [{ name: '', price: '', image: null, imagePreviewUrl: null, is_package: false }] : []
        }));
        setError(prev => ({ ...prev, is_shared_stock: undefined }));
    };

    const handleVariantChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setProductData(prev => {
            const newVariants = [...prev.variants];
            const currentVariant = newVariants[index];

            // Custom formatting untuk price varian
            if (name === 'price') {
                newVariants[index] = { ...currentVariant, [name]: value.replace(/[^0-9]/g, "") } as Variant;
            } else if (type === 'number') {
                newVariants[index] = { ...currentVariant, [name]: value === '' ? '' : value } as Variant;
            } else if (type === 'checkbox') {
                newVariants[index] = { ...currentVariant, [name]: (e.target as HTMLInputElement).checked } as Variant;
            } else {
                newVariants[index] = { ...currentVariant, [name]: value } as Variant;
            }

            return { ...prev, variants: newVariants };
        });

        if (error.variants && error.variants[index] && error.variants[index][name as keyof { name: string; price: string }]) {
            setError(prev => {
                const newVariantErrors = [...(prev.variants || [])];
                if (newVariantErrors[index]) {
                    newVariantErrors[index] = { ...newVariantErrors[index], [name]: undefined };
                }
                return { ...prev, variants: newVariantErrors };
            });
        }
    };

    const addVariant = () => {
        setProductData(prev => ({
            ...prev,
            variants: [...prev.variants, { name: '', price: '', stock: '', image: null, imagePreviewUrl: null, is_package: false }],
        }));
    };

    const removeVariant = (index: number) => {
        setProductData(prev => {
            const variantToRemove = prev.variants[index];
            if (variantToRemove.imagePreviewUrl && !variantToRemove.imagePreviewUrl.startsWith('http')) {
                URL.revokeObjectURL(variantToRemove.imagePreviewUrl);
            }
            return { ...prev, variants: prev.variants.filter((_, i) => i !== index) };
        });

        const idToRemove = productData.variants[index]?.id;
        if (idToRemove) {
            setDeleteVariants(prev => [...prev, idToRemove]);
        }
    };

    // ==========================================
    // HANDLERS: SUBMIT
    // ==========================================
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Batch Validation
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!productData.name) { newErrors.name = 'Isi nama produk'; hasError = true; }
        if (productData.price === '' || productData.price === null) { newErrors.price = 'Isi harga utama'; hasError = true; }

        if (productData.has_variant === 1) {
            const variantErrors: any[] = [];
            productData.variants.forEach((v, i) => {
                const vErr: any = {};
                if (!v.name) { vErr.name = "Isi nama varian"; hasError = true; }
                variantErrors[i] = Object.keys(vErr).length > 0 ? vErr : null;
            });
            if (variantErrors.some(err => err !== null)) {
                newErrors.variants = variantErrors;
            }
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        // 2. Prepare FormData
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description ?? '');
        if (productData.category) formData.append('product_category_id', String(productData.category));
        formData.append('price', (productData.price === '' ? 0 : productData.price).toString());
        formData.append('has_variant', productData.has_variant.toString());
        formData.append('is_qty', productData.is_qty ? "1" : "0");
        formData.append('qrcode', productData.qrcode ?? '');

        // UPDATE: Dinamis dari form (bukan di-hardcode 1 lagi)
        formData.append('is_shared_stock', productData.is_shared_stock !== undefined ? String(productData.is_shared_stock) : "1");

        if (productData.image) {
            formData.append('image', productData.image, productData.image.name);
        } else if (dataUpdate?.image && !productData.imagePreviewUrl) {
            // INFO: Jika sebelumnya ada gambar (dataUpdate), tapi preview-nya sekarang kosong, kirim sinyal hapus
            formData.append('remove_image', '1');
        }
        if (productData.has_variant === 1) {
            productData.variants.forEach((variant, i) => {
                if (variant.id) formData.append(`variants[${i}][id]`, String(variant.id));
                formData.append(`variants[${i}][name]`, variant.name);

                // Fallback: Jika harga varian kosong, gunakan harga produk utama
                const finalVariantPrice = variant.price ? variant.price : (productData.price || 0);
                formData.append(`variants[${i}][price]`, String(finalVariantPrice));

                formData.append(`variants[${i}][qty_package]`, String(variant.qty_package || 1));
                if (variant.image) {
                    formData.append(`variants[${i}][image]`, variant.image as File);
                }
            });

            deleteVariants.forEach((id, i) => {
                formData.append(`delete_variants[${i}]`, String(id));
            });
        }

        onSubmit(formData, dataUpdate?.id ?? null);
    };

    const handleDeleteImage = () => {
        setProductData(prev => ({
            ...prev,
            image: null,
            imagePreviewUrl: null
        }));
    }

    if (!isOpen) return null;

    const hasVariants = productData.has_variant === 1;
    const isSaveDisabled = hasVariants && productData.variants.length === 0;

    return (
        <>
            {isCropping && imageToCrop ? (
                <div className="inset-0 z-[100] h-[80vh] bg-zinc-900 flex flex-col rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 bg-zinc-800 text-white flex justify-between items-center shadow-md">
                        <span className="flex items-center gap-2 font-bold"><Scissors size={18} /> Potong Gambar</span>
                        <div className="flex gap-2">
                            <button onClick={() => setIsCropping(false)} className="px-4 py-2 text-sm font-semibold bg-zinc-600 hover:bg-zinc-500 rounded-lg transition">Batal</button>
                            <button onClick={handleApplyCrop} className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 rounded-lg flex items-center gap-1 transition">
                                <Check size={16} /> Gunakan
                            </button>
                        </div>
                    </div>
                    <div className="relative flex-1 bg-black">
                        <Cropper
                            image={imageToCrop}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
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
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* INFO PRODUK DASAR */}
                    <section className="space-y-4">
                        <div className="grid grid-cols-1 gap-6">
                            <FormInput
                                label="Nama Produk"
                                type="text"
                                name="name"
                                value={productData.name ?? ''}
                                onChange={handleProductChange}
                                error={error?.name}
                                required
                            />

                            {/* HARGA UTAMA DENGAN FORMAT UANG */}
                            <FormInput
                                label="Harga Utama (Rp)"
                                type="text"
                                name="price"
                                value={formatCurrency(productData.price || '')}
                                onChange={handleProductChange}
                                error={error?.price}
                                required
                            />
                            <FormInput
                                type="autocomplete"
                                label="Kategori"
                                name="category"
                                value={productData.category ?? null}
                                onChange={handleProductChange}
                                options={categories}
                            />

                            {/* GAMBAR UTAMA */}
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="image" className="text-sm font-bold text-slate-700 flex items-center">
                                    <ImageIcon size={18} className="mr-1.5 text-slate-400" /> Gambar Utama
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    onChange={(e) => handleFileChange(e, null)}
                                    className="w-full p-2 border border-slate-300 rounded-xl file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition bg-slate-50 text-sm cursor-pointer"
                                    accept="image/*"
                                />
                                {/* Menggunakan formatImage / custom logic agar string icon dari DB tidak error */}
                                <ImagePreview imageUrl={formatImage(productData.imagePreviewUrl ?? '') ?? ''} fileName={productData.image?.name} handleDeleteImage={handleDeleteImage} />
                                {error?.image && (
                                    <p className="text-xs text-rose-500 font-medium flex items-center mt-1">
                                        <AlertTriangle size={14} className="mr-1" /> {error.image}
                                    </p>
                                )}
                            </div>

                            <FormInput
                                label="Deskripsi"
                                type="wysiwyg"
                                name="description"
                                value={productData.description ?? ''}
                                onChange={handleProductChange}
                            />
                            <FormInput
                                type="switch"
                                label="Aktifkan Fitur Quantity (Hitung Stok)"
                                name="is_qty"
                                value={productData.is_qty}
                                onChange={handleProductChange}
                            />
                        </div>
                    </section>

                    {/* TOGGLE VARIAN & MANAJEMEN STOK */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-700 border-b-2 border-slate-200 pb-2">
                            Opsi Varian
                        </h3>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                            <ToggleSwitch
                                label="Produk ini memiliki varian?"
                                checked={productData.has_variant === 1}
                                onChange={handleVariantToggle}
                            />

                            {/* UPDATE: Manajemen stok varian diaktifkan / di-uncomment */}
                            {productData.has_variant === 1 && (
                                <div className="pt-4 border-t border-slate-200">
                                    <FormInput
                                        type="radio"
                                        label="Sistem Manajemen Stok Varian"
                                        name="is_shared_stock"
                                        value={productData.is_shared_stock ?? null}
                                        onChange={handleProductChange}
                                        options={useParentStock}
                                        required
                                        error={error?.is_shared_stock}
                                        information="Pilih 'Stok Induk' jika semua varian memotong stok dari satu sumber yang sama (misal: jualan kopi, beda level gula tapi kopinya sama). Pilih 'Stok Terpisah' jika tiap varian punya sisa stok barang fisik yang berbeda-beda."
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* LIST VARIAN */}
                    {productData.has_variant === 1 && (
                        <section className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-700">Detail Varian ({productData.variants.length})</h3>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    disabled={productData.variants.length >= 10}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-slate-700 transition disabled:opacity-50"
                                >
                                    <PlusCircle size={16} /> Tambah Varian
                                </button>
                            </div>

                            <div className="space-y-4">
                                {productData.variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        className="p-5 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition"
                                    >
                                        <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                                            <h4 className="font-extrabold text-slate-700">Varian #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="p-2 text-rose-500 bg-rose-50 rounded-lg hover:bg-rose-100 hover:text-rose-700 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-5">
                                            <FormInput
                                                label="Nama Varian"
                                                type="text"
                                                name="name"
                                                value={variant.name}
                                                onChange={(e) => handleVariantChange(index, e)}
                                                error={error?.variants?.[index]?.name}
                                                required
                                            />

                                            {/* HARGA VARIAN DENGAN FORMAT UANG & FALLBACK */}
                                            <FormInput
                                                label="Harga Varian (Rp)"
                                                type="text" // Diubah ke text
                                                name="price"
                                                value={formatCurrency(variant.price || '')}
                                                onChange={(e) => handleVariantChange(index, e)}
                                                error={error?.variants?.[index]?.price}
                                                placeholder={productData.price ? `Ikut harga utama: Rp ${formatCurrency(productData.price)}` : 'Harga sama dengan utama'}
                                                information="Kosongkan kolom ini jika harga varian sama dengan harga utama produk."
                                            />

                                            <FormInput
                                                label="Package Variant"
                                                type="switch"
                                                name="is_package"
                                                value={variant?.is_package}
                                                onChange={(e) => handleVariantChange(index, e)}
                                                information="Aktifkan opsi ini jika varian merupakan harga paket (bundle), misalnya paket isi 5 pcs dengan harga yang lebih murah dari satuan."
                                            />

                                            {variant?.is_package && (
                                                <FormInput
                                                    label="Kuantitas Paket"
                                                    type="number"
                                                    name="qty_package"
                                                    value={variant?.qty_package ?? ''}
                                                    onChange={(e) => handleVariantChange(index, e)}
                                                />
                                            )}

                                            {/* GAMBAR VARIAN */}
                                            <div className="flex flex-col space-y-2 mt-2">
                                                <label htmlFor={`variant-image-${index}`} className="text-sm font-bold text-slate-700 flex items-center">
                                                    <ImageIcon size={16} className="mr-1.5 text-slate-400" /> Gambar Varian (Opsional)
                                                </label>
                                                <input
                                                    id={`variant-image-${index}`}
                                                    type="file"
                                                    name="image"
                                                    onChange={(e) => handleFileChange(e, index + 1)}
                                                    className="w-full p-2 border border-slate-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition text-sm cursor-pointer"
                                                    accept="image/*"
                                                />
                                                <ImagePreview imageUrl={variant.imagePreviewUrl} fileName={variant.image?.name} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    <div className="pt-4 border-t border-slate-200">
                        <ButtonSubmit onClose={onClose} isSubmitting={loading} />
                        {isSaveDisabled && (
                            <p className="text-sm text-rose-500 text-right mt-3 font-semibold flex justify-end items-center gap-1">
                                <AlertTriangle size={16} /> Harap tambahkan minimal satu varian jika fitur varian diaktifkan.
                            </p>
                        )}
                    </div>
                </form>
            )}
        </>
    );
};

export default ServiceFormModalContent;