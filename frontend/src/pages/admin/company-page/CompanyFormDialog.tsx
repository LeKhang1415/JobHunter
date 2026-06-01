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

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData, id?: string) => Promise<unknown>;
    initialData?: DefaultCompanyResponseDto | null;
}

export default function CompanyFormDialog({
    open,
    onClose,
    onSubmit,
    initialData,
}: Props) {
    const isEdit = !!initialData;

    const [formData, setFormData] = useState<CreateCompanyRequestDto>({
        name: "",
        description: "",
        address: "",
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>("");

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
    }, [initialData]);

    const handleChange = (
        field: keyof CreateCompanyRequestDto,
        value: string,
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoFile(file);

        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("description", formData.description);
        submitData.append("address", formData.address);

        if (logoFile) {
            submitData.append("logo", logoFile);
        }

        await onSubmit(submitData, initialData?.id);
        onClose();
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
                            required
                        />
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
                            required
                        />
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
                    </div>

                    {/* Logo */}
                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleChangeLogo}
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
                        >
                            Hủy
                        </Button>
                        <Button type="submit">
                            {isEdit ? "Lưu thay đổi" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
