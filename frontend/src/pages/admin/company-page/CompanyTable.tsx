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
            <div className="overflow-hidden rounded-lg border border-blue-600">
                <Table>
                    <TableHeader className="bg-blue-600 text-white">
                        <TableRow>
                            <TableHead className="text-center font-bold text-white">Logo</TableHead>
                            <TableHead className="text-center font-bold text-white">Tên công ty</TableHead>
                            <TableHead className="text-center font-bold text-white">Địa chỉ</TableHead>
                            <TableHead className="text-center font-bold text-white">Ngày tạo</TableHead>
                            <TableHead className="text-center font-bold text-white">Cập nhật</TableHead>
                            <TableHead className="text-center font-bold text-white">
                                Hành động
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {companies.map((company) => (
                            <TableRow key={company.id}>
                                <TableCell className="text-center">
                                    {company.logoUrl ? (
                                        <img
                                            src={company.logoUrl}
                                            alt={company.name}
                                            className="w-10 h-10 rounded-lg object-cover mx-auto"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center mx-auto">
                                            <Building2
                                                size={20}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                    {company.name}
                                </TableCell>
                                <TableCell className="text-center">{company.address}</TableCell>
                                <TableCell className="text-center">
                                    {formatISO(company.createdAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                    {formatISO(company.updatedAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <HasPermission perm="PATCH /company/:id">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-orange-500 hover:text-orange-600"
                                                onClick={() =>
                                                    handleEditClick(company)
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </HasPermission>
                                        <HasPermission perm="DELETE /company/:id">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600"
                                                onClick={() =>
                                                    handleDeleteClick(company.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </HasPermission>
                                    </div>
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
