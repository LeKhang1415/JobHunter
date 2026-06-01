import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { PaginatedResponse } from "@/types/pagination.type";
import type {
    DefaultPermissionRequestDto,
    DefaultPermissionResponseDto,
    PermissionPaginationQuery,
} from "@/types/permission.type";

export const savePermission = (data: DefaultPermissionRequestDto) => {
    return axiosClient.post<ApiResponse<DefaultPermissionResponseDto>>(
        "/permissions",
        data,
    );
};

export const findAllPermissions = ({
    page = 1,
    limit = 10,
    name,
    apiPath,
}: PermissionPaginationQuery) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (name) params.append("name", name);
    if (apiPath) params.append("apiPath", apiPath);

    return axiosClient.get<
        ApiResponse<PaginatedResponse<DefaultPermissionResponseDto>>
    >(`/permissions?${params.toString()}`);
};

export const findAllPermissionsWithoutPagination = () => {
    return axiosClient.get<ApiResponse<DefaultPermissionResponseDto[]>>(
        "/permissions/all",
    );
};

export const findPermissionsByRoleId = (roleId: string) => {
    return axiosClient.get<ApiResponse<DefaultPermissionResponseDto[]>>(
        `/permissions/role/${roleId}`,
    );
};

export const updatePermissionById = (
    id: string,
    data: DefaultPermissionRequestDto,
) => {
    return axiosClient.patch<ApiResponse<DefaultPermissionResponseDto>>(
        `/permissions/${id}`,
        data,
    );
};

export const deletePermissionById = (id: string) => {
    return axiosClient.delete<ApiResponse<DefaultPermissionRequestDto>>(
        `/permissions/${id}`,
    );
};
