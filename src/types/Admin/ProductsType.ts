import { ChangeEvent } from "react";

export interface Variant {
    name: string;
    price: string | number; // String untuk input yang kosong/diketik, Number untuk konversi akhir
    stock?: string | number; // String untuk input yang kosong/diketik, Number untuk konversi akhir
    image: File | null;
    imagePreviewUrl: string | null;
    id?: number;
    qty_package?: number;
    is_package: boolean;
}

/** Tipe untuk State Formulir Produk */
export interface ProductForm {
    name: string;
    description?: string;
    price: string | number;
    stock?: string | number;
    image: File | null;
    imagePreviewUrl: string | null;
    has_variant: 0 | 1; // 0 (Tidak) atau 1 (Ya)
    variants: Variant[];
    category?: number | null
    is_qty: boolean;
    is_shared_stock: string;
    qrcode: string;
}

/** Tipe untuk Objek Error Validasi */
export interface VariantErrors {
    name: string;
    price: string;
    stock?: string;
}

export interface Errors {
    name: string;
    price: string;
    stock?: string;
    variants: VariantErrors[];
}

// --- STATE AWAL ---

export const initialProductState: ProductForm = {
    name: '',
    price: '',
    image: null,
    imagePreviewUrl: null,
    has_variant: 0,
    variants: [],
    is_qty: true,
    is_shared_stock: '',
    qrcode: '',
};

export const initialErrors: Errors = {
    name: '',
    price: '',
    variants: [],
};

export interface Variants {
    image?: string,
    name: string,
    id: number,
    product_id: number,
    stock?: number,
    price: number,
    discount_price?: number,
    percent_discount?: number,
    final_price: number,
    customValue?: string,
    product_variant_stock?: number,
    is_package: boolean;
    qty_package: number;
    pivot?: {
        percent: number;
        price: number;
    }
}

export interface Services {
    id: number,
    product_id: number,
    title: string,
}

export interface ProductsType {
    id: number,
    promo_id?: number,
    name_promo?: string,
    type?: string,
    start_date?: string,
    end_date?: string,
    is_global?: boolean,
    product_category_id?: number,
    name: string,
    description: string,
    slug: string,
    image: string,
    color_icon?: string,
    qrcode: string,
    slug_business?: string,
    has_variant: boolean,
    is_active: boolean,
    is_stock: boolean,
    price: number,
    stock?: number,
    distance?: number,
    variants: Variants[]
    discount_price?: number,
    percent_discount?: number,
    final_price?: number,
    is_recomended?: boolean
    title_recomended?: string,
    color_recomended?: string,
    category?: string,
    is_quantity?: boolean,
    is_service?: boolean,
    is_shared_stock: boolean
    is_qty?: boolean,
    service?: Services[]
    product_stock?: number,
}