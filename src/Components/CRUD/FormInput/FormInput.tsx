import { SelectOption } from "@/types/Public";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align';
import TiptapImage from '@tiptap/extension-image';
import TiptapUnderline from '@tiptap/extension-underline';
import { AlertTriangle, Eye, EyeOff, Info, Link as LinkIcon, ChevronDown, Check } from "lucide-react";
import React, { ChangeEvent, useMemo, useState, useEffect, useRef } from "react";

type Props = {
    label: string;
    type: "text" | "number" | "file" | "textarea" | "select" | "price" |
    "autocomplete" | "checkbox" | "switch" | "date" | "color" |
    "image" | "time" | "password" | "radio" | "wysiwyg";
    name: string;
    value?: any;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => void;
    error?: string;
    min?: number;
    max?: number;
    required?: boolean;
    options?: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    information?: string;
};

const FormInput = ({
    label, type, name, value, onChange, error, min, max,
    required = false, options = [], placeholder, disabled = false, information
}: Props) => {
    // States
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // --- Modern UI Styles ---
    const baseInput = `w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-[3px] transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm
        ${disabled
            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"
            : "border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"
        } ${error ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`;

    const fileStyle = `file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:transition-colors cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed file:cursor-not-allowed" : ""}`;

    // --- Hooks & Effects ---
    useEffect(() => {
        if (type === "autocomplete" && value !== undefined) {
            const selected = options.find((opt) => opt.value?.toString() === value?.toString());
            if (selected) setSearch(selected.label);
        }
    }, [value, options, type]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (type === "image" && value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [value, type]);

    // --- Handlers ---
    const formatRupiah = (val: string | number) => {
        if (!val) return "";
        return val.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const raw = e.target.value.replace(/\D/g, "");
        e.target.value = formatRupiah(raw);
        onChange({ ...e, target: { ...e.target, name, value: raw } });
    };

    const filteredOptions = useMemo(() => {
        if (!open) return [];
        if (!search) return options;
        return options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));
    }, [search, options, open]);

    // --- Tiptap Editor ---
    const editor = useEditor({
        extensions: [
            StarterKit, TiptapUnderline, TiptapImage,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
        ],
        editable: !disabled,
        immediatelyRender: false,
        content: value || '',
        editorProps: {
            attributes: {
                class: `prose prose-sm focus:outline-none max-w-none min-h-[150px] p-4 bg-white rounded-b-xl transition-colors duration-200 ${error ? "border-red-500" : "border-slate-200"} ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`,
            },
        },
        onUpdate: ({ editor }) => {
            if (editor.isFocused && !disabled) {
                onChange({ target: { name, value: editor.getHTML(), type: 'wysiwyg' } });
            }
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
        editor?.setEditable(!disabled);
    }, [value, editor, disabled]);

    // --- Render Switcher ---
    const renderInputElement = () => {
        switch (type) {
            // FIX 1: Toolbar WYSIWYG dibuat jadi Horizontal Scroll (Mobile Friendly)
            case "wysiwyg":
                const btnClass = `shrink-0 w-8 h-8 rounded-md transition-all text-sm font-bold flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-200"}`;
                const getActiveStyle = (isActive: boolean) => isActive && !disabled ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'text-slate-600';

                return (
                    <div className={`flex flex-col border rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${error ? "border-red-500 ring-[3px] ring-red-500/20" : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-[3px] focus-within:ring-emerald-500/20"} ${disabled ? "opacity-80" : ""}`}>
                        {/* Wrapper overflow-x-auto untuk mobile */}
                        <div className="flex overflow-x-auto items-center gap-1 p-2 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 sm:flex-wrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('bold') || false)}`}>B</button>
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('italic') || false)}`}><i className="italic">I</i></button>
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('underline') || false)}`}><u className="underline">U</u></button>
                            <div className="shrink-0 w-[1px] h-5 bg-slate-300 mx-1" />
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`${btnClass} ${getActiveStyle(editor?.isActive({ textAlign: 'left' }) || false)}`}>L</button>
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`${btnClass} ${getActiveStyle(editor?.isActive({ textAlign: 'center' }) || false)}`}>C</button>
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`${btnClass} ${getActiveStyle(editor?.isActive({ textAlign: 'right' }) || false)}`}>R</button>
                            <div className="shrink-0 w-[1px] h-5 bg-slate-300 mx-1" />
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('bulletList') || false)}`}>•</button>
                            <div className="flex-1 min-w-[20px]"></div>
                            <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().undo().run()} className={`${btnClass} px-3 w-auto font-medium text-xs`}>Undo</button>
                        </div>
                        <EditorContent editor={editor} disabled={disabled} />
                    </div>
                );

            // FIX 2: Tampilan Custom Khusus Input Color
            case "color":
                return (
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            name={name}
                            disabled={disabled}
                            value={value ?? "#10b981"}
                            onChange={onChange}
                            className={`h-11 w-16 p-1 cursor-pointer bg-white border rounded-xl focus:outline-none focus:ring-[3px] transition-all duration-300
                                ${disabled ? "opacity-60 cursor-not-allowed border-slate-200" : "border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/20"}
                                ${error ? "!border-red-500 focus:!ring-red-500/20" : ""}`}
                        />
                        <span className="text-sm font-bold text-slate-600 uppercase tracking-widest bg-slate-50 border border-slate-200 px-4 py-2 rounded-lg shadow-inner">
                            {value || "#10b981"}
                        </span>
                    </div>
                );

            case "price":
                return (
                    <div className="relative flex items-center group">
                        <span className={`absolute left-4 text-sm font-bold z-10 transition-colors ${disabled ? "text-slate-400" : "text-slate-500 group-focus-within:text-emerald-600"}`}>
                            Rp
                        </span>
                        <input
                            type="text" name={name} disabled={disabled}
                            value={formatRupiah(value ?? "")}
                            onChange={handlePriceChange}
                            placeholder={placeholder || "0"}
                            className={`${baseInput} pl-12`}
                        />
                    </div>
                );

            case "select":
                return (
                    <div className="relative">
                        <select
                            name={name} value={value} disabled={disabled} onChange={onChange}
                            className={`${baseInput} pr-10 appearance-none cursor-pointer`}
                        >
                            <option value="" disabled>-- Pilih {label} --</option>
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                );

            case "autocomplete":
                return (
                    <div ref={wrapperRef} className="relative">
                        <input
                            type="text" disabled={disabled} placeholder={placeholder || `Cari ${label}...`}
                            value={search}
                            onFocus={() => { if (!disabled) { setOpen(true); setSearch(""); } }}
                            onChange={(e) => { if (!disabled) { setSearch(e.target.value); setOpen(true); } }}
                            className={`${baseInput}`}
                        />
                        {open && !disabled && (
                            <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-2 max-h-56 overflow-y-auto shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((opt) => {
                                        const isSelected = opt.value?.toString() === value?.toString();
                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => {
                                                    setSearch(opt.label);
                                                    setOpen(false);
                                                    onChange({ target: { name, value: opt.value } });
                                                }}
                                                className={`px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors
                                                ${isSelected ? "bg-emerald-50 text-emerald-700 font-semibold" : "hover:bg-slate-50 text-slate-700"}`}
                                            >
                                                {opt.label}
                                                {isSelected && <Check size={16} className="text-emerald-600" />}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-400 text-center">Pilihan tidak ditemukan</div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "textarea":
                return (
                    <textarea
                        name={name} disabled={disabled} value={value as string}
                        onChange={onChange} rows={4} placeholder={placeholder}
                        className={`${baseInput} resize-y leading-relaxed`}
                    />
                );

            case "switch":
                return (
                    <button
                        type="button" disabled={disabled}
                        onClick={() => onChange({ target: { name, value: !value } })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-[3px] focus:ring-emerald-500/20
                        ${value ? "bg-emerald-500" : "bg-slate-300"} 
                        ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer shadow-inner"}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                );

            case "password":
                return (
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            name={name} disabled={disabled} value={value as string}
                            onChange={onChange} placeholder={placeholder}
                            className={`${baseInput} pr-12`}
                        />
                        <button
                            type="button" disabled={disabled}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                );

            case "image":
            case "file":
                return (
                    <div className="space-y-3">
                        {preview && type === "image" && (
                            <div className="relative inline-block group">
                                <img src={preview} alt="Preview" className={`w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm ${disabled ? "opacity-60" : "group-hover:shadow-md transition-shadow"}`} />
                            </div>
                        )}
                        <input
                            type="file" accept={type === "image" ? "image/*" : undefined}
                            name={name} disabled={disabled}
                            onChange={(e) => {
                                if (disabled) return;
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (type === "image") setPreview(URL.createObjectURL(file));
                                    onChange({ ...e, target: { ...e.target, name, value: file } });
                                }
                            }}
                            className={`${baseInput} !p-0 !bg-transparent !border-0 !shadow-none ${fileStyle}`}
                        />
                    </div>
                );

            // Fallback default behaviour untuk text, number, date, time, dsb.
            default:
                return (
                    <input
                        type={type} name={name} disabled={disabled} value={value ?? ""}
                        onChange={onChange}
                        min={type === "number" ? min : undefined}
                        max={type === "number" ? max : undefined}
                        placeholder={placeholder}
                        className={`${baseInput}`}
                    />
                );
        }
    };

    return (
        <div className="flex flex-col space-y-2 w-full">
            <div className="flex items-center gap-2">
                <label className={`text-sm font-bold tracking-wide flex items-center gap-1 ${disabled ? "text-slate-400" : "text-slate-700"}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {information && (
                    <div className="group relative flex items-center justify-center cursor-help">
                        <Info size={16} className="text-slate-400 hover:text-emerald-500 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {information}
                            <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" viewBox="0 0 255 255">
                                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {renderInputElement()}

            {error && (
                <p className="text-sm font-medium text-red-500 flex items-center mt-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertTriangle size={16} className="mr-1.5" />
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;