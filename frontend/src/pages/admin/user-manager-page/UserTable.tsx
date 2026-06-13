import { Edit, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { EmptyState } from "@/components/custom/EmptyState.tsx";
import LoadingSpinner from "@/components/custom/LoadingSpinner.tsx";
import { formatISO } from "@/utils/convertHelper.ts";
import type { UserResponseDto } from "@/types/user.type";
import HasPermission from "@/components/custom/HasPermission";
import { useState } from "react";

interface UserTableProps {
    users: UserResponseDto[];
    isLoading: boolean;
    onDelete: (id: string) => void;
    theme?: "blue" | "purple";
}

export function UserTable({
    users,
    isLoading,
    onDelete,
    theme = "blue",
}: UserTableProps) {
    const navigate = useNavigate();
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setUserToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDelete(userToDelete);
            setUserToDelete(null);
        }
    };

    const getGenderLabel = (gender: string) => {
        switch (gender) {
            case "male":
                return "Nam";
            case "female":
                return "Nữ";
            case "other":
                return "Khác";
            default:
                return gender;
        }
    };

    return (
        <>
            <div
                className={`overflow-hidden rounded-lg border ${theme === "blue" ? "border-blue-600" : "border-purple-600"}`}
            >
                <Table>
                    <TableHeader
                        className={`${theme === "blue" ? "bg-blue-600" : "bg-purple-600"} text-white`}
                    >
                        <TableRow>
                            <TableHead className="text-center font-bold text-white">
                                ID
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Tên
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Email
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Giới tính
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Role
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Ngày tạo
                            </TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <div className="flex justify-center py-6">
                                        <LoadingSpinner />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <EmptyState
                                        title="Không tìm thấy người dùng nào"
                                        description="Thử thay đổi tiêu chí tìm kiếm hoặc thêm người dùng mới"
                                        icon={
                                            <Users className="text-muted-foreground mb-4 h-12 w-12" />
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="text-center text-sm">
                                        {user.id.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {getGenderLabel(user.gender)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                user.role?.name === "ADMIN"
                                                    ? "bg-red-100 text-red-800"
                                                    : user.role?.name ===
                                                        "RECRUITER"
                                                      ? "bg-blue-100 text-blue-800"
                                                      : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {user.role?.name || "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center text-sm">
                                        {formatISO(
                                            user.createdAt instanceof Date
                                                ? user.createdAt.toISOString()
                                                : user.createdAt,
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-2">
                                            <HasPermission
                                                perm={"PATCH /users/:id"}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/user-manager/upsert?id=${user.id}`,
                                                        )
                                                    }
                                                    className="text-orange-500 hover:text-orange-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </HasPermission>
                                            <HasPermission
                                                perm={"DELETE /users/:id"}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleDeleteClick(
                                                            user.id,
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </HasPermission>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {userToDelete && (
                <AlertDialog
                    open={!!userToDelete}
                    onOpenChange={() => setUserToDelete(null)}
                >
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Xác nhận xóa người dùng
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa người dùng này? Hành
                                động này không thể hoàn tác.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                Xóa
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
