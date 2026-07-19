import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    htmlContent: any;
    className?: string;
    maxHeight?: string; // contoh: "163px"
};

const ExpandableHTML = ({
    htmlContent,
    className = "",
    maxHeight = "163px",
}: Props) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;

        // cek apakah konten lebih tinggi dari batas
        setIsOverflowing(el.scrollHeight > el.clientHeight);
    }, [htmlContent]);

    return (
        <div className={className}>
            <div
                ref={contentRef}
                style={!expanded ? { maxHeight, overflow: "hidden" } : {}}
                className={`
                    transition-all duration-300
                    
                    [&_ol]:list-decimal [&_ol]:ml-5 
                    [&_ul]:list-disc [&_ul]:ml-5
                    [&_p]:mb-3
                `}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Button hanya muncul kalau overflow */}
            {isOverflowing && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className=" font-bold text-[12px] mt-1 flex items-center gap-1 uppercase tracking-wider"
                >
                    {expanded ? (
                        <>Sembunyikan <ChevronUp size={12} /></>
                    ) : (
                        <>Selengkapnya <ChevronDown size={12} /></>
                    )}
                </button>
            )}

        </div>
    );
};

export default ExpandableHTML;