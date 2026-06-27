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
