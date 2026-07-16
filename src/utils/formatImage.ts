export const formatImage = (image: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_MINIO_URL;

    if (!image) return;

    // Jika image diawali dengan "usahaku", kembalikan apa adanya (atau sesuai kebutuhan logika Anda)
    // Jika tidak, tambahkan baseUrl di depannya
    if (image.startsWith('usahaku')) {
        return baseUrl + image;
    }

    return image;
};