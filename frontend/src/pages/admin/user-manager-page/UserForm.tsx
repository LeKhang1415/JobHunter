import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import type { UserResponseDto } from "@/types/user.type";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";

interface UserFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: UserFormData) => Promise<void>;
    initialData: UserResponseDto | null;
    onCloseForm: () => void;
    theme?: "blue" | "purple";
    roles?: Array<{ id: string; name: string }>;
}

export interface UserFormData {
    name?: string;
    email?: string;
    address?: string;
    gender?: string;
    roleId?: string;
}

export function UserForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    onCloseForm,
    theme = "blue",
    roles = [],
}: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        address: "",
        gender: "",
        roleId: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                address: initialData.address,
                gender: initialData.gender,
                roleId: initialData.role?.id || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                address: "",
                gender: "",
                roleId: "",
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({
                name: "",
                email: "",
                address: "",
                gender: "",
                roleId: "",
            });
            onOpenChange(false);
            onCloseForm?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Biểu mẫu thông tin người dùng
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {initialData
                            ? "Chỉnh sửa thông tin người dùng"
                            : "Thêm người dùng mới"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên người dùng{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            required
                            value={formData.name || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            placeholder="Nhập tên người dùng"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="email"
                            required
                            type="email"
                            value={formData.email || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            placeholder="Nhập email"
                            disabled={!!initialData}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Địa chỉ</Label>
                        <Input
                            id="address"
                            value={formData.address || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    address: e.target.value,
                                }))
                            }
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <Select
                            value={formData.gender || ""}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    gender: value,
                                }))
                            }
                        >
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Chọn giới tính" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {roles.length > 0 && (
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={formData.roleId || ""}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        roleId: value,
                                    }))
                                }
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Chọn role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className={`${theme === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {initialData ? "Lưu thay đổi" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
