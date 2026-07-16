import dynamic from 'next/dynamic';
import React from 'react'
import Modal from '../Modal';
const MapWithSearch = dynamic(() => import('./MapWithSearch'), {
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
    openMapId: number | null
    setOpenMapId: (val: number | null) => void;
    updateAddress: (id: number | null, key: any, val: string | number) => void
    addresses: LocationItem[];
    dataAddress: LocationItem | null;
}

const ModalMaps = ({ openMapId, setOpenMapId, updateAddress, addresses, dataAddress }: Props) => {
    const selectedAddress = addresses.find(
        (item) => item.id === openMapId
    );
    return (
        <Modal
            open={openMapId ? true : false}
        // onClose={() => setOpenMapId(null)}

        >

            <div className='sm:w-lg'>
                <MapWithSearch onSelect={(lat, lng) => {
                    updateAddress(dataAddress?.id || openMapId, "lat", lat);
                    updateAddress(dataAddress?.id || openMapId, "lng", lng);
                    setOpenMapId(null);
                }}
                    lat={addresses[Number(openMapId) - 1]?.lat}
                    lng={addresses[Number(openMapId) - 1]?.lng} />
            </div>
        </Modal>
    )
}

export default ModalMaps