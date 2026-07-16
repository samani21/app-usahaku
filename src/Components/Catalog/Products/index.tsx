import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';
import Six from './Six';
import Sevent from './Sevent';
import Eight from './Eight';
import Nine from './Nine';
import Ten from './Ten';
import Eleven from './Eleven';
import Twelve from './Twelve';
import Thirteen from './Thirteen';
import Fourteen from './FourTeen';
import Fiveteen from './Fiveteen';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { OutletsType } from '@/types/Admin/OutletType';
import { formatImage } from '@/utils/formatImage';
type Props = {
    theme: number;
    dataProducts: ProductsType[];
    isDarkMode: boolean;
    handleCart?: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

const ProductConfig = ({ theme, dataProducts, isDarkMode, handleCart }: Props) => {
    const products = dataProducts?.map((p) => {
        return {
            ...p,
            image: formatImage(p.image) ?? '',
            variants: p?.variants?.length > 0 ? p?.variants?.map((v) => {
                return {
                    ...v,
                    image: formatImage(v?.image ?? '')
                }
            }) : []
        };
    });
    const commonProps = {
        products,
        isDarkMode,
        handleCart,
    };

    /* ===================== Numeric Theme ===================== */
    switch (theme) {
        case 1:
            return <One {...commonProps} />
        case 2:
            return <Two {...commonProps} />
        case 3:
            return <Three {...commonProps} />
        case 4:
            return <Four {...commonProps} />
        case 5:
            return <Five {...commonProps} />
        case 6:
            return <Six {...commonProps} />
        case 7:
            return <Sevent {...commonProps} />
        case 8:
            return <Eight {...commonProps} />
        case 9:
            return <Nine {...commonProps} />
        case 10:
            return <Ten {...commonProps} />
        case 11:
            return <Eleven {...commonProps} />
        case 12:
            return <Twelve {...commonProps} />
        case 13:
            return <Thirteen {...commonProps} />
        case 14:
            return <Fourteen {...commonProps} />
        case 15:
            return <Fiveteen {...commonProps} />
        default:
            return null;
    }
}

export default ProductConfig