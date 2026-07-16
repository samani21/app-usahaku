import { cn } from "@/lib/utils"
import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "danger"
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = "primary",
    ...props
}) => {
    const base =
        "inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
        outline:
            "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    }

    return (
        <button className={cn(base, variants[variant], className)} {...props} />
    )
}
