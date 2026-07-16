"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { useEffect, useState } from "react";
import RecenterMap from "./RecenterMap";

// Fix icon leaflet tidak muncul
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],     // 🔥 biar tepat di ujung pin
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

type LocationItem = {
    id: number;
    lat: number;
    lng: number;
    name: string;
    address: string;
};



type Props = {
    data: LocationItem[];
};

export default function MultiPinMap({ data }: Props) {
    const [center, setCenter] = useState<LatLngTuple>([-6.2, 106.816666]);
    console.log('data', center)
    // Update center setiap kali data berubah
    useEffect(() => {
        if (data && data.length > 0) {
            setCenter([data[0].lat, data[0].lng]);
        }
    }, [data]);
    return (
        <div className="w-full h-96 rounded overflow-hidden">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                style={{ width: "100%", height: "100%" }}
            >
                <RecenterMap center={center} />
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {data.map((item) => (
                    <Marker key={item.id} position={[item.lat, item.lng]}>
                        <Popup>
                            <div>
                                <strong>ID:</strong> {item.id} <br />
                                <strong>Value:</strong> {item.address}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
