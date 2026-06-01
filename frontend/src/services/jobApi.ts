import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type {
    DefaultJobRequestDto,
    JobPaginationQuery,
    JobResponseDto,
} from "@/types/job.type";
import type { PaginatedResponse } from "@/types/pagination.type";

export const findAllJobs = (params: JobPaginationQuery) => {
    return axiosClient.get<ApiResponse<PaginatedResponse<JobResponseDto>>>(
        "/jobs",
        {
            params,
        },
    );
};

export const findAllJobsForRecruiterCompany = (params: JobPaginationQuery) => {
    return axiosClient.get<ApiResponse<PaginatedResponse<JobResponseDto>>>(
        "/jobs/recruiter",
        { params },
    );
};

export const createJobForRecruiter = (data: DefaultJobRequestDto) => {
    return axiosClient.post<ApiResponse<JobResponseDto>>(
        "/jobs/recruiter",
        data,
    );
};

export const updateJobByIdForRecruiter = (
    id: string,
    data: DefaultJobRequestDto,
) => {
    return axiosClient.patch<ApiResponse<JobResponseDto>>(
        `/jobs/recruiter/${id}`,
        data,
    );
};

export const createJob = (data: DefaultJobRequestDto) => {
    return axiosClient.post<ApiResponse<JobResponseDto>>("/jobs", data);
};

export const findJobById = (id: string) => {
    return axiosClient.get<ApiResponse<JobResponseDto>>(`/jobs/${id}`);
};

export const findJobsByCompanyId = (companyId: string) => {
    return axiosClient.get<ApiResponse<JobResponseDto[]>>(
        `/jobs/company/${companyId}`,
    );
};

export const updateJobById = (id: string, data: DefaultJobRequestDto) => {
    return axiosClient.patch<ApiResponse<JobResponseDto>>(`/jobs/${id}`, data);
};

export const deleteJobById = (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/jobs/${id}`);
};

export const deleteJobForRecruiter = (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/jobs/recruiter/${id}`);
};
