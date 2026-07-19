import { ProductsType, Variants } from "@/types/Admin/ProductsType";
import { formatIDR } from "@/types/FormtRupiah";

export const Promo = (product: ProductsType, variant?: Variants | null) => {
    if (variant) {
        if (variant?.percent_discount) {
            return variant?.percent_discount + "%"
        } else {
            return formatIDR(variant?.discount_price ?? 0);
        }
    } else {
        if (product?.percent_discount) {
            return product?.percent_discount + "%"
        }
        return formatIDR(product?.discount_price ?? 0)
    }
}

export const getPromoDetails = (p: ProductsType) => {
    if (p.percent_discount) {
        const reduction = p.price * (p.percent_discount / 100);
        return {
            finalPrice: p.price - reduction,
            label: `-${p.percent_discount}%`,
            info: `Diskon ${p.percent_discount}%`
        };
    } else if (p.discount_price) {
        return {
            finalPrice: p.price - p.discount_price,
            label: `-${p.discount_price / 1000}K`,
            info: `Potongan ${formatIDR(p.discount_price)}`
        };
    }
    return { finalPrice: p.price, label: null, info: "" };
};
