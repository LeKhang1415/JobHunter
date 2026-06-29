import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { PaginatedResponse, PaginationQuery } from "@/types/pagination.type";
import type { CreateResumeRequestDto, ResumeResponseDto, ResumeDisplayDto } from "@/types/resume.type";

export const applyJob = (data: CreateResumeRequestDto, file: File) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("status", data.status);
    formData.append("jobId", data.jobId);
    formData.append("file", file);

    return axiosClient.post<ApiResponse<ResumeResponseDto>>(
        "/resume/apply",
        formData
    );
};

export const getMyResumes = (query?: string) => {
    return axiosClient.get<ApiResponse<any>>(`/resume/me?${query || ""}`);
};

export const updateResume = (id: string, email: string, file?: File) => {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (file) formData.append("file", file);

    return axiosClient.patch<ApiResponse<ResumeResponseDto>>(
        `/resume/${id}`,
        formData
    );
};

export const removeResume = (id: string) => {
    return axiosClient.delete<ApiResponse<any>>(`/resume/${id}`);
};

export const findAllResumesForRecruiterCompany = (params: PaginationQuery) => {
    return axiosClient.get<ApiResponse<PaginatedResponse<ResumeDisplayDto>>>(
        "/resume/recruiter/company",
        { params }
    );
};

export const updateStatusResumeForRecruiter = (id: string, status: string) => {
    return axiosClient.patch<ApiResponse<ResumeResponseDto>>(
        `/resume/recruiter/${id}`,
        { status }
    );
};
