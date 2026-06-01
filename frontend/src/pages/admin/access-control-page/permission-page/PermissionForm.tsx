import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    METHODS,
    MODULES,
    type DefaultPermissionRequestDto,
    type DefaultPermissionResponseDto,
} from "@/types/permission.type";

const METHOD_COLORS: Record<string, string> = {
    GET: "bg-green-500",
    POST: "bg-blue-500",
    PUT: "bg-yellow-500",
    DELETE: "bg-red-500",
};

interface PermissionFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: DefaultPermissionRequestDto, id?: string) => void;
    initialData?: DefaultPermissionResponseDto | null;
    onCloseForm?: () => void;
}

export function PermissionForm({
    open,
    onOpenChange,
    onSubmit,
    initialData,
    onCloseForm,
}: PermissionFormProps) {
    const [formData, setFormData] = useState<DefaultPermissionRequestDto>({
        name: "",
        apiPath: "",
        method: "",
        module: "",
    });

    useEffect(() => {
        if (initialData)
            setFormData({
                name: initialData.name,
                apiPath: initialData.apiPath,
                method: initialData.method,
                module: initialData.module,
            });
        else setFormData({ name: "", apiPath: "", method: "", module: "" });
    }, [initialData]);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);
        setFormData({ name: "", apiPath: "", method: "", module: "" });
        onOpenChange(false);
        onCloseForm?.();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        Biểu mẫu quyền hạn API
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {initialData
                            ? "Chỉnh sửa quyền hạn"
                            : "Thêm quyền hạn mới"}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Tên quyền <span className="text-red-500">*</span>
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
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="apiPath">
                            API Path <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="apiPath"
                            required
                            value={formData.apiPath}
                            placeholder="/users, /auth/login..."
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    apiPath: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Phương thức <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {METHODS.map((m) => (
                                <Badge
                                    key={m}
                                    className={`cursor-pointer px-2 py-1 text-base transition select-none ${METHOD_COLORS[m]} ${formData.method === m ? "scale-105 ring-2 ring-blue-500" : "opacity-60 hover:opacity-100"} `}
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            method: m,
                                        }))
                                    }
                                >
                                    {m}
                                </Badge>
                            ))}
                        </div>
                        {/* Báo lỗi nếu chưa chọn method */}
                        {!formData.method && (
                            <span className="text-xs text-red-500">
                                Vui lòng chọn phương thức
                            </span>
                        )}
                    </div>
                    {/* Module */}
                    <div className="space-y-2">
                        <Label>
                            Module <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.module}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    module: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn module" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {MODULES.map((mod) => (
                                    <SelectItem key={mod} value={mod}>
                                        {mod}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
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
                            disabled={!formData.method}
                        >
                            {initialData ? "Lưu thay đổi" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
