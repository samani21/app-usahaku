import React from 'react';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';
import Six from './Six';
import Eight from './Eight';
import Nine from './Nine';
import Ten from './Ten';
import Eleven from './Eleven';
import Twelve from './Twelve';
import Thirteen from './Thirteen';

import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { formatImage } from '@/utils/formatImage';
import Seven from './Seven';
import Fifteen from './Fifteen';

type Props = {
    theme: number;
    dataProducts: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

// Menggunakan Object Mapping agar jauh lebih rapi daripada Switch Case
const ThemeMap: Record<number, React.FC<any>> = {
    1: One, 2: Two, 3: Three, 4: Four, 5: Five,
    6: Six, 7: Seven, 8: Eight, 9: Nine, 10: Ten,
    11: Eleven, 12: Twelve, 13: Thirteen, 15: Fifteen
};

const ProductConfig = ({ theme, dataProducts, isDarkMode, handleCart }: Props) => {

    // Formatting data dengan aman (mencegah undefined jika dataProducts kosong)
    const products = (dataProducts || []).map((p) => ({
        ...p,
        image: formatImage(p.image) ?? '',
        is_stock: p?.is_stock ? true : false,
        variants: p?.variants?.length > 0 ? p.variants.map((v) => ({
            ...v,
            image: formatImage(v?.image ?? ''),
        })) : []
    }));

    const commonProps = {
        products,
        isDarkMode,
        handleCart,
    };

    // Ambil komponen berdasarkan nomor theme
    const SelectedTheme = ThemeMap[theme];

    // Jika theme tidak ditemukan (misal theme = 99), return null
    if (!SelectedTheme) return null;

    return <SelectedTheme {...commonProps} />;
}

export default ProductConfig;