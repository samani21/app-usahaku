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
import Twelve from './Twelve';
import Elevent from './Elevent';
import Thirteen from './Thirteen';
import Fourteen from './Fourteen';
import Fifteen from './Fifteen';
type Props = {
    theme: number;
    isBuild?: boolean;
    isDarkMode: boolean;
    headline: string;
    subHeadline: string;
    ctaText: string;
    imageHero: string | null
    title: string;
}

const HeroConfig = ({ theme, isBuild, isDarkMode, headline, subHeadline, ctaText, imageHero, title }: Props) => {

    const commonProps = {
        isBuild,
        isDarkMode,
        headline,
        subHeadline,
        ctaText,
        imageHero,
        title
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
            return <Elevent {...commonProps} />
        case 12:
            return <Twelve {...commonProps} />
        case 13:
            return <Thirteen {...commonProps} />
        case 14:
            return <Fourteen {...commonProps} />
        case 15:
            return <Fifteen {...commonProps} />
        default:
            return null;
    }
}

export default HeroConfig