import dynamic from 'next/dynamic';
import { OutletsType } from '@/types/Admin/OutletType';

// SOP 3: Lazy Loading (Dynamic Import) - Membasmi loading lambat!
// Hanya layout yang dipilih yang akan di-download oleh browser user.
const Layouts: Record<number, any> = {
    1: dynamic(() => import('./One')),
    2: dynamic(() => import('./Two')),
    3: dynamic(() => import('./Three')),
    4: dynamic(() => import('./Four')),
    5: dynamic(() => import('./Five')),
    6: dynamic(() => import('./Six')),
    7: dynamic(() => import('./Sevent')),
    8: dynamic(() => import('./Eight')),
    9: dynamic(() => import('./Nine')),
    10: dynamic(() => import('./Ten')),
    11: dynamic(() => import('./Elevent')),
    12: dynamic(() => import('./Twelve')),
    13: dynamic(() => import('./ThirTeen')),
    14: dynamic(() => import('./FourTeen')),
    15: dynamic(() => import('./FiveTeen')),
};

type Props = {
    theme: number | null;
    isDarkMode: boolean;
    totalCart: number;
    isBuild?: boolean;
    summary: number;
    selectedOutlet: OutletsType | null;
};

const SummaryConfig = (props: Props) => {
    // SOP 4: Fallback jika theme tidak valid atau null
    if (!props.theme || !Layouts[props.theme]) return null;

    const Component = Layouts[props.theme];
    return <Component {...props} />;
};

export default SummaryConfig;