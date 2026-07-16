import React from 'react'
import { FrameTheme, FrameType } from './FrameType';
import One from './One';
import Two from './Two';
import Three from './Three';
import Four from './Four';
import Five from './Five';
import Six from './Six';
import Sevent from './Sevent';
import Nine from './Nine';
import Eight from './Eight';
import Ten from './Ten';
import Elevent from './Elevent';
import Twelve from './Twelve';
import Fourteen from './Fourteen';
import Fiveteen from './Fiveteen';
import Thirteen from './Thirteen';

type Props = {
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
}

const HeaderConfig = ({ layout, themeMode, isBuild, logoImage, frameType, frameTheme, toggleTheme, spanOne, spanTwo, displayMode, isConfigHeader = false,
    openScan
}: Props) => {
    const component = {
        themeMode,
        isBuild,
        logoImage,
        frameType,
        frameTheme,
        toggleTheme,
        spanOne,
        spanTwo,
        displayMode,
        isConfigHeader,
        openScan
    }
    switch (layout) {
        case 1:
            return <One {...component} />
        case 2:
            return <Two {...component} />
        case 3:
            return <Three {...component} />
        case 4:
            return <Four {...component} />
        case 5:
            return <Five {...component} />
        case 6:
            return <Six {...component} />
        case 7:
            return <Sevent {...component} />
        case 8:
            return <Eight {...component} />
        case 9:
            return <Nine {...component} />
        case 10:
            return <Ten {...component} />
        case 11:
            return <Elevent {...component} />
        case 12:
            return <Twelve {...component} />
        case 13:
            return <Thirteen {...component} />
        case 14:
            return <Fourteen {...component} />
        case 15:
            return <Fiveteen {...component} />
        default:
            return '';
    }
}

export default HeaderConfig