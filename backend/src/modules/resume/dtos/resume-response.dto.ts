import { ResumeStatus } from 'src/common/enums/resume-status.enum';

export class ResumeResponseDto {
    id: string;
    email: string;
    fileUrl: string;
    status: ResumeStatus;
    jobName: string;
    companyName: string;
    createAt: Date;
    updateAt: Date;
}