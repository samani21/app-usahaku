"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Map from "./Map";
type Props = {
    onSelect: (lat: number, lng: number) => void;
    lat: number;
    lng: number;
    // close: () => void
};

export default function MapWithSearch({ onSelect, lat, lng }: Props) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (lat != 0 && lng != 0) {
            setPosition([lat, lng])
        }
    }, [lat, lng])
    const searchLocation = (value: string) => {
        setLoading(true)
        setQuery(value);

        // Hapus timer sebelumnya
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        // Kalau kurang dari 3 karakter, hapus hasil dan jangan fetch
        if (value.length < 3) {
            setResults([]);
            return;
        }
        // Set timer baru (misal 700ms)
        typingTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${value}&format=json`,);
                const data = await res.json();
                setResults(data);
                setLoading(false)
            } catch (err) {
                // console.error("Error:", err);
                setLoading(false)
            }
        }, 700);
    };

    const selectLocation = (item: any) => {
        setPosition([parseFloat(item.lat), parseFloat(item.lon)]);
        setQuery(item.display_name);
        setResults([]);
    };

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center gap-2">
                <div className="relative w-full ">
                    <input
                        type="text"
                        placeholder="Cari lokasi..."
                        value={query}
                        onChange={(e) => searchLocation(e.target.value)}
                        className="border w-full p-2 rounded h-[38px]"
                    />
                    {results.length > 0 && (
                        <div className="absolute bg-white border rounded w-full mt-1 max-h-60 overflow-auto z-999999">
                            {results.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => selectLocation(item)}
                                >
                                    {item.display_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* <Button variant="outline" className="w-1/4" onClick={close} >
                    Batal
                </Button> */}
            </div>
            {/* MAP */}
            <div className="flex justify-center items-center w-full">
                {
                    loading ?
                        <div className="bg-black/10 w-full flex justify-center item-center">
                            <Loader2 className="animate-spin" size={120} />
                        </div> :
                        <Map position={position} onSelectPosition={setPosition} onSelect={onSelect} />
                }
            </div>

            {/* TAMPIL LAT & LONG */}
            {position && (
                <div className="p-2 border rounded bg-gray-50 text-sm">
                    <div>Latitude: {position[0]}</div>
                    <div>Longitude: {position[1]}</div>
                </div>
            )}
        </div>
    );

}
