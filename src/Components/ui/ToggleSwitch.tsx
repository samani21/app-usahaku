import React from 'react'

type Props = {
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void
}
const ToggleSwitch = ({ label, checked, onChange }: Props) => {
    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">{label}</span>
            <button
                type="button"
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 ${checked ? 'bg-zinc-600' : 'bg-gray-200'
                    }`}
                role="switch"
                aria-checked={checked}
            >
                <span className="sr-only">Toggle Varian</span>
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-7' : 'translate-x-1'
                        }`}
                />
                {/* <span className={`absolute right-1 text-xs font-semibold ${checked ? 'text-white' : 'text-gray-500'}`}>
                    {checked ? 'AKTIF' : 'NON'}
                </span> */}
            </button>
        </div>
    );
};

export default ToggleSwitch