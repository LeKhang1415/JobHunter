import type { PaginationQuery } from "./pagination.type";

export type Role = "USER" | "RECRUITER" | "ADMIN";

export interface RoleInformationDto {
    id: string;
    name: string;
    description: string;
}

export interface DefaultRoleRequestDto {
    name: string;
    description: string;
    active: boolean;
    permissionIds: string[];
}

export interface DefaultRoleResponseDto {
    id: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RolePaginationQuery extends PaginationQuery {
    name?: string;
}
