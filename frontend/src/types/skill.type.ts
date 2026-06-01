import type { PaginationQuery } from "./pagination.type";

export interface CreateSkillRequestDto {
    name: string;
}

export interface UpdateSkillRequestDto {
    name: string;
}

export interface DefaultSkillResponseDto {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface SkillPaginationQuery extends PaginationQuery {
    searchName?: string;
}
