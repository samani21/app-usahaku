import { BusinessType } from "@/types/Admin/BusinessType";

export interface ProductsType {
    discount: number;
    final_price: number;
    image: string;
    id: number;
    name: string;
    price: number;
    promo_type: string | null;
    promo_value: number | null;
}

export interface PromosType {
    id: number;
    name_promo: string;
    products: number[];
}


export interface PostsType {
    id: number;
    business: BusinessType;
    caption: string;
    media: string;
    created_at: string;
    media_type: string;
    is_promo: boolean;
    views: number;
    likes: number;
    comments: number;
    products: ProductsType[]
}