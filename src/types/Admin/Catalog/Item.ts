import { ProductsType, Variant } from "../ProductsType";
import { ProductType } from "./Products";

export interface OrderItemType {
    id: number;
    order_id: number;
    price: number;
    price_promo: number;
    product_id: number;
    product_name: string;
    iamge_product?: string;
    product_variant_id: number;
    qty: number;
    subtotal: number;
    product?: ProductsType;
    variant?: Variant;
}
