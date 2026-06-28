import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { CreateResumeRequestDto, ResumeResponseDto } from "@/types/resume.type";

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

