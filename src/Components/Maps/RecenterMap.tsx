import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type { LatLngTuple } from "leaflet";

export default function RecenterMap({ center }: { center: LatLngTuple }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(center);
    }, [center, map]);

    return null;
}
