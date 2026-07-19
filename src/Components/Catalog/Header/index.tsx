import React from 'react';
import { FrameTheme, FrameType } from './FrameType';

// Import all layout components
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
import Thirteen from './Thirteen';
import Fourteen from './Fourteen';
import Fiveteen from './Fiveteen';

export type HeaderProps = {
    layout: number;
    themeMode: string;
    isBuild?: boolean;
    logoImage: string | null;
    frameType: FrameType;
    frameTheme: FrameTheme;
    toggleTheme: () => void;
    spanOne?: string;
    spanTwo?: string;
    displayMode: string;
    isConfigHeader?: boolean;
    openScan: () => void;
};

// Object Mapping untuk layout (Menggantikan Switch-Case yang panjang)
const layoutMap: Record<number, React.ElementType> = {
    1: One,
    2: Two,
    3: Three,
    4: Four,
    5: Five,
    6: Six,
    7: Sevent,
    8: Eight,
    9: Nine,
    10: Ten,
    11: Elevent,
    12: Twelve,
    13: Thirteen,
    14: Fourteen,
    15: Fiveteen,
};

const HeaderConfig = ({ layout, ...props }: HeaderProps) => {
    // Ambil komponen berdasarkan nomor layout
    const SelectedHeader = layoutMap[layout];

    // Jika layout tidak ditemukan (default case), return null sesuai standar React
    if (!SelectedHeader) return null;

    // Render komponen terpilih dan passing semua props yang tersisa
    return <SelectedHeader {...props} />;
};

export default HeaderConfig;