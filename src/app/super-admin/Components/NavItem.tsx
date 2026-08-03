import { useCorrectPath } from '@/utils/useCorrectPath';
import { ChevronDown, Lock } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation'; // Tambahkan usePathname
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props = {
    icon: any;
    label: string;
    active: boolean;
    children?: any;
    parent: string;
    pathNameChild?: string;
    setLoading: Dispatch<SetStateAction<boolean>>;
    isLocked?: boolean;
}

const NavItem = ({ icon: Icon, label, active, children, parent, pathNameChild, setLoading, isLocked = false }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const hasChildren = children && children.length > 0;
    const route = useRouter();
    const { getCorrectPath } = useCorrectPath();

    const handleClick = (e: React.MouseEvent) => {
        // Cegat klik jika menu dikunci
        if (isLocked) {
            e.preventDefault();
            return;
        }

        if (hasChildren) {
            setIsOpen(!isOpen);
        } else {
            // Gunakan getCorrectPath sebelum push
            route.push(getCorrectPath(parent));
            setLoading(!active);
        }
    };

    useEffect(() => {
        // Jika dikunci, pastikan menu dropdown selalu tertutup
        if (isLocked) {
            setIsOpen(false);
        } else {
            setIsOpen(active);
        }
    }, [active, isLocked]);

    return (
        <div className="w-full">
            <button
                onClick={handleClick}
                disabled={isLocked}
                className={`group flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-300 
                    ${isLocked
                        ? 'opacity-60 cursor-not-allowed bg-slate-50/50 text-slate-400'
                        : active
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                            : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <Icon
                        size={20}
                        className={`${(active && !isLocked) ? 'scale-110' : !isLocked ? 'group-hover:scale-110 transition-transform' : ''}`}
                    />
                    <span className="font-semibold text-sm">{label}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Tampilkan ikon gembok jika dikunci */}
                    {isLocked && (
                        <Lock size={14} className="text-slate-400" />
                    )}

                    {/* Tampilkan chevron hanya jika punya anak dan TIDAK dikunci */}
                    {hasChildren && !isLocked && (
                        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} />
                        </div>
                    )}
                </div>
            </button>

            {hasChildren && !isLocked && (
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-9 flex flex-col gap-1 border-l-2 border-emerald-100 pl-4 py-1">
                        {children?.map((child: any, idx: number) => {
                            const isActive = pathNameChild === getCorrectPath(`${parent}${child?.href}`);
                            return <button
                                onClick={() => {
                                    // Terapkan helper getCorrectPath ke anak menu juga
                                    const targetPath = `${parent}/${child?.href}`;
                                    route.push(getCorrectPath(targetPath));
                                    setLoading(!isActive);
                                }}
                                key={idx}
                                className={`text-left py-2 text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-slate-400'}  hover:text-emerald-600 transition-colors`}
                            >
                                {child.label}
                            </button>
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavItem;