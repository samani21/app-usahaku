import React from 'react';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';
import Six from './Six';
import Seven from './Seven';
import Eight from './Eight';
import Nine from './Nine';
import Ten from './Ten';
import Eleven from './Eleven';
import Twelve from './Twelve';
import Thirteen from './Thirteen';
import Fifteen from './Fifteen';

import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatImage } from '@/utils/formatImage';
import FourTen from './FourTen';

type Props = {
    theme: number;
    dataProducts: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

// Buat tipe untuk props yang akan diteruskan ke komponen tema
type ThemeComponentProps = Omit<Props, 'theme' | 'dataProducts'> & {
    products: any[]; // Bisa diganti dengan tipe array hasil mapping jika ada
};

// Ganti <any> dengan tipe props yang spesifik
const ThemeMap: Record<number, React.FC<ThemeComponentProps>> = {
    1: One, 2: Two, 3: Three, 4: Four, 5: Five,
    6: Six, 7: Seven, 8: Eight, 9: Nine, 10: Ten,
    11: Eleven, 12: Twelve, 13: Thirteen, 14: FourTen, 15: Fifteen
};

const ProductConfig = ({ theme, dataProducts, isDarkMode, handleCart }: Props) => {

    const products = (dataProducts || []).map((p) => ({
        ...p,
        image: formatImage(p.image) ?? '',
        is_stock: !!p?.is_stock,

        // PERBAIKAN: Menghindari error "undefined > 0" di TypeScript Vercel
        variants: p.variants && p.variants.length > 0
            ? p.variants.map((v) => ({
                ...v,
                image: formatImage(v?.image ?? ''),
            }))
            : []
    }));

    const commonProps = {
        products,
        isDarkMode,
        handleCart,
    };

    const SelectedTheme = ThemeMap[theme];

    if (!SelectedTheme) return null;

    return <SelectedTheme {...commonProps} />;
}

export default ProductConfig;