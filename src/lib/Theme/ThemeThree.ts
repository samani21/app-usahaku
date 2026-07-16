import { ThemeType } from "./type";

const primary = '#9F1239';
const header = {
    layout: 11,
    mode: 'light'
}
const hero = {
    layout: 4,
    mode: 'dark'
}
const category = {
    layout: 14,
    mode: 'light'
}
const product = {
    layout: 5,
    mode: 'light',
}
const summary = {
    layout: 8,
    mode: 'auto',
}
export const ThemeThree: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}