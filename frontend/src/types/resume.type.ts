export interface CreateResumeRequestDto {
    email: string;
    status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
    jobId: string;
}

export interface ResumeResponseDto {
    id: string;
    email: string;
    job: string;
    company: string;
    createAt: Date;
    updateAt: Date;
}
