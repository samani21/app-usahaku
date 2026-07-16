// hooks/useCorrectPath.ts
import { usePathname } from "next/navigation";

export const useCorrectPath = () => {
    const pathname = usePathname();

    const getCorrectPath = (targetPath: string) => {
        const isLocalAdminPath = pathname?.startsWith('/admin');

        // Pastikan diawali dengan slash dan bersihkan jika ada double slash
        const cleanPath = `/${targetPath}`.replace(/\/+/g, '/');

        if (isLocalAdminPath && !cleanPath.startsWith('/admin')) {
            if (targetPath === '/') {
                return `/admin`;
            }
            return `/admin${cleanPath}`.replace(/\/+/g, '/');
        }
        return cleanPath;
    };

    return { getCorrectPath };
};