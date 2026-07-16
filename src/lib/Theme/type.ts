export interface LayoutType {
    layout: number;
    mode: string
}
export interface ThemeType {
    color: string;
    header: LayoutType;
    hero: LayoutType;
    category: LayoutType;
    product: LayoutType;
    summary: LayoutType;
}