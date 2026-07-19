import { X } from 'lucide-react';
import React, { useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

type Props = {
    children: React.ReactNode;
    activeModal: boolean;
    closeModal: () => void;
    isDarkMode: boolean;
};

const ModalWrapper = ({ children, activeModal, closeModal, isDarkMode }: Props) => {
    const controls = useDragControls();
    const constraintsRef = useRef(null);

    return (
        <AnimatePresence>
            {activeModal && (
                <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center p-0 md:p-8">
                    {/* 1. Premium Backdrop / Overlay (Lebih soft dengan efek frosted glass) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* 2. Modal Container */}
                    <motion.div
                        ref={constraintsRef}
                        initial={{ y: "100%", opacity: 0.5 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        // Transisi "iOS-style" yang lebih smooth, tidak terlalu memantul (bounce)
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        drag="y"
                        dragControls={controls}
                        dragListener={false}
                        dragConstraints={{ top: 0 }}
                        dragElastic={{ top: 0, bottom: 0.3 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 && info.velocity.y > 20) closeModal();
                        }}
                        className={`relative w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[85vh] flex flex-col 
                            shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-2xl 
                            rounded-t-[2rem] md:rounded-[2rem] overflow-hidden 
                            transition-colors duration-300
                            ${isDarkMode
                                ? 'bg-[#0F172A] text-white border border-white/10'
                                : 'bg-white text-slate-900 border border-slate-200/50'
                            }`}
                    >
                        {/* 3. Refined Drag Handle (Tidak overlap dengan konten) */}
                        <div
                            onPointerDown={(e) => controls.start(e)}
                            className="md:hidden w-full flex items-center justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing flex-shrink-0 touch-none z-30"
                        >
                            <div className={`w-12 h-1.5 rounded-full transition-opacity hover:opacity-80 ${isDarkMode ? 'bg-white/30' : 'bg-slate-300'
                                }`} />
                        </div>

                        {/* 4. Desktop Close Button (Floating & Elegant) */}
                        <button
                            onClick={closeModal}
                            className={`hidden md:flex absolute top-5 right-5 z-50 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:scale-105 ${isDarkMode
                                ? 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            <X size={20} strokeWidth={2.5} />
                        </button>

                        {/* 5. Scrollable Content (Area Children) */}
                        <div className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ModalWrapper;