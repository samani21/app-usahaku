import { SelectOption } from "@/types/Public";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { AlertTriangle, Eye, EyeOff, Info, Link as LinkIcon } from "lucide-react";
import React, { ChangeEvent, useMemo, useState, useEffect, useRef } from "react";
import Link from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align';
import TiptapImage from '@tiptap/extension-image';
import TiptapUnderline from '@tiptap/extension-underline';

type Props = {
    label: string;
    type:
    | "text"
    | "number"
    | "file"
    | "textarea"
    | "select"
    | "price"
    | "autocomplete"
    | "checkbox"
    | "switch"
    | "date"
    | "color"
    | "image"
    | "time"
    | "password"
    | "radio"
    | "wysiwyg";

    name: string;
    value?: any;
    onChange: (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => void;
    error?: string;
    min?: number;
    max?: number;
    required?: boolean;
    options?: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    information?: string; // Menambahkan prop information
};

const FormInput = ({
    label,
    type,
    name,
    value,
    onChange,
    error,
    min = 0,
    required = false,
    options = [],
    placeholder,
    disabled = false,
    max,
    information, // Destructure prop information
}: Props) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const isWysiwyg = type === "wysiwyg";
    const isFile = type === "file";
    const isTextArea = type === "textarea";
    const isSelect = type === "select";
    const isPrice = type === "price";
    const isAutocomplete = type === "autocomplete";

    // UI Styles yang Diperbarui
    const baseInput = `w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-4 focus:bg-white transition-all duration-200 text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm
        ${disabled
            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"
            : "border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-emerald-500/10"
        }`;

    const errorStyle = error
        ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20"
        : "";

    const fileStyle = `file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed file:cursor-not-allowed" : ""}`;

    useEffect(() => {
        if (isAutocomplete) {
            const selected = options.find(
                (opt) => opt.value.toString() === value?.toString()
            );
            if (selected) {
                setSearch(selected.label);
            }
        }
    }, [value, options, isAutocomplete]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (type === "image" && value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [value, type]);

    /* ============================= */
    /* FORMAT RUPIAH */
    /* ============================= */
    const formatRupiah = (val: string | number) => {
        if (!val) return "";
        const number = val.toString().replace(/\D/g, "");
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const raw = e.target.value.replace(/\D/g, "");
        const formatted = formatRupiah(raw);

        e.target.value = formatted;

        const sendEvent = {
            ...e,
            target: {
                ...e.target,
                name,
                value: raw,
            },
        };

        onChange(sendEvent as any);
    };

    /* ============================= */
    /* AUTOCOMPLETE FILTER */
    /* ============================= */
    const filteredOptions = useMemo(() => {
        if (!open) return [];
        if (!search) return options;

        return options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options, open]);

    /* ============================= */
    /* TIPTAP EDITOR CONFIG */
    /* ============================= */
    const editor = useEditor({
        extensions: [
            StarterKit,
            TiptapUnderline,
            TiptapImage,
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
                const html = editor.getHTML();
                onChange({
                    target: { name: name, value: html, type: 'wysiwyg' }
                } as any);
            }
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    /* ============================= */
    /* RENDER INPUT */
    /* ============================= */
    const renderInput = () => {
        if (isWysiwyg) {
            const btnClass = `p-1.5 rounded transition-colors text-sm font-semibold
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-200"}`;

            const getActiveStyle = (isActive: boolean) =>
                isActive && !disabled ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600';

            return (
                <div className={`flex flex-col border rounded-xl overflow-hidden shadow-sm ${error ? "border-red-500 ring-4 ring-red-500/10" : "border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10"} ${disabled ? "opacity-80" : ""}`}>
                    {/* Toolbar Tiptap */}
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
                        {/* Group: Text Style */}
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('bold') || false)}`}><b>B</b></button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('italic') || false)}`}><i>I</i></button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('underline') || false)}`}><u>U</u></button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleStrike().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('strike') || false)}`}><s>S</s></button>

                        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                        {/* Group: Alignment */}
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().setTextAlign('left').run()} className={`${btnClass} ${getActiveStyle(editor?.isActive({ textAlign: 'left' }) || false)}`}>L</button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().setTextAlign('center').run()} className={`${btnClass} ${getActiveStyle(editor?.isActive({ textAlign: 'center' }) || false)}`}>C</button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().setTextAlign('right').run()} className={`${btnClass} ${getActiveStyle(editor?.isActive({ textAlign: 'right' }) || false)}`}>R</button>

                        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                        {/* Group: Lists */}
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('bulletList') || false)}`}>• List</button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`${btnClass} ${getActiveStyle(editor?.isActive('orderedList') || false)}`}>1. List</button>

                        <div className="w-[1px] h-5 bg-slate-300 mx-1" />

                        {/* Group: Extra */}
                        <button disabled={disabled} type="button" onClick={() => {
                            if (disabled) return;
                            const url = window.prompt('Masukkan URL Link:');
                            if (url) editor?.chain().focus().setLink({ href: url }).run();
                        }} className={`${btnClass} flex items-center gap-1 ${getActiveStyle(editor?.isActive('link') || false)}`}>
                            <LinkIcon size={14} /> Link
                        </button>

                        <div className="flex-1"></div>

                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().undo().run()} className={btnClass}>Undo</button>
                        <button disabled={disabled} type="button" onClick={() => editor?.chain().focus().redo().run()} className={btnClass}>Redo</button>
                    </div>

                    {/* Area Editor */}
                    <EditorContent editor={editor} disabled={disabled} />
                </div>
            );
        }

        if (isPrice) {
            return (
                <div className="relative flex items-center">
                    <span className={`absolute left-4 text-sm font-semibold z-10 ${disabled ? "text-slate-400" : "text-slate-500"}`}>
                        Rp
                    </span>
                    <input
                        type="text"
                        name={name}
                        disabled={disabled}
                        value={formatRupiah(value ?? "")}
                        onChange={handlePriceChange}
                        placeholder={placeholder}
                        className={`${baseInput} pl-12 ${errorStyle}`}
                    />
                </div>
            );
        }

        if (isSelect) {
            return (
                <select
                    name={name}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    className={`${baseInput} pr-10 appearance-none ${errorStyle}`}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "right 0.5rem center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "1.5em 1.5em"
                    }}
                >
                    <option value="" disabled>-- Pilih {label} --</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        if (isAutocomplete) {
            return (
                <div ref={wrapperRef} className="relative">
                    <input
                        type="text"
                        disabled={disabled}
                        placeholder={`Cari ${label}`}
                        value={search}
                        onFocus={() => {
                            if (disabled) return;
                            setOpen(true);
                            setSearch("");
                        }}
                        onChange={(e) => {
                            if (disabled) return;
                            setSearch(e.target.value);
                            setOpen(true);
                        }}
                        className={`${baseInput} ${errorStyle}`}
                    />

                    {open && !disabled && (
                        <div className="absolute z-20 w-full bg-white border border-slate-200 rounded-xl mt-2 max-h-56 overflow-y-auto shadow-xl py-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => {
                                    const isSelected = opt.value.toString() === value?.toString();

                                    return (
                                        <div
                                            key={opt.value}
                                            onClick={() => {
                                                setSearch(opt.label);
                                                setOpen(false);

                                                const fakeEvent = {
                                                    target: { name, value: opt.value },
                                                };

                                                onChange(fakeEvent as any);
                                            }}
                                            className={`px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors
                                            ${isSelected
                                                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                                                    : "hover:bg-slate-50 text-slate-700"
                                                }`}
                                        >
                                            {opt.label}
                                            {isSelected && (
                                                <span className="text-emerald-600 font-bold">✓</span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-400 italic">
                                    Pilihan tidak ditemukan
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        if (isTextArea) {
            return (
                <textarea
                    name={name}
                    disabled={disabled}
                    value={value as string}
                    onChange={onChange}
                    rows={4}
                    placeholder={placeholder}
                    className={`${baseInput} resize-y ${errorStyle}`}
                />
            );
        }

        if (type === "checkbox") {
            return (
                <label className={`flex items-center space-x-3 w-max ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}>
                    <input
                        type="checkbox"
                        name={name}
                        disabled={disabled}
                        checked={!!value}
                        onChange={(e) =>
                            onChange({
                                ...e,
                                target: {
                                    ...e.target,
                                    name,
                                    value: e.target.checked,
                                },
                            } as any)
                        }
                        className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500/20 focus:ring-4 transition-all disabled:cursor-not-allowed"
                    />
                    <span className={`text-sm font-medium ${disabled ? "text-slate-500" : "text-slate-700"}`}>{label}</span>
                </label>
            );
        }

        if (type === "switch") {
            return (
                <div className={`flex items-center space-x-4 ${disabled ? "opacity-70" : ""}`}>
                    <span className={`text-sm font-semibold ${disabled ? "text-slate-500" : "text-slate-700"}`}>
                        {label}
                    </span>
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() =>
                            onChange({
                                target: { name, value: !value },
                            } as any)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/20
                        ${value ? "bg-emerald-500" : "bg-slate-300"} 
                        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 
                            ${value ? "translate-x-6" : "translate-x-1"}`}
                        />
                    </button>
                </div>
            );
        }

        if (type === "image") {
            return (
                <div className="space-y-3">
                    {preview && (
                        <div className="relative inline-block">
                            <img
                                src={preview}
                                alt="Preview"
                                className={`w-32 h-32 object-cover rounded-xl border-2 border-slate-200 shadow-sm ${disabled ? "opacity-60" : ""}`}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        name={name}
                        disabled={disabled}
                        onChange={(e) => {
                            if (disabled) return;
                            const file = e.target.files?.[0];
                            if (file) {
                                setPreview(URL.createObjectURL(file));
                                onChange({
                                    ...e,
                                    target: {
                                        ...e.target,
                                        name,
                                        value: file,
                                    },
                                } as any);
                            }
                        }}
                        className={`${baseInput} !p-0 !bg-transparent !border-0 !shadow-none ${fileStyle} ${errorStyle}`}
                    />
                </div>
            );
        }

        if (type === "password") {
            return (
                <div className="relative flex items-center">
                    <input
                        type={showPassword ? "text" : "password"}
                        name={name}
                        disabled={disabled}
                        value={value as string}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={`${baseInput} pr-12 ${errorStyle}`}
                    />
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className={`absolute right-4 p-1 rounded-md text-slate-400 transition-colors
                        ${disabled ? "cursor-not-allowed" : "hover:text-emerald-600 hover:bg-slate-100"}`}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            );
        }

        if (type === "color") {
            return (
                <div className={`flex items-center gap-3 ${disabled ? "opacity-70" : ""}`}>
                    <input
                        type="color"
                        name={name}
                        disabled={disabled}
                        value={value || "#000000"}
                        onChange={onChange}
                        className={`w-12 h-12 p-1 border border-slate-200 rounded-xl bg-slate-50 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                    />
                    <input
                        type="text"
                        value={value || ""}
                        onChange={onChange}
                        disabled={disabled}
                        name={name}
                        placeholder="#000000"
                        className={`${baseInput} flex-1 uppercase ${errorStyle}`}
                    />
                </div>
            );
        }

        if (type === "radio") {
            return (
                <div className={`flex flex-col space-y-3 mt-2 ${disabled ? "opacity-70" : ""}`}>
                    {options.map((opt) => (
                        <label key={opt.value} className={`flex items-center space-x-3 w-max ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
                            <input
                                type="radio"
                                name={name}
                                disabled={disabled}
                                value={opt.value}
                                checked={value !== undefined && value !== "" && value?.toString() === opt.value.toString()}
                                onChange={onChange}
                                className="w-5 h-5 text-emerald-600 border-slate-300 focus:ring-emerald-500/20 focus:ring-4 transition-all disabled:cursor-not-allowed"
                            />
                            <span className={`text-sm font-medium ${disabled ? "text-slate-500" : "text-slate-700"}`}>{opt.label}</span>
                        </label>
                    ))}
                </div>
            );
        }

        return (
            <input
                type={isFile ? "file" : type}
                name={name}
                disabled={disabled}
                {...(!isFile && { value })}
                onChange={onChange}
                min={type === "number" ? min : undefined}
                max={type === "number" ? max : undefined}
                step={type === "number" ? "1" : undefined}
                placeholder={placeholder}
                className={`${baseInput} ${isFile ? "!p-0 !bg-transparent !border-0 !shadow-none " + fileStyle : ""} ${errorStyle}`}
            />
        );
    };

    return (
        <div className="flex flex-col space-y-2 w-full">
            <div className="flex items-center gap-1.5">
                <label className={`text-sm font-bold tracking-wide flex items-center gap-1 ${disabled ? "text-slate-400" : "text-slate-700"}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                {/* Menambahkan Popup/Tooltip Information */}
                {information && (
                    <div className="group relative flex items-center justify-center cursor-help">
                        <Info size={16} className="text-slate-400 hover:text-emerald-500 transition-colors" />

                        {/* Box Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {information}

                            {/* Panah (Arrow) Tooltip */}
                            <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
                                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {renderInput()}

            {error && (
                <p className="text-sm font-medium text-red-500 flex items-center mt-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertTriangle size={16} className="mr-1.5" />
                    {error}
                </p>
            )}

            {isWysiwyg && (
                <style jsx global>{`
                    .prose p, .tiptap p {
                        margin-top: 0px !important;
                        margin-bottom: 0px !important;
                        line-height: 1.5 !important;
                    }
                    .prose ul, .tiptap ul, 
                    .prose ol, .tiptap ol { 
                        list-style-type: disc !important; 
                        padding-left: 1.5rem !important; 
                        margin-top: 4px !important; 
                        margin-bottom: 4px !important;
                    }
                    .prose li, .tiptap li { 
                        margin-top: 2px !important;
                        margin-bottom: 2px !important;
                        padding-left: 0px !important;
                    }
                    .prose li > p, .tiptap li > p {
                        margin: 0 !important;
                        display: inline;
                    }
                    .tiptap.prose {
                        font-size: 0.875rem !important;
                    }
                `}</style>
            )}
        </div>
    );
};

export default FormInput;