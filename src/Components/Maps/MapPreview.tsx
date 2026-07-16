
import dynamic from 'next/dynamic';
import React from 'react'
const MultiPinMap = dynamic(() => import('./MultiPinMap'), {
    ssr: false,
});
type LocationItem = {
    id: number;
    lat: number;
    lng: number;
    name: string;
    address: string;
};

type Props = {
    addresses: LocationItem[];
}

const MapPreview = ({ addresses }: Props) => {
    return (
        <main className="sm:p-6">
            <MultiPinMap data={addresses} />
        </main>
    );
}

export default MapPreview