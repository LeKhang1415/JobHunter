import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/custom/RichText/RichTextEditor";
import type {
    CreateCompanyRequestDto,
    DefaultCompanyResponseDto,
} from "@/types/company.type";
import { saveSelfCompany, updateSelfCompany } from "@/services/companyApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit?: () => void;
    initialData?: DefaultCompanyResponseDto | null;
}

export default function CompanyFormDialog({
    open,
    onClose,
    onSubmit,
    initialData,
}: Props) {
    const isEdit = !!initialData;
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<CreateCompanyRequestDto>({
        name: "",
        description: "",
        address: "",
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                address: initialData.address,
            });
            setLogoPreview(initialData.logoUrl || "");
        } else {
            setFormData({ name: "", description: "", address: "" });
            setLogoPreview("");
        }
        setLogoFile(null);
        setErrors({});
    }, [initialData, open]);

    const handleChange = (
        field: keyof CreateCompanyRequestDto,
        value: string,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoFile(file);

        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên công ty là bắt buộc";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Địa chỉ là bắt buộc";
        }
        if (!formData.description.trim()) {
            newErrors.description = "Mô tả là bắt buộc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("description", formData.description);
            submitData.append("address", formData.address);

            if (logoFile) {
                submitData.append("logo", logoFile);
            }

            if (isEdit && initialData?.id) {
                await updateSelfCompany(initialData.id, submitData);
                toast.success("Cập nhật công ty thành công");
            } else {
                await saveSelfCompany(submitData);
                toast.success("Thêm công ty thành công");
            }

            onClose();
            onSubmit?.();
        } catch (error) {
            console.error("Error submitting company form:", error);
            toast.error(isEdit ? "Cập nhật công ty thất bại" : "Thêm công ty thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px] bg-white z-50">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isEdit ? "Chỉnh sửa công ty" : "Thêm công ty mới"}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Vui lòng nhập đầy đủ thông tin bên dưới
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label>
                            Tên công ty <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                                handleChange("name", e.target.value)
                            }
                            placeholder="Nhập tên công ty..."
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label>
                            Địa chỉ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            value={formData.address}
                            onChange={(e) =>
                                handleChange("address", e.target.value)
                            }
                            placeholder="Nhập địa chỉ công ty..."
                            disabled={isLoading}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>
                            Mô tả <span className="text-red-500">*</span>
                        </Label>
                        <RichTextEditor
                            value={formData.description}
                            onChange={(value) =>
                                handleChange("description", value)
                            }
                            placeholder="Nhập mô tả công ty..."
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Logo */}
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleChangeLogo}
                            disabled={isLoading}
                        />

                        {logoPreview && (
                            <div className="mt-2">
                                <img
                                    src={logoPreview}
                                    alt="Logo preview"
                                    className="h-16 rounded border object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? "Lưu thay đổi" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

