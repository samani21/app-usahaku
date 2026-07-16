import { OutletsType } from "../OutletType";
import { OrderItemType } from "./Item";

export interface OrderType {
    bank_name: string;
    business_id: number;
    created_at: string;
    customer_name: string;
    device_id: number;
    grand_total: number;
    id: number;
    order_number: string;
    outlet: OutletsType;
    outlet_id: number;
    payment_method: string;
    payment_proof: string;
    payment_status: string;
    phone_number: string;
    qr_token: string;
    qr_order?: string;
    status: string;
    total_price: number;
    unique_code: string;
    slug?: string;
    items: OrderItemType[];
}