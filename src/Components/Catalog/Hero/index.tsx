import Eight from './Eight';
import Elevent from './Elevent';
import Fifteen from './Fifteen';
import Five from './Five';
import Four from './Four';
import Fourteen from './Fourteen';
import Nine from './Nine';
import One from './One';
import Sevent from './Sevent';
import Six from './Six';
import Ten from './Ten';
import Thirteen from './Thirteen';
import Three from './Three';
import Twelve from './Twelve';
import Two from './Two';
// ... import lainnya sampai 15

// Buat mapping object komponen
const HeroComponents: Record<number, React.ElementType> = {
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
    15: Fifteen,
};
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
    const commonProps = { isBuild, isDarkMode, headline, subHeadline, ctaText, imageHero, title };

    // Panggil komponen berdasarkan key (theme)
    const SelectedHero = HeroComponents[theme];

    // Render komponen jika ada, jika tidak return null
    return SelectedHero ? <SelectedHero {...commonProps} /> : null;
}

export default HeroConfig;