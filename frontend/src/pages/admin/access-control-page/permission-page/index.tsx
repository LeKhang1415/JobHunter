import { getErrorMessage } from "@/features/slices/auth/authThunk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Pagination from "@/components/custom/Pagination";
import { PermissionSearchSection } from "./PermissionSearchSection";
import type {
    DefaultPermissionRequestDto,
    DefaultPermissionResponseDto,
} from "@/types/permission.type";
import {
    deletePermissionById,
    findAllPermissions,
    savePermission,
    updatePermissionById,
} from "@/services/permissionApi";
import { PermissionTable } from "./PermissionTable";
import { PermissionForm } from "./PermissionForm";

const PermissionManagerPage = () => {
    const [permissions, setPermissions] = useState<
        DefaultPermissionResponseDto[]
    >([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchName, setSearchName] = useState("");
    const [searchApiPath, setSearchApiPath] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] =
        useState<DefaultPermissionResponseDto | null>(null);

    const handleOpenCreateForm = () => {
        setSelectedPermission(null);
        setIsDialogOpen(true);
    };

    const handleOpenEditForm = (permission: DefaultPermissionResponseDto) => {
        setSelectedPermission(permission);
        setIsDialogOpen(true);
    };

    const fetchPermissions = async (
        page: number,
        limit: number,
        searchName: string,
        searchApiPath: string,
    ) => {
        setIsLoading(true);

        try {
            const res = (
                await findAllPermissions({
                    page,
                    limit,
                    name: searchName || undefined,
                    apiPath: searchApiPath || undefined,
                })
            ).data;

            setPermissions(res.result.data);
            setTotalElements(res.result.meta.totalItems);
            setTotalPages(res.result.meta.totalPages);
        } catch (err) {
            console.log(getErrorMessage(err, "Không thể lấy danh sách quyền."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPermissions(1, itemsPerPage, searchName, searchApiPath);
        setCurrentPage(1);
    }, [itemsPerPage, searchName, searchApiPath]);

    useEffect(() => {
        fetchPermissions(currentPage, itemsPerPage, searchName, searchApiPath);
    }, [currentPage, itemsPerPage, searchName, searchApiPath]);

    const handleReset = () => {
        setSearchName("");
        setSearchApiPath("");
        setCurrentPage(1);
    };

    const handleSubmitCreateOrUpdate = async (
        data: DefaultPermissionRequestDto,
        id?: string,
    ) => {
        try {
            setIsLoading(true);

            if (id) {
                await updatePermissionById(id, data);
                await fetchPermissions(
                    1,
                    itemsPerPage,
                    searchName,
                    searchApiPath,
                );
                console.log("Cập nhật quyền hạn mới thành công");
            } else {
                await savePermission(data);
                await fetchPermissions(
                    1,
                    itemsPerPage,
                    searchName,
                    searchApiPath,
                );
                console.log("Tạo quyền hạn mới thành công");
            }
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setIsLoading(true);

            await deletePermissionById(id);
            await fetchPermissions(1, itemsPerPage, searchName, searchApiPath);

            console.log("Xóa quyền hạn thành công");
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PermissionSearchSection
                searchName={searchName}
                setSearchName={setSearchName}
                searchApiPath={searchApiPath}
                setSearchApiPath={setSearchApiPath}
                onReset={handleReset}
            />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách Kỹ năng</h2>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleOpenCreateForm}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm quyền hạn
                </Button>
            </div>

            <PermissionTable
                permissions={permissions}
                isLoading={isLoading}
                onDelete={handleDelete}
                onEdit={handleOpenEditForm}
            />

            <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                totalElements={totalElements}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                showItemsPerPageSelect={true}
            />

            <PermissionForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedPermission}
                onSubmit={handleSubmitCreateOrUpdate}
                onCloseForm={() => setSelectedPermission(null)}
            />
        </div>
    );
};

export default PermissionManagerPage;
