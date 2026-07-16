"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";

// FIX marker icon hilang
delete (L.Icon.Default.prototype as any)._getIconUrl;

const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],   // 🔥 INI YANG MEMBUAT TEPAT DI UJUNG PIN
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
    position: [number, number] | null;
    onSelectPosition?: (pos: [number, number]) => void;
    onSelect: (lat: number, lng: number) => void;
};

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 18);
    }, [center]);
    return null;
}

export default function Map({ position, onSelectPosition, onSelect }: Props) {
    const center = position ?? [-6.2, 106.816666]; // default Jakarta

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const lat = e.latlng.lat;
                const lon = e.latlng.lng;
                onSelectPosition?.([lat, lon]);
                onSelect?.(lat, lon);

            },
        });
        return null;
    }

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <MapClickHandler />

            {position && (
                <>
                    <ChangeView center={position} />
                    <Marker position={position} />
                </>
            )}
        </MapContainer>
    );
}
