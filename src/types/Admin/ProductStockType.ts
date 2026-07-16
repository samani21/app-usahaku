export interface ProductStockType {
    id: number;
    business_id: number;
    product_id: number;
    product_variant_id?: number;
    stock: number;
    name_product: string;
    name_outlet: string;
    date: string;
    name_variant: string;
    reference_type?: string;
    note?: string;
}