import { Edit, KeyRound, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/custom/DeleteConfirmationDialog";
import { EmptyState } from "@/components/custom/EmptyState";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import { formatISO } from "@/utils/convertHelper.ts";
import { Badge } from "@/components/ui/badge";
import type { DefaultPermissionResponseDto } from "@/types/permission.type";

interface PermissionTableProps {
    permissions: DefaultPermissionResponseDto[];
    isLoading: boolean;
    onEdit: (skill: DefaultPermissionResponseDto) => void;
    onDelete: (id: string) => void;
}

const METHOD_COLORS: Record<string, string> = {
    GET: "bg-green-500",
    POST: "bg-blue-500",
    PATCH: "bg-yellow-500",
    DELETE: "bg-red-500",
};

export function PermissionTable({
    permissions,
    isLoading,
    onEdit,
    onDelete,
}: PermissionTableProps) {
    const getMethodColor = (method: string): string => {
        const color = METHOD_COLORS[method.toUpperCase()];

        return `${color ? color : "bg-gray-500"} w-[80px]`;
    };
    return (
        <div className="overflow-hidden rounded-lg border border-blue-600">
            <Table>
                <TableHeader className="bg-blue-600 text-white">
                    <TableRow>
                        <TableHead className="text-center font-bold text-white">
                            ID
                        </TableHead>
                        <TableHead className="w-[300px] text-center font-bold text-white">
                            Tên quyền hạn
                        </TableHead>
                        <TableHead className="text-center font-bold text-white">
                            Đường dẫn API
                        </TableHead>
                        <TableHead className="text-center font-bold text-white">
                            Phương thức
                        </TableHead>
                        <TableHead className="text-center font-bold text-white">
                            Module
                        </TableHead>
                        <TableHead className="text-center font-bold text-white">
                            Ngày tạo
                        </TableHead>
                        <TableHead className="text-center font-bold text-white">
                            Cập nhật
                        </TableHead>
                        <TableHead className="text-center font-bold text-white">
                            Hành động
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <div className="flex justify-center py-6">
                                    <LoadingSpinner />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : permissions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8}>
                                <EmptyState
                                    title="Không tìm thấy quyền hạn nào"
                                    description="Thử thay đổi tiêu chí tìm kiếm hoặc thêm quyền hạn mới"
                                    icon={
                                        <KeyRound className="text-muted-foreground mb-4 h-12 w-12" />
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ) : (
                        permissions.map((permission) => (
                            <TableRow key={permission.id}>
                                <TableCell className="text-center">
                                    {permission.id}
                                </TableCell>
                                <TableCell className="w-[300px] text-center break-all whitespace-normal">
                                    {permission.name}
                                </TableCell>
                                <TableCell className="text-center">
                                    {permission.apiPath}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge
                                        className={getMethodColor(
                                            permission.method,
                                        )}
                                    >
                                        {permission.method}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    {permission.module}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatISO(permission.createdAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatISO(permission.updatedAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-orange-500 hover:text-orange-600"
                                            onClick={() => onEdit(permission)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <DeleteConfirmDialog
                                            onConfirm={() =>
                                                onDelete(permission.id)
                                            }
                                        >
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </DeleteConfirmDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
