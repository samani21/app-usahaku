"use client"

import { BusinessType } from "@/types/Admin/BusinessType";
import { OutletsType } from "@/types/Admin/OutletType";
import { AlertType } from "@/types/Alert";
import { CategoriesType } from "@/types/CategoriesType";
import { Get } from "@/utils/Get";
import { Post } from "@/utils/Post";
import { useCorrectPath } from "@/utils/useCorrectPath";
import { useEffect, useState } from "react";

// Bikin file terpisah: hooks/useBusinessProfile.ts
export const useBusinessProfile = () => {
    const [loadingButton, setLoadingButton] = useState<boolean>(false);

    const [openCrop, setOpenCrop] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        category: "Lainnya",
        verified: 1,
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isBusiness, setIsBusiness] = useState<boolean>(false);
    const [outlets, setOutlets] = useState<OutletsType[]>([]);

    // STATE DIPISAH SESUAI STRUKTUR DATABASE BARU
    const [planType, setPlanType] = useState<'trial' | 'premium'>('trial');
    const [planStatus, setPlanStatus] = useState<'active' | 'expired' | 'canceled'>('active');
    const [daysRemaining, setDaysRemaining] = useState<number>(0);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [categories, setCategories] = useState<CategoriesType[]>([]);
    const { getCorrectPath } = useCorrectPath();
    const handleChange = (key: any, value: string) => setForm((s) => ({ ...s, [key]: value }));

    useEffect(() => {
        getBusiness()
    }, [])
    const onLogoChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result as string);
            setOpenCrop(true);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            setLoadingButton(true);
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("slug", form.slug);
            if (form.description != '' || form.description != null) {
                formData.append("description", form.description);
            }
            formData.append("category", form.category);
            if (logoFile) formData.append("logo", logoFile);

            const res = await Post("client/business", formData);
            if (res) {
                if (!isBusiness) {
                    window.location.reload();
                }
                setLoadingButton(false)
                setShowAlert({
                    type: 'success',
                    message: 'Profil bisnis berhasil diperbarui!',
                    isOpen: true
                })
            }
        } catch (err: any) {
            setLoadingButton(false);
            setShowAlert({
                type: 'error',
                message: err.message,
                isOpen: true
            })
        }
    };

    const getBusiness = async () => {
        try {
            const res = await Get<{ success: boolean; data: { business: BusinessType, master_categories: CategoriesType[] } }>("client/business/show");
            if (res?.success) {
                const business = {
                    name: res?.data?.business?.name,
                    slug: res?.data?.business?.slug,
                    description: res?.data?.business?.description,
                    category: res?.data?.business?.category,
                    verified: res?.data?.business?.verified_status,
                }
                setOutlets(res?.data?.business?.outlet)
                setForm(business)
                setIsBusiness(true)
                setLogoPreview(res?.data?.business?.logo_url)
                if (res?.data?.business?.end_time) {
                    const endDate = new Date(res?.data?.business?.end_time);
                    const now = new Date();
                    const diffTime = endDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setDaysRemaining(diffDays > 0 ? diffDays : 0);
                }
                // MENGAMBIL DUA DATA TERPISAH DARI API
                setPlanType(res?.data?.business?.plan || 'trial');
                setPlanStatus(res?.data?.business?.subscription_status || 'active');
                setCategories(res?.data?.master_categories)
            }
        } catch (err: any) {
            console.log(err.message || "Gagal mengambil data");
        } finally {
            setLoading(false)
        }
    }

    const getCroppedImg = (imageSrc: string, crop: any) => {
        return new Promise<string>((resolve) => {
            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d")!;
                canvas.width = crop.width;
                canvas.height = crop.height;
                ctx.drawImage(
                    image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height
                );
                resolve(canvas.toDataURL("image/jpeg"));
            };
        });
    };
    return {
        loading, planStatus, planType, logoPreview, onLogoChange, form, isBusiness, getCorrectPath, loadingButton, handleSave, handleChange, categories, setIsSubscriptionModalOpen, daysRemaining, setOpenCrop, getCroppedImg, imageSrc, setLogoPreview, showAlert, isSubscriptionModalOpen, outlets, openCrop, setLogoFile, setShowAlert
    }
}