import { Edit, Trash2, Building2, LucideBuilding2 } from "lucide-react";
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
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import HasPermission from "@/components/custom/HasPermission";
import { useState } from "react";
import CompanyFormDialog from "./CompanyFormDialog";

interface CompanyTableProps {
    companies: DefaultCompanyResponseDto[];
    isLoading: boolean;
    onDelete: (id: string) => void;
    onRefresh: () => void;
    theme?: "blue" | "purple";
}

export function CompanyTable({
    companies,
    isLoading,
    onDelete,
    onRefresh,
}: CompanyTableProps) {
    const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
    const [companyToEdit, setCompanyToEdit] =
        useState<DefaultCompanyResponseDto | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const handleDeleteClick = (id: string) => {
        setCompanyToDelete(id);
    };

    const handleConfirmDelete = () => {
        if (companyToDelete) {
            onDelete(companyToDelete);
            setCompanyToDelete(null);
        }
    };

    const handleEditClick = (company: DefaultCompanyResponseDto) => {
        setCompanyToEdit(company);
        setIsEditDialogOpen(true);
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (companies.length === 0) {
        return <EmptyState icon={<LucideBuilding2 />} title="Không có công ty nào" />;
    }

    return (
        <>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Tên công ty</TableHead>
                            <TableHead>Địa chỉ</TableHead>
                            <TableHead>Mô tả</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead className="text-right">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell>
                                    {company.logoUrl ? (
                                        <img
                                            src={company.logoUrl}
                                            alt={company.name}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <Building2
                                                size={20}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {company.name}
                                </TableCell>
                                <TableCell>{company.address}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                    {company.description || "-"}
                                </TableCell>
                                <TableCell>
                                    {formatISO(company.createdAt)}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <HasPermission perm="PATCH /company/:id">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                handleEditClick(company)
                                            }
                                        >
                                            <Edit size={16} />
                                        </Button>
                                    </HasPermission>
                                    <HasPermission perm="DELETE /company/:id">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteClick(company.id)
                                            }
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </HasPermission>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog
                open={!!companyToDelete}
                onOpenChange={(open) => !open && setCompanyToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa công ty
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa công ty này? Hành động này
                            không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {companyToEdit && (
                <CompanyFormDialog
                    open={isEditDialogOpen}
                    onClose={() => {
                        setIsEditDialogOpen(false);
                        setCompanyToEdit(null);
                    }}
                    onSubmit={() => {
                        setIsEditDialogOpen(false);
                        setCompanyToEdit(null);
                        onRefresh();
                    }}
                    initialData={companyToEdit}
                />
            )}
        </>
    );
}
