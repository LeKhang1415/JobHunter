import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { DefaultCompanyResponseDto } from "@/types/company.type";
import type {
    MemberRecruiterRequestDto,
    RecruiterInfoResponseDto,
} from "@/types/user.type";

export const findSelfCompany = () => {
    return axiosClient.get<ApiResponse<DefaultCompanyResponseDto>>(
        `/company/me/company`,
    );
};

export const saveSelfCompany = (formData: FormData) => {
    return axiosClient.post("/company", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateSelfCompany = (id: string, formData: FormData) => {
    return axiosClient.patch(`/company/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const findAllRecruitersBySelfCompany = () => {
    return axiosClient.get<ApiResponse<RecruiterInfoResponseDto[]>>(
        `/company/me/recruiters`,
    );
};

export const addMemberToCompany = (data: MemberRecruiterRequestDto) => {
    return axiosClient.post(`/company/members`, data);
};

export const removeMemberFromCompany = (data: MemberRecruiterRequestDto) => {
    return axiosClient.delete("/company/members", {
        data: data,
    });
};

// Admin functions
export const getAllCompanies = (params: {
    page?: number;
    limit?: number;
    name?: string;
    address?: string;
}) => {
    return axiosClient.get<
        ApiResponse<{
            data: DefaultCompanyResponseDto[];
            meta: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                itemsPerPage: number;
            };
        }>
    >("/company", {
        params,
    });
};

// Public functions (no auth required)
export const getAllPublicCompanies = (params: {
    page?: number;
    limit?: number;
    name?: string;
    address?: string;
}) => {
    return axiosClient.get<
        ApiResponse<{
            data: DefaultCompanyResponseDto[];
            meta: {
                totalItems: number;
                totalPages: number;
                currentPage: number;
                itemsPerPage: number;
            };
        }>
    >("/company/public", {
        params,
    });
};

export const deleteCompany = (id: string) => {
    return axiosClient.delete(`/company/${id}`);
};

export const getCompanyById = (id: string) => {
    return axiosClient.get<ApiResponse<DefaultCompanyResponseDto>>(
        `/company/${id}`,
    );
};
