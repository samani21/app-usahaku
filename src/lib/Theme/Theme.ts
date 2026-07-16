import React from 'react'
import { ThemeOne } from './ThemeOne';
import { ThemeType } from './type';
import { ThemeTwo } from './ThemeTwo';
import { ThemeThree } from './ThemeThree';
import { ThemeFour } from './ThemeFour';
import { ThemeFive } from './ThemeFive';
import { ThemeSix } from './ThemeSix';
import { ThemeSevent } from './ThemeSevent';
import { ThemeEight } from './ThemeEight';
import { ThemeNine } from './ThemeNine';
import { ThemeTen } from './ThemeTen';
import { ThemeEleven } from './ThemeEleven';
import { ThemeTwelve } from './ThemeTwelve';
import { ThemeThirteen } from './ThemeThirteen';
import { ThemeFourteen } from './ThemeFourteen';
import { ThemeFifteen } from './ThemeFifteen';
import { ThemeSixteen } from './ThemeSixteen';
import { ThemeSeventeen } from './ThemeSeventeen';
import { ThemeEighteen } from './ThemeEighteen';
import { ThemeNineteen } from './ThemeNineteen';
import { ThemeTwenty } from './ThemeTwenty';
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL + '/image_tema'

export const getThemeLayout = (theme: number) => {
    let layout: ThemeType | null = null

    switch (theme) {
        case 1:
            layout = ThemeOne;
            break;
        case 2:
            layout = ThemeTwo;
            break;
        case 3:
            layout = ThemeThree;
            break;
        case 4:
            layout = ThemeFour;
            break;
        case 5:
            layout = ThemeFive;
            break;
        case 6:
            layout = ThemeSix;
            break;
        case 7:
            layout = ThemeSevent;
            break;
        case 8:
            layout = ThemeEight;
            break;
        case 9:
            layout = ThemeNine;
            break;
        case 10:
            layout = ThemeTen;
            break;
        case 11:
            layout = ThemeEleven;
            break;
        case 12:
            layout = ThemeTwelve;
            break;
        case 13:
            layout = ThemeThirteen;
            break;
        case 14:
            layout = ThemeFourteen;
            break;
        case 15:
            layout = ThemeFifteen;
            break;
        case 16:
            layout = ThemeSixteen;
            break;
        case 17:
            layout = ThemeSeventeen;
            break;
        case 18:
            layout = ThemeEighteen;
            break;
        case 19:
            layout = ThemeNineteen;
            break;
        case 20:
            layout = ThemeTwenty;
            break;
    }
    const data = {
        "success": true,
        "message": "Data ditemukan",
        "data": {
            "header": {
                "id": 1,
                "business_id": 1,
                "layout_header": layout?.header?.layout,
                "color": layout?.color,
                "span_one": "Toko",
                "span_two": "Sepatu",
                "logo": `${baseUrl}/69f89b8247c0c.webp`,
                "type_frame": "circle",
                "color_frame": "dark",
                "mode": layout?.header?.mode,
                "created_at": "2026-05-04T13:13:38.000000Z",
                "updated_at": "2026-06-15T12:40:54.000000Z"
            },
            "hero": {
                "id": 1,
                "business_id": 1,
                "layout_hero": layout?.hero?.layout,
                "color": layout?.color,
                "image": `${baseUrl}/69f89be38d4d5.webp`,
                "title": "Rekomendasi Hari Ini",
                "headline": "PRODUK TERBAIK KAMI",
                "sub_headline": "Kualitas premium dengan harga yang sangat terjangkau khusus untuk Anda.",
                "cta": "Pesan Sekarang",
                "mode": layout?.hero?.mode,
                "created_at": "2026-05-04T13:15:15.000000Z",
                "updated_at": "2026-06-15T12:37:25.000000Z"
            },
            "category": {
                "id": 1,
                "business_id": 1,
                "layout_categories": layout?.category?.layout,
                "color": layout?.color,
                "mode": layout?.category?.mode,
                "created_at": "2026-05-04T13:17:29.000000Z",
                "updated_at": "2026-06-15T12:37:20.000000Z"
            },
            "product": {
                "id": 1,
                "business_id": 1,
                "layout_products": layout?.product?.layout,
                "color": layout?.color,
                "mode": layout?.product?.mode,
                "created_at": "2026-05-04T13:21:42.000000Z",
                "updated_at": "2026-06-15T12:37:15.000000Z"
            },
            "summary": {
                "id": 1,
                "business_id": 1,
                "layout_summary": layout?.summary?.layout,
                "color": layout?.color,
                "mode": layout?.summary?.mode,
                "created_at": "2026-05-04T13:22:14.000000Z",
                "updated_at": "2026-06-15T12:37:10.000000Z"
            },
            "products": [
                {
                    "id": 1,
                    "business_id": 1,
                    "name": "Produk 1",
                    "product_category_id": 3,
                    "slug": "produk-1",
                    "description": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
                    "price": 750000,
                    "image": `${baseUrl}/69f72ea48c103.webp`,
                    "qrcode": "usahaku-qrcodes-69f72ea4ceace.webp",
                    "has_variant": 0,
                    "is_active": 1,
                    "is_qty": 1,
                    "created_at": "2026-05-03T11:16:52.000000Z",
                    "updated_at": "2026-05-04T12:30:15.000000Z",
                    "category": "Under Armour ",
                    "product_stock": 0,
                    "stock": 10,
                    "discount_price": 100000,
                    "final_price": 650000,
                    "promo": {
                        "id": 5,
                        "business_id": 1,
                        "product_id": 1,
                        "name_promo": "Promo",
                        "value": 100000,
                        "type": "nominal",
                        "is_global": 1,
                        "status": 1,
                        "start_date": null,
                        "end_date": null,
                        "created_at": "2026-05-04T11:31:58.000000Z",
                        "updated_at": "2026-05-04T11:31:58.000000Z"
                    },
                    "current_stock": {
                        "id": 15,
                        "outlet_id": 1,
                        "product_id": 1,
                        "product_variant_id": null,
                        "stock": 10,
                        "created_at": "2026-05-30T14:22:36.000000Z",
                        "updated_at": "2026-05-30T14:23:22.000000Z"
                    },
                    "variants": []
                },
                {
                    "id": 2,
                    "business_id": 1,
                    "name": "Produk 2",
                    "product_category_id": 5,
                    "slug": "produk-2",
                    "description": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
                    "price": 1000000,
                    "image": `${baseUrl}/69f72edd6cba5.webp`,
                    "qrcode": "usahaku-qrcodes-69f72eddc465c.webp",
                    "has_variant": 1,
                    "is_active": 1,
                    "is_qty": 1,
                    "created_at": "2026-05-03T11:17:49.000000Z",
                    "updated_at": "2026-05-03T11:18:33.000000Z",
                    "category": "Fila",
                    "product_stock": 18,
                    "stock": 34,
                    "discount_price": 120000,
                    "percent_discount": 12,
                    "final_price": 900000,
                    "promo": {
                        "id": 7,
                        "business_id": 1,
                        "product_id": 2,
                        "name_promo": "Promo Awal bulan",
                        "value": 12,
                        "type": "percentage",
                        "is_global": 0,
                        "status": 1,
                        "start_date": null,
                        "end_date": null,
                        "created_at": "2026-05-31T01:07:08.000000Z",
                        "updated_at": "2026-05-31T01:07:08.000000Z"
                    },
                    "current_stock": null,
                    "variants": [
                        {
                            "id": 1,
                            "product_id": 2,
                            "name": "41",
                            "price": 1000000,
                            "image": null,
                            "is_active": 1,
                            "created_at": "2026-05-03T11:17:49.000000Z",
                            "updated_at": "2026-05-03T11:17:49.000000Z",
                            "product_variant_stock": 9,
                            "percent_discount": 12,
                            "discount_price": 120000,
                            "final_price": 880000,
                            "promo": {
                                "id": 7,
                                "product_promo_history_id": 7,
                                "product_variant_id": 1,
                                "value": 12,
                                "created_at": "2026-05-31T01:07:08.000000Z",
                                "updated_at": "2026-05-31T01:07:08.000000Z"
                            },
                            "current_stock": {
                                "id": 16,
                                "outlet_id": 1,
                                "product_id": 2,
                                "product_variant_id": 1,
                                "stock": 20,
                                "created_at": "2026-05-30T14:24:33.000000Z",
                                "updated_at": "2026-05-30T14:24:33.000000Z"
                            }
                        },
                        {
                            "id": 2,
                            "product_id": 2,
                            "name": "42",
                            "price": 1000000,
                            "image": null,
                            "is_active": 1,
                            "created_at": "2026-05-03T11:17:49.000000Z",
                            "updated_at": "2026-05-03T11:17:49.000000Z",
                            "product_variant_stock": 9,
                            "percent_discount": 10,
                            "discount_price": 100000,
                            "final_price": 900000,
                            "promo": {
                                "id": 8,
                                "product_promo_history_id": 7,
                                "product_variant_id": 2,
                                "value": 10,
                                "created_at": "2026-05-31T01:07:08.000000Z",
                                "updated_at": "2026-05-31T01:07:08.000000Z"
                            },
                            "current_stock": {
                                "id": 17,
                                "outlet_id": 1,
                                "product_id": 2,
                                "product_variant_id": 2,
                                "stock": 14,
                                "created_at": "2026-05-30T14:24:48.000000Z",
                                "updated_at": "2026-05-30T14:24:48.000000Z"
                            }
                        }
                    ]
                },
                {
                    "id": 3,
                    "business_id": 1,
                    "name": "Produk 3",
                    "product_category_id": 3,
                    "slug": "produk-3",
                    "description": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
                    "price": 1500000,
                    "image": `${baseUrl}/69f72f58ad141.webp`,
                    "qrcode": "usahaku-qrcodes-69f72f5915fef.webp",
                    "has_variant": 0,
                    "is_active": 1,
                    "is_qty": 1,
                    "created_at": "2026-05-03T11:19:52.000000Z",
                    "updated_at": "2026-05-03T11:20:01.000000Z",
                    "category": "Under Armour ",
                    "product_stock": 22,
                    "stock": 22,
                    "discount_price": 450000,
                    "percent_discount": 30,
                    "final_price": 1050000,
                    "promo": {
                        "id": 6,
                        "business_id": 1,
                        "product_id": 3,
                        "name_promo": "Promo",
                        "value": 30,
                        "type": "percentage",
                        "is_global": 1,
                        "status": 1,
                        "start_date": null,
                        "end_date": null,
                        "created_at": "2026-05-04T12:40:18.000000Z",
                        "updated_at": "2026-05-04T12:40:18.000000Z"
                    },
                    "current_stock": {
                        "id": 20,
                        "outlet_id": 2,
                        "product_id": 3,
                        "product_variant_id": null,
                        "stock": 22,
                        "created_at": "2026-05-30T14:25:49.000000Z",
                        "updated_at": "2026-05-30T14:25:49.000000Z"
                    },
                    "variants": []
                },
                {
                    "id": 4,
                    "business_id": 1,
                    "name": "Produk 4",
                    "product_category_id": 4,
                    "slug": "produk-4",
                    "description": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
                    "price": 1750000,
                    "image": `${baseUrl}/69f72f77b50cd.webp`,
                    "qrcode": "usahaku-qrcodes-69f72f780e301.webp",
                    "has_variant": 1,
                    "is_active": 1,
                    "is_qty": 1,
                    "created_at": "2026-05-03T11:20:23.000000Z",
                    "updated_at": "2026-05-03T11:21:40.000000Z",
                    "category": "Nike",
                    "product_stock": 1,
                    "stock": 31,
                    "discount_price": 0,
                    "final_price": 1750000,
                    "promo": null,
                    "current_stock": null,
                    "variants": [
                        {
                            "id": 3,
                            "product_id": 4,
                            "name": "41",
                            "price": 1750000,
                            "image": null,
                            "is_active": 1,
                            "created_at": "2026-05-03T11:21:40.000000Z",
                            "updated_at": "2026-05-03T11:21:40.000000Z",
                            "product_variant_stock": 1,
                            "discount_price": 0,
                            "final_price": 1750000,
                            "promo": null,
                            "current_stock": {
                                "id": 18,
                                "outlet_id": 1,
                                "product_id": 4,
                                "product_variant_id": 3,
                                "stock": 10,
                                "created_at": "2026-05-30T14:25:13.000000Z",
                                "updated_at": "2026-05-30T14:25:13.000000Z"
                            }
                        },
                        {
                            "id": 4,
                            "product_id": 4,
                            "name": "43",
                            "price": 1800000,
                            "image": null,
                            "is_active": 1,
                            "created_at": "2026-05-03T11:21:40.000000Z",
                            "updated_at": "2026-05-03T11:21:40.000000Z",
                            "product_variant_stock": 0,
                            "discount_price": 0,
                            "final_price": 1800000,
                            "promo": null,
                            "current_stock": {
                                "id": 19,
                                "outlet_id": 1,
                                "product_id": 4,
                                "product_variant_id": 4,
                                "stock": 21,
                                "created_at": "2026-05-30T14:25:24.000000Z",
                                "updated_at": "2026-05-30T14:25:24.000000Z"
                            }
                        },
                        {
                            "id": 5,
                            "product_id": 4,
                            "name": "40",
                            "price": 1750000,
                            "image": null,
                            "is_active": 1,
                            "created_at": "2026-05-03T11:21:40.000000Z",
                            "updated_at": "2026-05-03T11:21:40.000000Z",
                            "product_variant_stock": 0,
                            "discount_price": 0,
                            "final_price": 1750000,
                            "promo": null,
                            "current_stock": null
                        }
                    ]
                },
                {
                    "id": 5,
                    "business_id": 1,
                    "name": "Produk 4",
                    "product_category_id": 5,
                    "slug": "produk-4-1",
                    "description": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
                    "price": 2000000,
                    "image": `${baseUrl}/69f72f8f6c945.webp`,
                    "qrcode": "usahaku-qrcodes-69f72f8fb6153.webp",
                    "has_variant": 0,
                    "is_active": 1,
                    "is_qty": 1,
                    "created_at": "2026-05-03T11:20:47.000000Z",
                    "updated_at": "2026-05-03T11:20:47.000000Z",
                    "category": "Fila",
                    "product_stock": 0,
                    "stock": 0,
                    "discount_price": 0,
                    "final_price": 2000000,
                    "promo": null,
                    "current_stock": null,
                    "variants": []
                },
                {
                    "id": 6,
                    "business_id": 1,
                    "name": "Produk 5",
                    "product_category_id": 2,
                    "slug": "produk-5",
                    "description": "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
                    "price": 3000000,
                    "image": `${baseUrl}/69f72fa3a0895.webp`,
                    "qrcode": "usahaku-qrcodes-69f72fa3efb4c.webp",
                    "has_variant": 0,
                    "is_active": 1,
                    "is_qty": 1,
                    "created_at": "2026-05-03T11:21:07.000000Z",
                    "updated_at": "2026-05-03T11:21:07.000000Z",
                    "category": "Adidas",
                    "product_stock": 0,
                    "stock": 0,
                    "discount_price": 0,
                    "final_price": 3000000,
                    "promo": null,
                    "current_stock": null,
                    "variants": []
                }
            ],
            "categories": [
                {
                    "id": 2,
                    "business_id": 1,
                    "name": "Adidas",
                    "icon": "simple-icons:adidas",
                    "color": "#2C3E50",
                    "created_at": "2026-05-03T05:29:16.000000Z",
                    "updated_at": "2026-05-03T05:29:16.000000Z",
                    "count": 1
                },
                {
                    "id": 3,
                    "business_id": 1,
                    "name": "Under Armour ",
                    "icon": "arcticons:under-armour",
                    "color": "#2C3E50",
                    "created_at": "2026-05-03T05:29:33.000000Z",
                    "updated_at": "2026-05-03T05:29:33.000000Z",
                    "count": 2
                },
                {
                    "id": 4,
                    "business_id": 1,
                    "name": "Nike",
                    "icon": `${baseUrl}/6a2cc2d9b0402.webp`,
                    "color": null,
                    "created_at": "2026-05-03T05:29:50.000000Z",
                    "updated_at": "2026-06-13T02:39:22.000000Z",
                    "count": 1
                },
                {
                    "id": 5,
                    "business_id": 1,
                    "name": "Fila",
                    "icon": `${baseUrl}/6a2cbf872548d.webp`,
                    "color": null,
                    "created_at": "2026-05-03T05:30:27.000000Z",
                    "updated_at": "2026-06-13T02:25:11.000000Z",
                    "count": 2
                }
            ]
        }
    }
    return data
}