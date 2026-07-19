'use client'
import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { Palette, Home, Utensils, Cpu, Sparkles, Pipette, HeartPulse, Shirt, Coffee, GraduationCap, Upload, CircleCheckBigIcon, Circle, Sun, Moon, Check, SunMoon, CheckCircleIcon } from 'lucide-react';
import { CategoriesType } from '@/types/Admin/CategoriesType';
import { Get } from '@/utils/Get';
import { Catalog } from '@/types/Admin/Catalog/Catalog';
import { AlertType } from '@/types/Alert';
import { Post } from '@/utils/Post';
import { CategoryType } from '@/types/Admin/Catalog/Categories';
import CategorieConfig from '@/Components/Catalog/Categories';
import Alert from '@/Components/Alert';
import Loading from '@/Components/Loading';

const BUSINESS_THEMES = [
    {
        id: 'property',
        name: 'Properti (Minimalis)',
        description: 'Kesan bersih, luas, dan kokoh.',
        hex: '#94A3B8', // Slate Gray / Cement
        icon: <Home size={18} />,
        textColor: '#1E293B'
    },
    {
        id: 'fnb',
        name: 'F&B (Energi)',
        description: 'Menggugah selera dan hangat.',
        hex: '#F59E0B', // Amber / Warm Orange
        icon: <Utensils size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'tech',
        name: 'Tech (Modern)',
        description: 'Inovatif dan futuristik.',
        hex: '#3B82F6', // Blue
        icon: <Cpu size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'luxury',
        name: 'Luxury (Premium)',
        description: 'Eksklusif dan elegan.',
        hex: '#111827', // Rich Black
        icon: <Sparkles size={18} />,
        textColor: '#F3F4F6'
    },
    {
        id: 'medical',
        name: 'Kesehatan (Trust)',
        description: 'Steril, tenang, dan terpercaya.',
        hex: '#0D9488', // Teal / Medical Green
        icon: <HeartPulse size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'fashion',
        name: 'Fashion (Trendy)',
        description: 'Ekspresif dan penuh gaya.',
        hex: '#DB2777', // Pink / Magenta
        icon: <Shirt size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'coffee',
        name: 'Coffee (Cozy)',
        description: 'Nyaman, hangat, dan santai.',
        hex: '#78350F', // Brown / Coffee
        icon: <Coffee size={18} />,
        textColor: '#FFFFFF'
    },
    {
        id: 'education',
        name: 'Pendidikan (Edu)',
        description: 'Fokus, cerdas, dan profesional.',
        hex: '#4F46E5', // Indigo / Education
        icon: <GraduationCap size={18} />,
        textColor: '#FFFFFF'
    }
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
            setDisplayMode(categoriesData?.mode);
            setIsDarkMode(categoriesData?.mode == 'dark');
        }
        setCategorie(categories);
    }, [categories, categoriesData]);

    const getContrastColor = (hex: string) => {
        if (!hex) return '#1e293b';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#1e293b' : '#ffffff';
    };

    const currentTextColor = getContrastColor(selectedColor);

    // Efek samping untuk memperbarui CSS Variables di root secara dinamis
    useEffect(() => {
        // 1. Set Primary Color (Warna Background)
        document.documentElement.style.setProperty('--category-primary-color', selectedColor);

        // 2. Set Secondary Color (Warna Teks/Kontras)
        document.documentElement.style.setProperty('--category-secondary-color', currentTextColor);

        // 3. Set RGB values untuk kebutuhan transparansi (misal: rgba(var(--category-primary-rgb), 0.5))
        const r = parseInt(selectedColor.slice(1, 3), 16);
        const g = parseInt(selectedColor.slice(3, 5), 16);
        const b = parseInt(selectedColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--category-primary-rgb', `${r}, ${g}, ${b}`);

        const tr = parseInt(currentTextColor.slice(1, 3), 16);
        const tg = parseInt(currentTextColor.slice(3, 5), 16);
        const tb = parseInt(currentTextColor.slice(5, 7), 16);
        document.documentElement.style.setProperty('--category-secondary-rgb', `${tr}, ${tg}, ${tb}`);
    }, [selectedColor, currentTextColor]);

    // Menentukan headline berdasarkan kategori aktif
    const handleSubmit = async () => {
        try {
            setLoading(true);
            if (!categorieLayout) {
                setLoading(false);
                setShowAlert({
                    isOpen: true,
                    type: 'error',
                    message: "Harap pilih salah satu kategori dibawah"
                })
                return;
            }
            const formData = new FormData();
            formData.append('layout_categories', String(categorieLayout))
            formData.append('color', selectedColor)
            formData.append('mode', displayMode)
            const res = await Post('catalog/categorie', formData)
            if (res) {
                setLoading(false);
                getCalog()
                setShowAlert({
                    isOpen: true,
                    type: 'success',
                    message: "Pengaturan kategori berhasil disimpan"
                })
            }

        } catch (e: any) {
            setLoading(false);
            setShowAlert({
                isOpen: true,
                type: 'error',
                message: "Pengaturan kategori gagal disimpan"
            })
        }
    }
    return (
        <div>
            <div className={`${isDarkMode ? 'text-white' : 'text-slate-900'} `}>
                <div className="min-h-screen font-sans ">
                    <div className="space-y-6">
                        <div className="space-y-2 p-4">
                            <label className="text-sm font-semibold uppercase tracking-wider text-gray-400">Pilih Kategori Warna</label>
                            {/* Business Presets */}
                            <div className="space-y-3">
                                <div className="flex gap-2 max-h-[500px] overflow-x-auto pr-2  no-scrollbar rounded-xl">
                                    {BUSINESS_THEMES.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => {
                                                setSelectedColor(theme.hex);
                                                setActiveTab(theme.id);
                                            }}
                                            className={`w-full flex whitespace-nowrap items-center gap-3 p-3 rounded-xl border-2 transition-all ${activeTab === theme.id
                                                ? 'border-indigo-600 bg-white shadow-md'
                                                : 'border-transparent bg-gray-100 hover:bg-gray-200'
                                                }`}
                                        >
                                            <div
                                                className="p-2 rounded-lg text-white shrink-0"
                                                style={{ backgroundColor: theme.hex }}
                                            >
                                                {theme.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-slate-900 text-sm">{theme.name}</div>
                                                <div className="text-xs text-gray-500 leading-tight line-clamp-1">{theme.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 w-full font-sans">
                            <div className="p-5 md:p-7 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
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
                                        <div className="flex-1 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-200 font-mono text-sm tracking-wide shadow-sm">
                                            {selectedColor?.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                                <hr className="border-slate-100" />
                                <div className="flex flex-col md:flex-row md:items-end gap-5 w-full">
                                    <div className="space-y-2 flex-1 w-full">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Mode Tampilan Aplikasi</label>
                                        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 rounded-xl">
                                            <button
                                                onClick={() => {
                                                    setDisplayMode('light');
                                                    setIsDarkMode(false);
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'light'
                                                    ? 'bg-white text-amber-500 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-200/50'
                                                    }`}
                                            >
                                                <Sun size={15} /> Light
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDisplayMode('dark');
                                                    setIsDarkMode(true);
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'dark'
                                                    ? 'bg-white text-emerald-600 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-200/50'
                                                    }`}
                                            >
                                                <Moon size={15} /> Dark
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDisplayMode('auto');
                                                    setIsDarkMode(false);
                                                }}
                                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${displayMode === 'auto'
                                                    ? 'bg-white text-slate-800 shadow-sm'
                                                    : 'text-slate-500 hover:bg-slate-200/50'
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
                            <div className={`p-4 md:p-5 rounded-3xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}>
                                <label className={`text-xs font-bold uppercase tracking-wider ml-1 mb-3 block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Pilih Layout Kategori
                                </label>
                                <div className="flex overflow-x-auto w-full gap-3 pb-2 no-scrollbar">
                                    {listCategorie?.map((lc, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCategorieLayout(lc?.id)}
                                            className={`whitespace-nowrap text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-200 border ${lc?.id === categorieLayout
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm'
                                                : isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                                                }`}
                                        >
                                            {lc?.id === categorieLayout ? (
                                                <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <Circle className="w-4 h-4 opacity-50" />
                                            )}
                                            <span>{lc?.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='relative pb-8 space-y-4 px-4'>
                            {
                                categorieLayout &&
                                <>
                                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 block">Yang anda pilih No.{categorieLayout}</label>
                                    {
                                        categorie &&
                                        <CategorieConfig
                                            theme={categorieLayout}
                                            dataCategories={categorie}
                                            isDarkMode={isDarkMode} />
                                    }
                                </>
                            }
                            {
                                listCategorie?.map((lh, i) => (
                                    <div className='relative space-y-4' key={i}>
                                        {
                                            categorieLayout === lh?.id ?
                                                <div className='flex items-center gap-2 cursor-pointer'>
                                                    <CircleCheckBigIcon />
                                                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 block">{lh?.id}. {lh?.name}</label>
                                                </div> :
                                                <div className='flex items-center gap-2 cursor-pointer' onClick={() => setCategorieLayout(lh?.id)}>
                                                    <Circle />
                                                    <label className="text-[12px] font-bold uppercase tracking-[0.3em] text-slate-500 block">{lh?.id}. {lh?.name}</label>
                                                </div>
                                        }
                                        {
                                            categorie &&
                                            <CategorieConfig
                                                theme={lh?.id}
                                                dataCategories={categorie}
                                                isDarkMode={isDarkMode} />
                                        }
                                    </div>
                                ))
                            }

                        </div>

                    </div>
                </div>
            </div>
            {
                showAlert?.isOpen &&
                <Alert type={showAlert?.type} message={showAlert?.message} onClose={() => setShowAlert(null)} />
            }
            {loading && <Loading title='Sedang Proses' />}
        </div>
    );
}