import axiosClient from "@/lib/axiosClient";
import type { ApiResponse } from "@/types/apiResponse.type";
import type { PaginatedResponse } from "@/types/pagination.type";
import type {
    CreateSkillRequestDto,
    UpdateSkillRequestDto,
    DefaultSkillResponseDto,
    SkillPaginationQuery,
} from "@/types/skill.type";

export const findAllSkills = (params: SkillPaginationQuery) => {
    return axiosClient.get<
        ApiResponse<PaginatedResponse<DefaultSkillResponseDto>>
    >("/skills", {
        params,
    });
};

export const findAllSkillsNoPaging = () => {
    return axiosClient.get<ApiResponse<DefaultSkillResponseDto[]>>(
        "/skills/all",
    );
};

export const createSkill = (data: CreateSkillRequestDto) => {
    return axiosClient.post<ApiResponse<DefaultSkillResponseDto>>(
        "/skills",
        data,
    );
};

export const updateSkill = (id: string, data: UpdateSkillRequestDto) => {
    return axiosClient.patch<ApiResponse<DefaultSkillResponseDto>>(
        `/skills/${id}`,
        data,
    );
};

export const deleteSkill = (id: string) => {
    return axiosClient.delete<ApiResponse<null>>(`/skills/${id}`);
};
