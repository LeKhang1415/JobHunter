export interface CompanyInformationDto {
    id: string;
    name: string;
    address: string;
    logoUrl: string;
}

export interface DefaultCompanyResponseDto {
    id: string;
    name: string;
    description: string;
    address: string;
    logoUrl?: string;
    createdAt: string;
    updatedAt: string;
    jobsCount?: number;
    owner?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface CreateCompanyRequestDto {
    name: string;
    description: string;
    address: string;
}
