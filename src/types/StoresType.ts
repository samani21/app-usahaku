import { BusinessType } from "./Admin/BusinessType";

export interface StoresType {
    address: string,
    business: {
        banner_url: string,
        category: string,
        description: string,
        end_time: string,
        logo: string,
        name: string,
        plan: string,
        slug: string,
        start_time: string,
        verified_status: number,
        id?: number,
    },
    day_close: string,
    day_open: string,
    distance: number,
    lat: number,
    lng: number,
    id: number,
    name: string,
    time_close: string,
    time_open: string,
}

