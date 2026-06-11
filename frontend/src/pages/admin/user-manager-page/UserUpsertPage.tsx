import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { UserResponseDto } from "@/types/user.type";
import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { toast } from "sonner";
import { getUserById, updateUser } from "@/services/userApi";
import { findAllRolesWithoutPagination as fetchRoles } from "@/services/roleApi";

interface Role {
    id: string;
    name: string;
}

export default function UserUpsertPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("id");

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);

    const [user, setUser] = useState<UserResponseDto | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        gender: "",
        roleId: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch roles
    useEffect(() => {
        const fetchRolesList = async () => {
            try {
                const res = (await fetchRoles()).data.result;
                setRoles(res);
            } catch (err) {
                console.log(
                    getErrorMessage(err, "Không thể lấy danh sách vai trò."),
                );
            }
        };

        fetchRolesList();
    }, []);

    // Fetch user data
    useEffect(() => {
        if (!userId) {
            toast.error("Không tìm thấy người dùng");
            navigate("/admin/user-manager");
            return;
        }

        const fetchUserData = async () => {
            setIsFetching(true);
            try {
                const res = (await getUserById(userId)).data.result;
                setUser(res);
                setFormData({
                    name: res.name,
                    email: res.email,
                    address: res.address || "",
                    gender: res.gender || "",
                    roleId: res.role?.id || "",
                });
            } catch (err) {
                toast.error(
                    getErrorMessage(err, "Không tìm thấy người dùng này"),
                );
                navigate("/admin/user-manager");
            } finally {
                setIsFetching(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên người dùng là bắt buộc";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Địa chỉ là bắt buộc";
        }
        if (!formData.gender) {
            newErrors.gender = "Giới tính là bắt buộc";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!userId) {
            toast.error("Không tìm thấy ID người dùng");
            return;
        }

        setIsLoading(true);
        try {
            await updateUser(userId, {
                name: formData.name,
                address: formData.address,
                gender: formData.gender,
                roleId: formData.roleId || undefined,
            });

            toast.success("Cập nhật người dùng thành công");
            navigate("/admin/user-manager");
        } catch (err) {
            toast.error(getErrorMessage(err, "Cập nhật người dùng thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/admin/user-manager");
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={handleBack}
                            className="cursor-pointer"
                        >
                            Quản lý người dùng
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chỉnh sửa người dùng</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Chỉnh sửa người dùng</h1>
                    <p className="text-muted-foreground">
                        Cập nhật thông tin người dùng: {user.name}
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1 - Name & Email */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tên người dùng{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Nhập tên người dùng..."
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        errors.name ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {errors.name && (
                                    <span className="text-xs text-red-500">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Email không thể thay đổi
                                </p>
                            </div>
                        </div>

                        {/* Row 2 - Address & Gender */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="address">
                                    Địa chỉ{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    placeholder="Nhập địa chỉ..."
                                    value={formData.address}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "address",
                                            e.target.value,
                                        )
                                    }
                                    className={
                                        errors.address ? "border-red-500" : ""
                                    }
                                    required
                                />
                                {errors.address && (
                                    <span className="text-xs text-red-500">
                                        {errors.address}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">
                                    Giới tính{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) =>
                                        handleInputChange("gender", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">
                                            Nam
                                        </SelectItem>
                                        <SelectItem value="female">
                                            Nữ
                                        </SelectItem>
                                        <SelectItem value="other">
                                            Khác
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <span className="text-xs text-red-500">
                                        {errors.gender}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Role Selection */}
                        {roles.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    Vai trò{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={formData.roleId}
                                    onValueChange={(value) =>
                                        handleInputChange("roleId", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn vai trò" />
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

                        {/* User Metadata */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4 border-t">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Ngày tạo
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(
                                        user.createdAt instanceof Date
                                            ? user.createdAt
                                            : user.createdAt,
                                    ).toLocaleString("vi-VN")}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Cập nhật lần cuối
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(
                                        user.updatedAt instanceof Date
                                            ? user.updatedAt
                                            : user.updatedAt,
                                    ).toLocaleString("vi-VN")}
                                </p>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleBack}>
                    Hủy
                </Button>
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
            </div>
        </div>
    );
}
