import { ThemeType } from "./type";

const primary = '#8B5CF6';
const header = {
    layout: 8,
    mode: 'light'
}
const hero = {
    layout: 14,
    mode: 'light'
}
const category = {
    layout: 5,
    mode: 'light'
}
const product = {
    layout: 15,
    mode: 'auto',
}
const summary = {
    layout: 11,
    mode: 'dark',
}
export const ThemeFour: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}