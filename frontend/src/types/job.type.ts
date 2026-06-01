import type { PaginationQuery } from "./pagination.type";

export interface Job {
    id: string;
    name: string;
    location: string;
    salary: number;
    quantity: number;
    level: "INTERN" | "FRESHER" | "MIDDLE" | "SENIOR";
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
    company: CompanySummary;
    skills: SkillSummary[];
}

export interface JobResponseDto {
    id: string;
    name: string;
    location: string;
    salary: number;
    quantity: number;
    level: "INTERN" | "FRESHER" | "MIDDLE" | "SENIOR";
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
    company: CompanySummary;
    skills: SkillSummary[];
}

export interface DefaultJobRequestDto {
    name: string;
    location: string;
    salary: number;
    quantity: number;
    level: "INTERN" | "FRESHER" | "MIDDLE" | "SENIOR";
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
    company: {
        id: string;
    } | null;
    skills: {
        id: string;
    }[];
}

export interface CompanySummary {
    id: string;
    name: string;
    address: string;
    logoUrl?: string;
}

export interface SkillSummary {
    id: string;
    name: string;
}

export interface JobPaginationQuery extends PaginationQuery {
    name?: string;
    companyName?: string;
    level?: string;
    location?: string;
}
