"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Catalog } from '@/types/Admin/Catalog/Catalog';
import { Get } from '@/utils/Get';
import { ArrowLeft, Eye, Navigation, X } from 'lucide-react';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import Loading from '@/Components/Loading';
import HeroConfig from '@/Components/Catalog/Hero';
import CategorieConfig from '@/Components/Catalog/Categories';
import ProductConfig from '@/Components/Catalog/Products';
import SummaryConfig from '@/Components/Catalog/Summary';
import HeaderConfig from '@/Components/Catalog/Header';
import { useRouter } from 'next/navigation';
import { formatImage } from '@/utils/formatImage';
import { useCorrectPath } from '@/utils/useCorrectPath';

// Helpers
const getContrastColor = (hex: string | undefined) => {
    if (!hex) return '#1e293b';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#1e293b' : '#ffffff';
};

const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

type Props = {
};

type CartState = {
    item: number;
    amount: number;
};

export default function PreviewView({ }: Props) {
    // State
    const route = useRouter()
    const [loading, setLoading] = useState<boolean>(true);
    const [catalogData, setCatalogData] = useState<Catalog | null>(null);
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<CartState>({ item: 0, amount: 0 });
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const { getCorrectPath } = useCorrectPath()
    // CSS Variables Updater
    const updateCssVariables = useCallback((type: 'header' | 'hero' | 'category' | 'product' | 'summary', color: string) => {
        // Mencegah error SSR di Next.js saat mengakses document
        if (typeof document === 'undefined') return;

        const contrast = getContrastColor(color);
        const rgb = hexToRgb(color);
        const contrastRgb = hexToRgb(contrast);

        const root = document.documentElement;
        root.style.setProperty(`--${type}-primary-color`, color);
        root.style.setProperty(`--${type}-secondary-color`, contrast);
        root.style.setProperty(`--${type}-primary-rgb`, rgb);
        root.style.setProperty(`--${type}-secondary-rgb`, contrastRgb);
    }, []);

    // Fetch Data
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                setLoading(true);
                const res = await Get<{ success: boolean; data: Catalog }>('/catalog');

                if (res?.success && res.data) {
                    const data = res.data;
                    setCatalogData(data);
                    setIsDarkTheme(data.header?.mode === 'dark');

                    // Update CSS variables if colors exist
                    if (data.header?.color) updateCssVariables('header', data.header.color);
                    if (data.hero?.color) updateCssVariables('hero', data.hero.color);
                    if (data.category?.color) updateCssVariables('category', data.category.color);
                    if (data.product?.color) updateCssVariables('product', data.product.color);
                    if (data.summary?.color) updateCssVariables('summary', data.summary.color);
                }
            } catch (error) {
                // console.error("Failed to fetch catalog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCatalog();
    }, [updateCssVariables]);

    // Derived State (Destructuring untuk akses lebih mudah dan bersih)
    const { header, hero, category, categories, product: productConfig, summary } = catalogData || {};

    const filteredProducts = useMemo(() => {
        if (!catalogData?.products) return [];
        if (selectedCategory) {
            return catalogData.products.filter((p) => p?.category === selectedCategory);
        }
        return catalogData.products;
    }, [catalogData, selectedCategory]);

    // Handlers
    const handleCart = (p: ProductsType | null, v: Variants | null, qty: number) => {
        const amount = v ? v.final_price : p?.final_price;
        setCart((prev) => ({
            item: prev.item + qty,
            amount: prev.amount + (qty * (amount ?? 0)),
        }));
        triggerToast(`✓ Berhasil ditambah ke keranjang  ${p?.name} ${v ? `(${v?.name})` : ''}`)
    };
    const triggerToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 4000);
    };
    // Render
    if (loading) return <Loading title='Sedang memuat halaman' />;

    const isDarkModeActive = isDarkTheme || header?.mode === 'dark';

    return (
        <div className={`flex flex-col items-center justify-center ${isDarkTheme ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className='max-w-7xl w-full space-y-6 relative'>

                {/* Header Section */}
                <div className='fixed z-40 w-full max-w-7xl'>
                    {header && (
                        <HeaderConfig
                            layout={header.layout_header}
                            themeMode={isDarkModeActive ? "dark" : "light"}
                            logoImage={formatImage(header.logo) ?? ''}
                            frameType={header.type_frame}
                            frameTheme={header.color_frame}
                            toggleTheme={() => setIsDarkTheme(!isDarkTheme)}
                            spanOne={header.span_one}
                            spanTwo={header.span_two}
                            displayMode={header.mode}
                            isBuild={true}
                            openScan={() => { }}
                        />
                    )}
                </div>

                {/* Main Content */}
                <div className={`mt-12 space-y-6 pt-20 pb-18 px-2`}>

                    {/* Preview Banner */}
                    <div className="animate-in fade-in slide-in-from-top duration-500 mt-4 max-w-7xl mx-auto">
                        <div className="bg-white/80 backdrop-blur-md border border-blue-100 shadow-lg rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-blue-200 shadow-lg">
                                    <Eye size={22} />
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-semibold text-sm md:text-base">
                                        Mode Pratinjau Aktif
                                    </h3>
                                    <p className="text-gray-500 text-xs md:text-sm">
                                        Ini hanya tampilan sementara. Klik tombol untuk kembali ke editor.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => route?.push(getCorrectPath('/catalog'))}
                                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-all active:scale-95 shadow-md"
                                >
                                    <ArrowLeft size={18} />
                                    Kembali
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Hero Section */}
                    {hero && (
                        <div className={`${(hero.mode !== "light" && isDarkTheme) || hero.mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <HeroConfig
                                theme={hero.layout_hero}
                                isDarkMode={hero.mode === 'light' ? false : isDarkTheme || hero.mode === 'dark'}
                                headline={hero.headline}
                                subHeadline={hero.sub_headline}
                                ctaText={hero.cta}
                                imageHero={formatImage(hero.image) ?? null}
                                title={hero.title}
                            />
                        </div>
                    )}

                    {/* Categories Section */}
                    {categories && category && (
                        <CategorieConfig
                            theme={category.layout_categories}
                            dataCategories={categories}
                            isDarkMode={category.mode === 'light' ? false : isDarkTheme || category.mode === 'dark'}
                            onClick={setSelectedCategory}
                        />
                    )}

                    {/* Products Section */}
                    {productConfig && filteredProducts.length > 0 && (
                        <div id='product-section' className={`${(productConfig.mode !== "light" && isDarkTheme) || productConfig.mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            <ProductConfig
                                theme={productConfig.layout_products}
                                dataProducts={filteredProducts}
                                isDarkMode={productConfig.mode === 'light' ? false : isDarkTheme || productConfig.mode === 'dark'}
                                handleCart={handleCart}
                            />
                        </div>
                    )}

                    {/* Summary / Cart Section */}
                    <div className='fixed z-50 bottom-0 w-full flex items-center justify-center left-0'>
                        <div className='max-w-7xl w-full'>
                            {summary && cart.item > 0 && (
                                <SummaryConfig
                                    theme={summary.layout_summary}
                                    isDarkMode={summary.mode === 'light' ? false : isDarkTheme || category?.mode === 'dark'}
                                    totalCart={cart.item}
                                    summary={cart.amount}
                                    isBuild={true}
                                    selectedOutlet={null}
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>
            {toastMessage && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[101] w-[calc(100%-2rem)] sm:w-max max-w-md bg-zinc-900/95 backdrop-blur-sm text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-4 animate-fade-in border border-zinc-800 transition-all hover:bg-zinc-900">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-xl text-zinc-200 shrink-0">
                            <Navigation className="w-4 h-4 animate-bounce" />
                        </div>
                        <span className="text-sm font-medium leading-snug">{toastMessage}</span>
                    </div>
                    <button
                        onClick={() => setToastMessage(null)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}