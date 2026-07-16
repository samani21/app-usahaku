import { LayoutType, ThemeType } from "./type";

const primary = '#2563EB';
const header = {
    layout: 3,
    mode: 'dark'
}
const hero = {
    layout: 13,
    mode: 'light'
}
const category = {
    layout: 13,
    mode: 'dark'
}
const product = {
    layout: 1,
    mode: 'auto',
}
const summary = {
    layout: 7,
    mode: 'dark',
}
export const ThemeOne: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}