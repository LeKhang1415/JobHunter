import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { PaginatedResponse } from "@/types/pagination.type";
import type {
    DefaultRoleRequestDto,
    DefaultRoleResponseDto,
    RolePaginationQuery,
} from "@/types/role.type";

export const saveRole = (data: DefaultRoleRequestDto) => {
    return axiosClient.post<ApiResponse<DefaultRoleResponseDto>>("/role", data);
};

export const findAllRoles = ({
    page = 1,
    limit = 10,
    name,
}: RolePaginationQuery) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (name) params.append("name", name);

    return axiosClient.get<
        ApiResponse<PaginatedResponse<DefaultRoleResponseDto>>
    >(`/role?${params.toString()}`);
};

export const findAllRolesWithoutPagination = () => {
    return axiosClient.get<ApiResponse<DefaultRoleResponseDto[]>>(
        "/role/list/all",
    );
};

export const updateRoleById = (id: string, data: DefaultRoleRequestDto) => {
    return axiosClient.patch<ApiResponse<DefaultRoleResponseDto>>(
        `/role/${id}`,
        data,
    );
};

export const deleteRoleById = (id: string) => {
    return axiosClient.delete<ApiResponse<DefaultRoleResponseDto>>(
        `/permissions/${id}`,
    );
};
