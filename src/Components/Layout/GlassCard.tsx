import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode; // Mengganti 'any' dengan 'ReactNode'
    className?: string;  // Jadikan opsional
}

const GlassCard = ({ children, className = "" }: Props) => {
    return (
        <div className={`bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] ${className}`}>
            {children}
        </div>
    )
}

export default GlassCard