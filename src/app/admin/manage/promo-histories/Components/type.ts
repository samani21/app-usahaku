export interface ItemProductVariant {
    id: number;
    name: string;
    price: number;
}

export interface ItemProduct {
    id: number;
    name: string;
    image: string;
    price: number;
    variants: ItemProductVariant[];
}

export interface ProductVariantPromoType {
    cut_value: number;
    final_price: number;
    id: number;
    name: string;
    price: number;
    type: string;
    value: number;
    variant_id: number;
}

export interface ProductPromoType {
    id: number;
    product_id: number;
    cut_value: number;
    final_price: number;
    image: string;
    name: string;
    type: string;
    price: number;
    value: number;
    variants: ProductVariantPromoType[];
}

export interface PromoType {
    end_date: string;
    id: number;
    value: number;
    name_promo: string;
    start_date: string;
    status: boolean;
    target_type: string;
    type: string;
    products: ProductPromoType[];
}