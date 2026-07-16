import { ThemeType } from "./type";

const primary = '#F472B6';
const header = {
    layout: 7,
    mode: 'dark'
}
const hero = {
    layout: 10,
    mode: 'dark'
}
const category = {
    layout: 8,
    mode: 'light'
}
const product = {
    layout: 11,
    mode: 'auto',
}
const summary = {
    layout: 14,
    mode: 'dark',
}
export const ThemeTwo: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}