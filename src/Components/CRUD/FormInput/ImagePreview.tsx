import { Trash2 } from 'lucide-react';
import React from 'react'

type Props = {
    imageUrl: string | null;
    fileName: string | null | undefined;
    handleDeleteImage?: () => void;
}

const ImagePreview = ({ imageUrl, fileName, handleDeleteImage }: Props) => {
    if (!imageUrl) return null;

    return (
        <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center space-x-3 relative">
            <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt="Pratinjau"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentNode as HTMLElement;
                        // Tampilkan ikon placeholder jika gambar gagal dimuat
                        parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-gray-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
                    }}
                />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-800 line-clamp-1">{fileName || "Gambar Terpilih"}</p>
                <p className="text-xs text-green-600">Pratinjau Aktif</p>
            </div>
            <div className='text-red-500 absolute top-2 right-2 cursor-pointer' onClick={handleDeleteImage}>
                <Trash2 />
            </div>
        </div>
    );
};

export default ImagePreview