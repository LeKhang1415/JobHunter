import { IsEmail, IsEnum, IsString } from "class-validator";
import { ResumeStatus } from "src/common/enums/resume-status.enum";

export class CreateResumeDto {
    @IsEmail()
    email: string;

    @IsEnum(ResumeStatus)
    status: ResumeStatus;

    @IsString()
    jobId: string;
}