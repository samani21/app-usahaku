'use client'
import React, { useState, useEffect, SetStateAction, Dispatch } from 'react';
import { Home, Utensils, Cpu, Sparkles, HeartPulse, Shirt, Coffee, GraduationCap, Pipette, CircleCheckBigIcon, Circle, Sun, Moon, Check, SunMoon, CheckCircleIcon } from 'lucide-react';
import { ProductsType, Variants } from '@/types/Admin/ProductsType';
import { Post } from '@/utils/Post';
import { AlertType } from '@/types/Alert';
import { ProductType } from '@/types/Admin/Catalog/Products';
import ProductConfig from '@/Components/Catalog/Products';
import Alert from '@/Components/Alert';
import Loading from '@/Components/Loading';

const BUSINESS_THEMES = [
    { id: 'property', name: 'Properti (Minimalis)', description: 'Kesan bersih, luas, dan kokoh.', hex: '#94A3B8', icon: <Home size={18} /> },
    { id: 'fnb', name: 'F&B (Energi)', description: 'Menggugah selera dan hangat.', hex: '#F59E0B', icon: <Utensils size={18} /> },
    { id: 'tech', name: 'Tech (Modern)', description: 'Inovatif dan futuristik.', hex: '#3B82F6', icon: <Cpu size={18} /> },
    { id: 'luxury', name: 'Luxury (Premium)', description: 'Eksklusif dan elegan.', hex: '#111827', icon: <Sparkles size={18} /> },
    { id: 'medical', name: 'Kesehatan (Trust)', description: 'Steril, tenang, dan terpercaya.', hex: '#0D9488', icon: <HeartPulse size={18} /> },
    { id: 'fashion', name: 'Fashion (Trendy)', description: 'Ekspresif dan penuh gaya.', hex: '#DB2777', icon: <Shirt size={18} /> },
    { id: 'coffee', name: 'Coffee (Cozy)', description: 'Nyaman, hangat, dan santai.', hex: '#78350F', icon: <Coffee size={18} /> },
    { id: 'education', name: 'Pendidikan (Edu)', description: 'Fokus, cerdas, dan profesional.', hex: '#4F46E5', icon: <GraduationCap size={18} /> }
];

const listProduct = [
    { id: 1, name: "Classic" }, { id: 2, name: "Minimalist" }, { id: 3, name: "Floating Bubble" },
    { id: 4, name: "Horizontal Stripes" }, { id: 5, name: "Polaroid" }, { id: 6, name: "Retro Hardware" },
    { id: 7, name: "Cyberpunk HUD" }, { id: 8, name: "Bento Bento" }, { id: 9, name: "Horizontal Split" },
    { id: 10, name: "Brutalist List" }, { id: 11, name: "Soft Gradient" }, { id: 12, name: "Floating Stack" },
    { id: 13, name: "Luxury Boutique" }, { id: 14, name: "Ticket Stub" }, { id: 15, name: "Circle Focus" },
];

type Props = {
    productData: ProductType | null;
    productsData: ProductsType[];
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    getCalog: () => void;
    handleCart: (p: ProductsType | null, v: Variants | null, qty: number) => void;
}

export default function ProductView({ productData, productsData, isDarkMode, setIsDarkMode, getCalog, handleCart }: Props) {
    const [selectedColor, setSelectedColor] = useState(BUSINESS_THEMES[0].hex);
    const [activeTab, setActiveTab] = useState(BUSINESS_THEMES[0].id);
    const [productLayout, setProductLayout] = useState<number | undefined>();
    const [displayMode, setDisplayMode] = useState('auto');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductsType[]>([]);

    useEffect(() => {
        if (productData) {
            if (productData.layout_products) setProductLayout(productData.layout_products);
            if (productData.color) setSelectedColor(productData.color);
            if (productData.mode) {
                setDisplayMode(productData.mode);
                setIsDarkMode(productData.mode === 'dark');
            }
        }
        if (productsData) {
            setProducts(productsData);
        }
    }, [productData, productsData, setIsDarkMode]);

    const getContrastColor = (hex: string) => {
        if (!hex || hex.length < 7) return '#1e293b';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#1e293b' : '#ffffff';
    };

    const currentTextColor = getContrastColor(selectedColor);

    useEffect(() => {
        if (!selectedColor || selectedColor.length < 7) return;

        document.documentElement.style.setProperty('--product-primary-color', selectedColor);
        document.documentElement.style.setProperty('--product-secondary-color', currentTextColor);

        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--product-primary-rgb', `${r}, ${g}, ${b}`);

        const tr = parseInt(currentTextColor.slice(1, 3), 16);
        const tg = parseInt(currentTextColor.slice(3, 5), 16);
        const tb = parseInt(currentTextColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--product-secondary-rgb', `${tr}, ${tg}, ${tb}`);
    }, [selectedColor, currentTextColor]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!productLayout) {
                setLoading(false);
                setShowAlert({ isOpen: true, type: 'error', message: "Harap pilih salah satu layout produk di bawah" });
                return;
            }

            const formData = new FormData();
            formData.append('layout_products', String(productLayout));
            formData.append('color', selectedColor);
            formData.append('mode', displayMode);

            const res = await Post('client/catalog/product', formData);
            if (res) {
                setLoading(false);
                getCalog();
                setShowAlert({ isOpen: true, type: 'success', message: "Pengaturan produk berhasil disimpan" });
            }
        } catch (e: any) {
            setLoading(false);
            setShowAlert({ isOpen: true, type: 'error', message: "Pengaturan produk gagal disimpan" });
        }
    }

    return (
        <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'} rounded-b-xl min-h-screen font-sans`}>
            <div className="space-y-6">

                {/* Bagian Tema & Kustomisasi */}
                <div className="space-y-6 w-full px-4 pt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Pilih Tema Bisnis</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar rounded-xl">
                            {BUSINESS_THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        setSelectedColor(theme.hex);
                                        setActiveTab(theme.id);
                                    }}
                                    className={`w-64 shrink-0 flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${activeTab === theme.id
                                        ? 'border-indigo-600 bg-white shadow-md'
                                        : isDarkMode ? 'border-transparent bg-slate-800 hover:bg-slate-700' : 'border-transparent bg-slate-100 hover:bg-slate-200'
                                        }`}
                                >
                                    <div className="p-2.5 rounded-xl text-white shrink-0 shadow-sm" style={{ backgroundColor: theme.hex }}>
                                        {theme.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold text-sm ${isDarkMode && activeTab !== theme.id ? 'text-white' : 'text-slate-900'}`}>{theme.name}</div>
                                        <div className="text-xs text-slate-500 leading-tight truncate">{theme.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`p-5 md:p-7 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border space-y-6 transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className="space-y-3">
                            <div className={`flex items-center gap-2 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                <Pipette size={18} className="text-emerald-500" />
                                <span>Kustomisasi Warna Sendiri</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                    <input
                                        type="color"
                                        value={selectedColor}
                                        onChange={(e) => {
                                            setSelectedColor(e.target.value);
                                            setActiveTab('custom');
                                        }}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                    />
                                    <div
                                        className="h-12 w-12 rounded-xl shadow-inner border border-black/10 transition-transform hover:scale-105"
                                        style={{ backgroundColor: selectedColor }}
                                    />
                                </div>
                                <div className={`flex-1 px-4 py-3 rounded-xl border font-mono text-sm tracking-wide shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                    {selectedColor?.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <hr className={isDarkMode ? 'border-slate-700' : 'border-slate-100'} />

                        <div className="flex flex-col md:flex-row md:items-end gap-5 w-full">
                            <div className="space-y-2 flex-1 w-full">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mode Tampilan Aplikasi</label>
                                <div className={`grid grid-cols-3 gap-1 p-1.5 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                    <button
                                        onClick={() => { setDisplayMode('light'); setIsDarkMode(false); }}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:bg-slate-500/10'
                                            }`}
                                    >
                                        <Sun size={15} /> Light
                                    </button>
                                    <button
                                        onClick={() => { setDisplayMode('dark'); setIsDarkMode(true); }}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'dark' ? 'bg-slate-700 text-emerald-400 shadow-sm' : 'text-slate-500 hover:bg-slate-500/10'
                                            }`}
                                    >
                                        <Moon size={15} /> Dark
                                    </button>
                                    <button
                                        onClick={() => { setDisplayMode('auto'); setIsDarkMode(false); }}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'auto' ? (isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-slate-800 shadow-sm') : 'text-slate-500 hover:bg-slate-500/10'
                                            }`}
                                    >
                                        <SunMoon size={15} /> Auto
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Check className="w-5 h-5" /> Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bagian Layout Picker & Preview */}
                <div className="space-y-4 px-4 pb-8">
                    <div className={`p-4 md:p-5 rounded-3xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}>
                        <label className={`text-xs font-bold uppercase tracking-wider ml-1 mb-3 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pilih Layout Katalog
                        </label>
                        <div className="flex overflow-x-auto w-full gap-3 pb-2 no-scrollbar">
                            {listProduct?.map((lc, i) => (
                                <button
                                    key={i}
                                    onClick={() => setProductLayout(lc.id)}
                                    className={`whitespace-nowrap text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 border ${lc.id === productLayout
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                        : isDarkMode
                                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {lc.id === productLayout ? (
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <Circle className="w-4 h-4 opacity-50" />
                                    )}
                                    <span>{lc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`${isDarkMode ? "bg-slate-800" : "bg-slate-200"} h-[2px] w-full rounded-full my-6 opacity-50`} />

                    {/* Preview Area (Menampilkan Layout yang sedang di-klik/pilih) */}
                    {productLayout && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                <label className="text-sm font-bold uppercase tracking-widest text-emerald-500 block">
                                    Preview Layout Terpilih: {listProduct.find(p => p.id === productLayout)?.name}
                                </label>
                            </div>

                            <div className={`p-4 rounded-3xl border-2 border-emerald-500/20 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                <div className='hidden md:block'>
                                    <ProductConfig
                                        theme={productLayout}
                                        dataProducts={products?.slice(0, 4) ?? []}
                                        isDarkMode={isDarkMode}
                                        handleCart={handleCart}
                                    />
                                </div>
                                <div className='md:hidden'>
                                    <ProductConfig
                                        theme={productLayout}
                                        dataProducts={products?.slice(0, 2) ?? []}
                                        isDarkMode={isDarkMode}
                                        handleCart={handleCart}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* List Preview Semua Layout */}
                    <div className="mt-12 space-y-8">
                        <label className={`text-xs font-bold uppercase tracking-wider block text-center mb-6 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            --- Referensi Semua Layout ---
                        </label>
                        {listProduct?.map((lh, i) => (
                            <div className={`relative space-y-4 p-4 rounded-3xl border transition-all ${productLayout === lh.id ? 'border-emerald-500/50 shadow-lg' : isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`} key={i}>
                                <div
                                    className='flex items-center gap-2 cursor-pointer w-fit'
                                    onClick={() => setProductLayout(lh.id)}
                                >
                                    {productLayout === lh.id ? <CircleCheckBigIcon className="text-emerald-500" size={18} /> : <Circle className="text-slate-400" size={18} />}
                                    <label className={`text-xs font-bold uppercase tracking-[0.2em] cursor-pointer ${productLayout === lh.id ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        Layout {lh.id}: {lh.name}
                                    </label>
                                </div>

                                {/* FIX: Menghapus opacity-80 dan hover:opacity-100 */}
                                <div className='hidden md:block'>
                                    <ProductConfig theme={lh.id} dataProducts={products?.slice(0, 4) ?? []} isDarkMode={isDarkMode} handleCart={handleCart} />
                                </div>
                                <div className='md:hidden'>
                                    <ProductConfig theme={lh.id} dataProducts={products?.slice(0, 2) ?? []} isDarkMode={isDarkMode} handleCart={handleCart} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showAlert?.isOpen && (
                <Alert type={showAlert.type} message={showAlert.message} onClose={() => setShowAlert(null)} />
            )}
            {loading && <Loading title='Sedang Proses' />}
        </div>
    );
}