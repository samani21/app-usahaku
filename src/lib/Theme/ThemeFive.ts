import { ThemeType } from "./type";

const primary = '#0D9488';
const header = {
    layout: 1,
    mode: 'auto'
}
const hero = {
    layout: 3,
    mode: 'dark'
}
const category = {
    layout: 3,
    mode: 'light'
}
const product = {
    layout: 12,
    mode: 'light',
}
const summary = {
    layout: 6,
    mode: 'auto',
}
export const ThemeFive: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}