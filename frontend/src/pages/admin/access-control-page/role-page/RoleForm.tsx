import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import type { DefaultPermissionResponseDto } from "@/types/permission.type";
import type {
    DefaultRoleRequestDto,
    DefaultRoleResponseDto,
} from "@/types/role.type";
import { findPermissionsByRoleId } from "@/services/permissionApi";

interface RoleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: DefaultRoleRequestDto, id?: string) => void;
    initialData: DefaultRoleResponseDto | null;
    onCloseForm: () => void;
    permissions: DefaultPermissionResponseDto[];
}

const METHOD_COLORS: Record<string, string> = {
    GET: "bg-green-500",
    POST: "bg-blue-500",
    PATCH: "bg-yellow-500",
    DELETE: "bg-red-500",
};

export function RoleForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    onCloseForm,
    permissions,
}: RoleFormProps) {
    const getMethodColor = (method: string): string => {
        const color = METHOD_COLORS[method.toUpperCase()];
        return `${color ? color : "bg-gray-500"}`;
    };

    const [formData, setFormData] = useState<DefaultRoleRequestDto>({
        name: "",
        description: "",
        active: true,
        permissionIds: [],
    });

    const [expandedModules, setExpandedModules] = useState<Set<string>>(
        new Set(),
    );
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);

    useEffect(() => {
        const fetchRoleData = async () => {
            if (initialData) {
                setFormData({
                    name: initialData.name,
                    description: initialData.description,
                    active: initialData.active,
                    permissionIds: [],
                });

                if (initialData.id) {
                    setIsLoadingPermissions(true);
                    try {
                        const response = await findPermissionsByRoleId(
                            initialData.id,
                        );
                        const fetchedPermissions =
                            response.data.result || response.data;

                        setFormData((prev) => ({
                            ...prev,
                            permissionIds: Array.isArray(fetchedPermissions)
                                ? fetchedPermissions.map((p: any) => p.id)
                                : [],
                        }));
                    } catch (error) {
                        console.error("Lỗi khi tải danh sách quyền:", error);
                    } finally {
                        setIsLoadingPermissions(false);
                    }
                }
            } else {
                setFormData({
                    name: "",
                    description: "",
                    active: true,
                    permissionIds: [],
                });
            }
        };

        if (open) {
            fetchRoleData();
        }
    }, [initialData, open]);

    const groupedPermissions = useMemo(() => {
        return permissions.reduce(
            (acc, permission) => {
                if (!acc[permission.module]) {
                    acc[permission.module] = [];
                }
                acc[permission.module].push(permission);
                return acc;
            },
            {} as Record<string, DefaultPermissionResponseDto[]>,
        );
    }, [permissions]);

    const toggleModule = (module: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(module)) {
            newExpanded.delete(module);
        } else {
            newExpanded.add(module);
        }
        setExpandedModules(newExpanded);
    };

    const isPermissionSelected = (permissionId: string) => {
        return formData.permissionIds.includes(permissionId);
    };

    const togglePermission = (permissionId: string) => {
        setFormData((prev) => {
            const isSelected = prev.permissionIds.includes(permissionId);
            return {
                ...prev,
                permissionIds: isSelected
                    ? prev.permissionIds.filter((id) => id !== permissionId)
                    : [...prev.permissionIds, permissionId],
            };
        });
    };

    const isDefaultRoleName = useMemo(
        () => initialData?.name === "USER" || initialData?.name === "ADMIN",
        [initialData],
    );

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);

        // Reset form
        setFormData({
            name: "",
            description: "",
            active: true,
            permissionIds: [],
        });
        onOpenChange(false);
        onCloseForm?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex !h-5/6 !max-h-none !w-full !max-w-none flex-col bg-white lg:!w-2/3">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Biểu mẫu thông tin chức vụ
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {initialData ? "Chỉnh sửa chức vụ" : "Thêm chức vụ mới"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-hidden">
                    <form
                        onSubmit={handleSubmit}
                        className="flex h-full flex-col space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Tên chức vụ{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    disabled={isDefaultRoleName}
                                />
                                {isDefaultRoleName && (
                                    <span className="text-sm text-red-600 italic">
                                        Chức vụ mặc định không được phép đổi tên
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Mô tả{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="description"
                                    required
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    disabled={isDefaultRoleName}
                                />
                                {isDefaultRoleName && (
                                    <span className="text-sm text-red-600 italic">
                                        Chức vụ mặc định không được phép đổi mô
                                        tả
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <Switch
                                    id="active"
                                    checked={formData.active}
                                    onCheckedChange={(checked) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            active: checked,
                                        }))
                                    }
                                />
                                <Label htmlFor="active">
                                    Hoạt động{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                            </div>
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <Label className="text-base font-medium">
                                        Quyền hạn{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        Chọn các quyền hạn cho chức vụ này
                                    </p>
                                </div>
                                {isLoadingPermissions && (
                                    <div className="flex items-center text-sm text-blue-600">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang tải quyền...
                                    </div>
                                )}
                            </div>

                            <div
                                className={`flex-1 overflow-y-auto rounded-lg border bg-gray-50/50 p-4 transition-opacity ${isLoadingPermissions ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                            >
                                <div className="space-y-3">
                                    {Object.entries(groupedPermissions).map(
                                        ([module, modulePermissions]) => (
                                            <Collapsible
                                                key={module}
                                                open={expandedModules.has(
                                                    module,
                                                )}
                                                onOpenChange={() =>
                                                    toggleModule(module)
                                                }
                                                className="rounded-lg border bg-white shadow-sm"
                                            >
                                                <CollapsibleTrigger className="hover:bg-muted/30 flex w-full items-center justify-between rounded-t-lg p-4 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {expandedModules.has(
                                                            module,
                                                        ) ? (
                                                            <ChevronDown className="h-4 w-4 text-blue-600" />
                                                        ) : (
                                                            <ChevronRight className="h-4 w-4 text-blue-600" />
                                                        )}
                                                        <span className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                                                            {module}
                                                        </span>
                                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                                            {
                                                                modulePermissions.length
                                                            }
                                                        </span>
                                                    </div>
                                                </CollapsibleTrigger>

                                                <CollapsibleContent className="px-4 pb-4">
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {modulePermissions.map(
                                                            (permission) => (
                                                                <div
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border bg-white p-3 transition-colors"
                                                                >
                                                                    <div className="min-w-0 flex-1 pr-3">
                                                                        <div className="mb-2 text-sm font-medium truncate">
                                                                            {
                                                                                permission.name
                                                                            }
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span
                                                                                className={`rounded-full px-2 py-1 text-center text-xs font-medium text-white ${getMethodColor(permission.method)}`}
                                                                            >
                                                                                {
                                                                                    permission.method
                                                                                }
                                                                            </span>
                                                                            <span
                                                                                className="text-muted-foreground truncate font-mono text-xs"
                                                                                title={
                                                                                    permission.apiPath
                                                                                }
                                                                            >
                                                                                {
                                                                                    permission.apiPath
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <Switch
                                                                        checked={isPermissionSelected(
                                                                            permission.id,
                                                                        )}
                                                                        onCheckedChange={() =>
                                                                            togglePermission(
                                                                                permission.id,
                                                                            )
                                                                        }
                                                                        className="flex-shrink-0"
                                                                    />
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={isLoadingPermissions}
                            >
                                {isLoadingPermissions
                                    ? "Đang xử lý..."
                                    : initialData
                                      ? "Lưu thay đổi"
                                      : "Thêm"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
