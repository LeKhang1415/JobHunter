export interface CreateResumeRequestDto {
    email: string;
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
    jobId: string;
}

export interface ResumeResponseDto {
    id: string;
    email: string;
    fileUrl: string;
    status: string;
    jobName: string;
    companyName: string;
    createAt: Date;
    updateAt: Date;
}

export interface ResumeDisplayDto {
    id: string;
    email: string;
    fileUrl: string;
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
    job: {
        id: string;
        name: string;
        location: string;
        skills: string[];
    };
    company: {
        id: string;
        name: string;
        logo: string;
    };
    createAt: Date;
    updateAt: Date;
}
