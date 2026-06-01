import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import Pagination from "@/components/custom/Pagination.tsx";

import { getErrorMessage } from "@/features/slices/auth/authThunk.ts";
import { findAllPermissionsWithoutPagination } from "@/services/permissionApi";
import type { DefaultPermissionResponseDto } from "@/types/permission.type";
import type {
    DefaultRoleRequestDto,
    DefaultRoleResponseDto,
} from "@/types/role.type";
import {
    deleteRoleById,
    findAllRoles,
    saveRole,
    updateRoleById,
} from "@/services/roleApi";
import { RoleTable } from "./RoleTable";
import { RoleSearchSection } from "./RoleSearchSection";
import { RoleForm } from "./RoleForm";

const RoleManagerPage = () => {
    const [roles, setRoles] = useState<DefaultRoleResponseDto[]>([]);
    const [permissions, setPermissions] = useState<
        DefaultPermissionResponseDto[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [searchRoleName, setSearchRoleName] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(5);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] =
        useState<DefaultRoleResponseDto | null>(null);

    const handleOpenCreateForm = () => {
        setSelectedRole(null);
        setIsDialogOpen(true);
    };

    const handleOpenEditForm = (role: DefaultRoleResponseDto) => {
        setSelectedRole(role);
        setIsDialogOpen(true);
    };

    const fetchRoles = async (
        page: number,
        limit: number,
        searchRoleName: string,
    ) => {
        setIsLoading(true);

        try {
            const res = (
                await findAllRoles({
                    page,
                    limit,
                    name: searchRoleName || undefined,
                })
            ).data.result;
            setRoles(res.data);
            setTotalElements(res.meta.totalItems);
            setTotalPages(res.meta.totalPages);
        } catch (err) {
            console.log(
                getErrorMessage(err, "Không thể lấy danh sách công ty."),
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles(1, itemsPerPage, searchRoleName);
        setCurrentPage(1);
    }, [itemsPerPage, searchRoleName]);

    useEffect(() => {
        fetchRoles(currentPage, itemsPerPage, searchRoleName);
    }, [currentPage, itemsPerPage, searchRoleName]);

    useEffect(() => {
        const fetchPermissions = async () => {
            setIsLoading(true);

            try {
                const res = (await findAllPermissionsWithoutPagination()).data;
                setPermissions(res.result);
            } catch (err) {
                console.log(
                    getErrorMessage(err, "Không thể lấy danh sách công ty."),
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const handleReset = () => {
        setSearchRoleName("");
        setCurrentPage(1);
    };
    const handleSubmitCreateOrUpdate = async (
        data: DefaultRoleRequestDto,
        id?: string,
    ) => {
        try {
            setIsLoading(true);

            if (id) {
                await updateRoleById(id, data);
                await fetchRoles(1, itemsPerPage, searchRoleName);
                console.log("Cập nhật chức vụ mới thành công");
            } else {
                await saveRole(data);
                await fetchRoles(1, itemsPerPage, searchRoleName);
                console.log("Tạo chức vụ mới thành công");
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

            await deleteRoleById(id);
            await fetchRoles(1, itemsPerPage, searchRoleName);

            console.log("Xóa chức vụ thành công");
        } catch (err) {
            console.log(getErrorMessage(err, "Thao tác thất bại"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <RoleSearchSection
                searchRoleName={searchRoleName}
                setSearchRoleName={setSearchRoleName}
                onReset={handleReset}
            />

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Danh sách chức vụ</h2>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleOpenCreateForm}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm chức vụ
                </Button>
            </div>

            <RoleTable
                roles={roles}
                isLoading={isLoading}
                onEdit={handleOpenEditForm}
                onDelete={handleDelete}
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

            <RoleForm
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedRole}
                onSubmit={handleSubmitCreateOrUpdate}
                onCloseForm={() => setSelectedRole(null)}
                permissions={permissions}
            />
        </div>
    );
};

export default RoleManagerPage;
