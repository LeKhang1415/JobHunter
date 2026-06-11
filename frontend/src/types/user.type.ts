import type { CompanyInformationDto } from "./company.type";
import type { RoleInformationDto } from "./role.type";

export interface UserLoginRequestDto {
    email: string;
    password: string;
}

export interface UserRegisterRequestDto {
    name: string;
    email: string;
    password: string;
    gender: Gender;
    address?: string;
    recruiter: boolean;
}

export type Gender = "male" | "female" | "other";

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    address: string;
    gender: string;
    userImgUrl: string;
    permissions: string[];
    company?: CompanyInformationDto | null;
    role?: RoleInformationDto | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface RecruiterInfoResponseDto {
    id: number;
    name: string;
    email: string;
    owner: boolean;
}

export interface GetAllUsersParams {
    page?: number;
    limit?: number;
    searchName?: string;
    searchEmail?: string;
    role?: string;
    gender?: string;
}

export interface UpdateUserRequestDto {
    name?: string;
    email?: string;
    address?: string;
    gender?: string;
    roleId?: string;
}

export interface MemberRecruiterRequestDto {
    email: string;
}
