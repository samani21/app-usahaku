'use client'
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Palette, Home, Utensils, Cpu, Sparkles, Pipette, HeartPulse, Shirt, Coffee, GraduationCap, Upload, CircleCheckBigIcon, Circle, Sun, Moon, Check, SunMoon, CheckCircleIcon } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Catalog } from '@/types/Admin/Catalog/Catalog';
import { AlertType } from '@/types/Alert';
import { Post } from '@/utils/Post';
import { CategoryType } from '@/types/Admin/Catalog/Categories';
import CategorieConfig from '@/Components/Catalog/Categories';
import Alert from '@/Components/Alert';
import Loading from '@/Components/Loading';

const BUSINESS_THEMES = [
    { id: 'property', name: 'Properti (Minimalis)', description: 'Kesan bersih, luas, & kokoh.', hex: '#94A3B8', icon: <Home size={18} /> },
    { id: 'fnb', name: 'F&B (Energi)', description: 'Menggugah selera & hangat.', hex: '#F59E0B', icon: <Utensils size={18} /> },
    { id: 'tech', name: 'Tech (Modern)', description: 'Inovatif dan futuristik.', hex: '#3B82F6', icon: <Cpu size={18} /> },
    { id: 'luxury', name: 'Luxury (Premium)', description: 'Eksklusif dan elegan.', hex: '#111827', icon: <Sparkles size={18} /> },
    { id: 'medical', name: 'Kesehatan (Trust)', description: 'Steril, tenang, & terpercaya.', hex: '#0D9488', icon: <HeartPulse size={18} /> },
    { id: 'fashion', name: 'Fashion (Trendy)', description: 'Ekspresif dan penuh gaya.', hex: '#DB2777', icon: <Shirt size={18} /> },
    { id: 'coffee', name: 'Coffee (Cozy)', description: 'Nyaman, hangat, & santai.', hex: '#78350F', icon: <Coffee size={18} /> },
    { id: 'education', name: 'Pendidikan (Edu)', description: 'Fokus, cerdas, & profesional.', hex: '#4F46E5', icon: <GraduationCap size={18} /> }
];

const listCategorie = [
    { id: 1, name: "Modern Bento Grid" },
    { id: 2, name: "Minimalist Circles" },
    { id: 3, name: "Floating Glass Cards" },
    { id: 4, name: "Horizontal Stripes" },
    { id: 5, name: "Interactive Pills" },
    { id: 6, name: "Duotone Image Grid" },
    { id: 7, name: "Numbered Sophistication" },
    { id: 8, name: "Soft Neumorphism" },
    { id: 9, name: "Badge Cards" },
    { id: 10, name: "Typographic Focus" },
    { id: 11, name: "Vintage Polaroids" },
    { id: 12, name: "Glassmorphism Icons" },
    { id: 13, name: "Minimal Bordered" },
    { id: 14, name: "Accent Shadow Boxes" },
    { id: 15, name: "Modern Split Slides" },
]

type Props = {
    categoriesData: CategoryType | null;
    categories: CategoriesType[] | [];
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<SetStateAction<boolean>>;
    getCalog: () => void;
}

export default function CategoriesView({ categoriesData, categories, isDarkMode, setIsDarkMode, getCalog }: Props) {
    const [selectedColor, setSelectedColor] = useState(BUSINESS_THEMES[0].hex);
    const [activeTab, setActiveTab] = useState<any>();
    const [categorieLayout, setCategorieLayout] = useState<number>();
    const [displayMode, setDisplayMode] = useState('auto');
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [categorie, setCategorie] = useState<CategoriesType[]>();

    useEffect(() => {
        if (categoriesData) {
            setCategorieLayout(categoriesData?.layout_categories);
            if (categoriesData?.color) {
                setSelectedColor(categoriesData?.color);
            }
            if (categoriesData?.mode) {
                setDisplayMode(categoriesData?.mode);
                setIsDarkMode(categoriesData?.mode === 'dark');
            }
        }
        setCategorie(categories);
    }, [categories, categoriesData, setIsDarkMode]);

    const getContrastColor = (hex: string) => {
        if (!hex) return '#1e293b';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#1e293b' : '#ffffff';
    };

    const currentTextColor = getContrastColor(selectedColor);

    useEffect(() => {
        document.documentElement.style.setProperty('--category-primary-color', selectedColor);
        document.documentElement.style.setProperty('--category-secondary-color', currentTextColor);

        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--category-primary-rgb', `${r}, ${g}, ${b}`);

        const tr = parseInt(currentTextColor.slice(1, 3), 16);
        const tg = parseInt(currentTextColor.slice(3, 5), 16);
        const tb = parseInt(currentTextColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--category-secondary-rgb', `${tr}, ${tg}, ${tb}`);
    }, [selectedColor, currentTextColor]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!categorieLayout) {
                setLoading(false);
                setShowAlert({ isOpen: true, type: 'error', message: "Harap pilih salah satu kategori dibawah" });
                return;
            }
            const formData = new FormData();
            formData.append('layout_categories', String(categorieLayout))
            formData.append('color', selectedColor)
            formData.append('mode', displayMode)

            const res = await Post('client/catalog/categorie', formData)
            if (res) {
                setLoading(false);
                getCalog();
                setShowAlert({ isOpen: true, type: 'success', message: "Pengaturan kategori berhasil disimpan" });
            }
        } catch (e: any) {
            setLoading(false);
            setShowAlert({ isOpen: true, type: 'error', message: "Pengaturan kategori gagal disimpan" });
        }
    }

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="space-y-6 max-w-7xl mx-auto pb-20">

                {/* Header Configuration Panel */}
                <div className="p-4 sm:p-6 space-y-6">
                    {/* Business Presets */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Tema Warna</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                            {BUSINESS_THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        setSelectedColor(theme.hex);
                                        setActiveTab(theme.id);
                                    }}
                                    className={`w-[220px] shrink-0 snap-start flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300
                                        ${activeTab === theme.id
                                            ? 'border-indigo-500 shadow-[0_8px_20px_rgba(99,102,241,0.15)] ring-4 ring-indigo-500/10' + (isDarkMode ? ' bg-slate-900' : ' bg-white')
                                            : 'border-transparent hover:scale-[1.02]' + (isDarkMode ? ' bg-slate-800 hover:bg-slate-700' : ' bg-white shadow-sm hover:shadow-md')
                                        }`}
                                >
                                    <div className="p-2.5 rounded-xl text-white shadow-inner" style={{ backgroundColor: theme.hex }}>
                                        {theme.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{theme.name}</div>
                                        <div className="text-[11px] text-slate-500 line-clamp-1">{theme.description}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Color & Mode Settings */}
                    <div className={`p-5 md:p-7 rounded-[2rem] border transition-colors duration-300 space-y-6 shadow-sm
                        ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>

                        <div className="flex items-center gap-2 text-sm font-bold tracking-wide">
                            <Pipette size={18} className="text-emerald-500" />
                            <span>Kustomisasi Warna</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative shrink-0 group">
                                <input
                                    type="color"
                                    value={selectedColor}
                                    onChange={(e) => {
                                        setSelectedColor(e.target.value);
                                        setActiveTab('custom');
                                    }}
                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                />
                                <div
                                    className="h-14 w-14 rounded-2xl shadow-inner border-[3px] border-white/20 transition-transform group-hover:scale-105"
                                    style={{ backgroundColor: selectedColor }}
                                />
                            </div>
                            <div className={`flex-1 px-4 py-3.5 rounded-xl border font-mono text-sm tracking-widest shadow-sm
                                ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                {selectedColor?.toUpperCase()}
                            </div>
                        </div>

                        <hr className={isDarkMode ? 'border-slate-800' : 'border-slate-100'} />

                        <div className="flex flex-col md:flex-row md:items-end gap-6 w-full">
                            <div className="space-y-3 flex-1 w-full">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mode Tampilan</label>
                                <div className={`grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl ${isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
                                    {[
                                        { id: 'light', label: 'Light', icon: <Sun size={15} />, color: 'text-amber-500' },
                                        { id: 'dark', label: 'Dark', icon: <Moon size={15} />, color: 'text-emerald-500' },
                                        { id: 'auto', label: 'Auto', icon: <SunMoon size={15} />, color: isDarkMode ? 'text-slate-300' : 'text-slate-700' }
                                    ].map((mode) => (
                                        <button
                                            key={mode.id}
                                            onClick={() => {
                                                setDisplayMode(mode.id);
                                                setIsDarkMode(mode.id === 'dark');
                                            }}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all duration-300
                                                ${displayMode === mode.id
                                                    ? `shadow-sm ${mode.color} ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`
                                                    : 'text-slate-500 hover:bg-slate-500/10'
                                                }`}
                                        >
                                            {mode.icon} <span className="hidden sm:inline">{mode.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full flex items-center justify-center gap-2 py-4 px-4 text-sm bg-emerald-600 text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(5,150,105,0.2)] hover:bg-emerald-500 hover:shadow-[0_10px_25px_rgba(5,150,105,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                                >
                                    <Check className="w-5 h-5" /> Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layout Configuration Panel */}
                <div className="px-4 sm:px-6">
                    <div className={`p-4 md:p-6 rounded-[2rem] transition-colors duration-300 mb-6
                        ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100 shadow-sm'}`}>
                        <label className={`text-xs font-bold uppercase tracking-wider ml-1 mb-4 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            Pilih Layout Kategori ({listCategorie.length})
                        </label>
                        <div className="flex overflow-x-auto w-full gap-3 pb-2 no-scrollbar snap-x">
                            {listCategorie?.map((lc) => (
                                <button
                                    key={lc.id}
                                    onClick={() => setCategorieLayout(lc.id)}
                                    className={`shrink-0 snap-start text-sm font-bold px-5 py-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 border-2
                                        ${lc.id === categorieLayout
                                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 shadow-sm'
                                            : isDarkMode
                                                ? 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                                        }`}
                                >
                                    {lc.id === categorieLayout ? (
                                        <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <Circle className="w-4 h-4 opacity-40" />
                                    )}
                                    <span>{lc.id}. {lc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preview Area (All Layouts Rendered) */}
                    <div className="space-y-10">
                        {listCategorie?.map((lh) => {
                            const isSelected = categorieLayout === lh.id;

                            return (
                                <div
                                    key={lh.id}
                                    className={`relative rounded-[2rem] transition-all duration-500 overflow-hidden cursor-pointer border-2
                                        ${isSelected
                                            ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)] ring-4 ring-emerald-500/10'
                                            : isDarkMode
                                                ? 'border-slate-800 opacity-60 hover:opacity-100'
                                                : 'border-slate-100 opacity-60 hover:opacity-100'
                                        }`}
                                    onClick={() => setCategorieLayout(lh.id)}
                                >
                                    {/* Header Banner Preview */}
                                    <div className={`px-6 py-4 flex items-center justify-between border-b transition-colors
                                        ${isSelected
                                            ? (isDarkMode ? 'bg-emerald-950/50 border-emerald-900/50' : 'bg-emerald-50 border-emerald-100')
                                            : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100')
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isSelected ? <CheckCircleIcon className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-400" />}
                                            <label className={`text-sm font-bold uppercase tracking-widest cursor-pointer
                                                ${isSelected ? 'text-emerald-600' : 'text-slate-500'}
                                            `}>
                                                Layout {lh.id} - {lh.name}
                                            </label>
                                        </div>
                                        {isSelected && (
                                            <span className="text-[10px] font-bold bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                                                Active
                                            </span>
                                        )}
                                    </div>

                                    {/* Component Render */}
                                    <div className={`p-4 sm:p-8 pointer-events-none ${isDarkMode ? 'bg-slate-950' : 'bg-white'}`}>
                                        {categorie && (
                                            <CategorieConfig
                                                theme={lh.id}
                                                dataCategories={categorie}
                                                isDarkMode={isDarkMode}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
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