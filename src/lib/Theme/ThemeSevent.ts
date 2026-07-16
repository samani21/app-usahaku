import { ThemeType } from "./type";

const primary = '#E11D48';
const header = {
    layout: 4,
    mode: 'light'
}
const hero = {
    layout: 9,
    mode: 'dark'
}
const category = {
    layout: 10,
    mode: 'light'
}
const product = {
    layout: 10,
    mode: 'dark',
}
const summary = {
    layout: 5,
    mode: 'auto',
}
export const ThemeSevent: ThemeType = {
    'color': primary,
    'header': header,
    'hero': hero,
    'category': category,
    'product': product,
    'summary': summary,
}