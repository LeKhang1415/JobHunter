import type { PaginationQuery } from "./pagination.type";

export interface DefaultPermissionRequestDto {
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

export interface DefaultPermissionResponseDto {
    id: string;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    createdAt: string;
    updatedAt: string;
}

export interface PermissionPaginationQuery extends PaginationQuery {
    name?: string;
    apiPath?: string;
}

export const MODULES = [
    "USER",
    "AUTH",
    "COMPANY",
    "SKILL",
    "JOB",
    "RESUME",
    "SUBSCRIBER",
    "PERMISSION",
    "ROLE",
    "RECRUITER",
    "ADMIN",
];
export const METHODS = ["GET", "POST", "PATCH", "DELETE"];
