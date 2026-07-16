// Updated UI Components to match the design style
import * as React from "react";

/******************** CARD ********************/
export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl bg-white border border-zinc-200 shadow-sm ${className}`} {...props} />
  );
}

export function CardContent({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-6 ${className}`} {...props} />;
}

/******************** BUTTON ********************/
export function Button({ className = "", variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) {
  const base = "inline-flex items-center justify-center font-medium transition-all rounded-xl text-sm";

  const variants: Record<string, string> = {
    default: "bg-zinc-600 text-white px-4 py-2 hover:bg-zinc-700 active:scale-[0.97]",
    disable: "bg-zinc-300 text-gray-500 px-4 py-2 hover:bg-zinc-400 active:scale-[0.97]",
    outline: "border border-zinc-300 bg-white px-4 py-2 text-zinc-700 hover:bg-zinc-100",
    outlineRed: "border border-red-300 bg-white px-4 py-2 text-red-700 hover:bg-red-100",
  };

  return (
    <button className={`${base} ${variants[variant] || variants.default} ${className}`} {...props} />
  );
}

/******************** INPUT ********************/
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/******************** TEXTAREA ********************/
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`min-h-[100px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

/******************** LABEL ********************/
export function Label({ className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`text-sm font-medium text-zinc-700 ${className}`} {...props} />;
}

/******************** AVATAR ********************/
export function Avatar({ src, alt, className = "", children, ...props }: { src?: string; alt?: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`rounded-full overflow-hidden bg-zinc-200 ${className}`} {...props}>
      {src ? <AvatarImage src={src} alt={alt} /> : children}
    </div>
  );
}

export function AvatarImage({ src, alt }: { src: string; alt?: string }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" draggable={false} />;
}
