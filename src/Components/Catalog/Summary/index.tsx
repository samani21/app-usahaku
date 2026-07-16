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
import Elevent from './Elevent';
import Twelve from './Twelve';
import ThirTeen from './ThirTeen';
import FourTeen from './FourTeen';
import FiveTeen from './FiveTeen';
import { OutletsType } from '@/types/Admin/OutletType';

type Props = {
    theme: number | null;
    isDarkMode: boolean;
    totalCart: number;
    isBuild?: boolean;
    summary: number;
    selectedOutlet: OutletsType | null
}

const SummaryConfig = ({ theme, isDarkMode, totalCart, summary, isBuild, selectedOutlet }: Props) => {
    const componenst = {
        isDarkMode,
        totalCart,
        summary,
        isBuild,
        selectedOutlet
    }
    switch (theme) {
        case 1:
            return <One {...componenst} />;
        case 2:
            return <Two {...componenst} />;
        case 3:
            return <Three {...componenst} />;
        case 4:
            return <Four {...componenst} />;
        case 5:
            return <Five {...componenst} />;
        case 6:
            return <Six {...componenst} />;
        case 7:
            return <Sevent {...componenst} />;
        case 8:
            return <Eight {...componenst} />;
        case 9:
            return <Nine {...componenst} />;
        case 10:
            return <Ten {...componenst} />;
        case 11:
            return <Elevent {...componenst} />;
        case 12:
            return <Twelve {...componenst} />;
        case 13:
            return <ThirTeen {...componenst} />;
        case 14:
            return <FourTeen {...componenst} />;
        case 15:
            return <FiveTeen {...componenst} />;
        default:
            return null;
    }
}

export default SummaryConfig