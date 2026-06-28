import { ResumeStatus } from 'src/common/enums/resume-status.enum';

export class ResumeDisplayDto {
    id: string;
    email: string;
    fileUrl: string;
    status: ResumeStatus;
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
