import { ThemeType } from "./type";

const primary = '#00F0FF';
const header = {
    layout: 4,
    mode: 'dark'
}
const hero = {
    layout: 5,
    mode: 'dark'
}
const category = {
    layout: 6,
    mode: 'auto'
}
const product = {
    layout: 7,
    mode: 'dark',
}
const summary = {
    layout: 10,
    mode: 'light',
}
export const ThemeSix: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}