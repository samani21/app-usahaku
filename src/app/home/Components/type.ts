export interface LandingData {
    hero?: Hero;
    feature?: Feature;
    pricing?: Pricing;
    ecommerce?: Ecommerce;
    footer?: Footer;
}

export interface Hero {
    tagline: string;
    headline_1: string;
    headline_2: string;
    description: string;
    cta_text: string;
}

export interface Feature {
    section_title: string;
    section_desc: string;
    items: Items[]
}

export interface Items {
    id: number | string;
    icon: string;
    title: string;
    desc: string;
}

export interface Pricing {
    id: number;
    trial_days: string;
    trial_features: string[];
    original_price: number;
    pro_price: number;
    pro_features: string[];
}

export interface Ecommerce {
    id: number;
    headline_1: string;
    headline_2: string;
    description: string;
    btn_primary: string;
    btn_secondary: string;
}

export interface Footer {
    id: number;
    brand_name: string;
    brand_highlight: string;
    brand_desc: string;
    social_fb: string;
    social_tw: string;
    social_ig: string;
    copyright: string;
    show_fab: boolean;
    fab_text: string;
}