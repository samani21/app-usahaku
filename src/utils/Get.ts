// utils/Get.ts
import { apiClient } from "./apiClient";
import { getToken } from "./loclstorange";
import { AxiosRequestConfig } from "axios"; // Hapus baris ini jika Anda tidak menggunakan TypeScript ketat

// Tambahkan parameter ke-2 (config) untuk menerima options seperti 'signal'
export async function Get<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const token = getToken();

    try {
        // Teruskan config (termasuk signal dari AbortController) ke apiClient
        const response = await apiClient.get<T>(path, config);
        return response.data;
    } catch (error: any) {
        // Tangkap error akibat pembatalan request (AbortController) agar tidak dianggap sebagai error sistem
        if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED' || error.message === 'canceled') {
            return Promise.reject({
                isCanceled: true,
                message: 'Request canceled by user or system',
                raw: error
            });
        }

        // Jika token tidak ada, auto logout
        // if (!token) {
        //     window.location.href = '/auth/login';
        //     return Promise.reject(error);
        // }

        // Kembalikan langsung error Axios tanpa mengubah jadi Error runtime
        return Promise.reject({
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            raw: error
        });
    }
}