import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';

export class UpdateResumeDto extends PartialType(OmitType(CreateResumeDto, ['status', 'jobId'] as const)) { }
