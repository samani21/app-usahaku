import React, { Dispatch, SetStateAction } from 'react'
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './FIve';
import Six from './Six';
import Sevent from './Sevent';
import Eight from './Eight';
import Nine from './Nine';
import Teen from './Teen';
import Elevent from './Elevent';
import Twelve from './Twelve';
import Thirteen from './Thirteen';
import FourTen from './FourTen';
import Fiften from './Fifteen';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { formatImage } from '@/utils/formatImage';

type Props = {
    theme: number;
    dataCategories: CategoriesType[];
    isDarkMode: boolean;
    onClick?: (v: string | null) => void;
}

const CategorieConfig = ({ theme, dataCategories, isDarkMode, onClick }: Props) => {
    const categories = dataCategories?.map((c) => {
        return {
            ...c,
            icon: c?.icon?.startsWith("usahaku")
                ? formatImage(c.icon)
                : c?.icon,
        };
    });
    const commonProps = {
        categories,
        isDarkMode,
        onClick
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
            return <Teen {...commonProps} />
        case 11:
            return <Elevent {...commonProps} />
        case 12:
            return <Twelve {...commonProps} />
        case 13:
            return <Thirteen {...commonProps} />
        case 14:
            return <FourTen {...commonProps} />
        case 15:
            return <Fiften {...commonProps} />
        default:
            return null;
    }
}

export default CategorieConfig