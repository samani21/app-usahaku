import React, { useState } from "react";
import { Palette } from "lucide-react";

interface Theme {
    name: string;
    primary: string;
    hex: string;
}

interface ThemeColorSet {
    text700: string;
}

interface ThemeSwitcherLightProps {
    themeName: string;
    setThemeName: (val: string) => void;
    listTheme: Theme[];
    color: ThemeColorSet;
}

export default function ThemeSwitcherLight({
    themeName,
    setThemeName,
    listTheme,
    color
}: ThemeSwitcherLightProps) {
    const [open, setOpen] = useState(false);

    return (
        <section className="md:flex justify-end items-center space-x-3">
            <Palette size={20} className="text-gray-500 dark:text-gray-400" />

            <span className={`text-sm ${color?.text700} font-medium`}>
                Pilih Tema:
            </span>

            {/* Tombol buka modal */}
            <button
                className="px-3 py-1 rounded-lg border text-sm shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setOpen(true)}
            >
                Coba ganti warna
            </button>

            {/* ---- MODAL ----- */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5 w-72">

                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold">Pilih Warna Tema</h2>
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        <div className="grid grid-cols-5 gap-3">
                            {listTheme?.map((t, i) => {
                                const active = themeName === t.name;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setThemeName(t.name);
                                            setOpen(false);
                                        }}
                                        className={`w-10 h-10 rounded-full border-2 transition 
                      ${active ? "border-black ring-2 ring-offset-2" : "border-gray-300"}`}
                                        style={{ backgroundColor: t.hex }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
