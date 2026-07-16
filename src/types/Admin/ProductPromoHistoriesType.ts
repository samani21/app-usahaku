import { BusinessType } from "./BusinessType";
import { Variants } from "./ProductsType";

export interface ProductPromoHistoryType {
    id: number;
    business_id: number;
    product_id: number;
    percent: number;
    price: number;
    price_product: number;
    is_global: number;
    status: number;
    name_promo: string;
    type: string;
    start_date?: string,
    end_date?: string,
    created_at: string;
    updated_at: string;
    name_product: string;
    business: BusinessType;
    variants?: Variants[]
  
}