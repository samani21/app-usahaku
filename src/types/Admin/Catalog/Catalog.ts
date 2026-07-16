import { CategoriesType } from "../CategoriesType";
import { ProductsType } from "../ProductsType";
import { CategoryType } from "./Categories";
import { CatalogHeaderType } from "./Header";
import { HeroType } from "./Hero";
import { ProductType } from "./Products";
import { SummaryType } from "./Summary";

export interface Catalog {
    header: CatalogHeaderType;
    hero: HeroType;
    summary: SummaryType;
    category: CategoryType;
    categories: CategoriesType[];
    product: ProductType;
    products: ProductsType[];
}