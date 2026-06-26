import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { PaginatedResponse } from "@/types/pagination.type";
import type {
    GetAllUsersParams,
    UpdateSelfPasswordRequestDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from "@/types/user.type";

export const getAllUsers = (params: GetAllUsersParams) => {
    return axiosClient.get<ApiResponse<PaginatedResponse<UserResponseDto>>>(
        "/users",
        { params },
    );
};

export const getUserById = (id: string) => {
    return axiosClient.get<ApiResponse<UserResponseDto>>(`/users/${id}`);
};

export const updateUser = (id: string, data: UpdateUserRequestDto) => {
    return axiosClient.patch<ApiResponse<UserResponseDto>>(
        `/users/${id}`,
        data,
    );
};

export const deleteUser = (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/users/${id}`);
};

export const changeUserRole = (userId: string, roleId: string) => {
    return axiosClient.patch<ApiResponse<UserResponseDto>>(
        `/users/${userId}/role`,
        { roleId },
    );
};

export const updateSelfInfo = (data: Partial<UpdateUserRequestDto>) => {
    return axiosClient.patch<ApiResponse<UserResponseDto>>(
        "/users/me/update",
        data,
    );
};

export const updateSelfAvatar = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.patch<ApiResponse<UserResponseDto>>(
        "/users/me/avatar",
        formData,
    );
};

export const updateSelfPassword = (data: UpdateSelfPasswordRequestDto) => {
    return axiosClient.patch<ApiResponse<UserResponseDto>>(
        "/users/me/password",
        data,
    );
};
