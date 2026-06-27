import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JobService } from '../job/job.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateResumeDto } from './dtos/create-permission.dto';
import { ResumeResponseDto } from './dtos/resume-response.dto';

import { UploadService } from '../upload/upload.service';

@Injectable()
export class ResumeService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jobService: JobService,
        private readonly uploadService: UploadService,
        private readonly paginationProvider: PaginationProvider,
        @InjectRepository(Resume)
        private readonly resumeRepository: Repository<Resume>,
    ) { }

    async createResume(user: JwtPayload, createResumeDto: CreateResumeDto, file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn file CV');
        }

        const jobDto = await this.jobService.findById(createResumeDto.jobId);

        if (!jobDto) {
            throw new NotFoundException('Công việc không tồn tại');
        }

        const userEntity = await this.usersService.findById(user.sub);
        if (!userEntity) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        if (await this.existsByUserIdAndJobId(user.sub, createResumeDto.jobId)) {
            throw new BadRequestException('Bạn đã nộp hồ sơ cho công việc này rồi');
        }

        const uploadResult = await this.uploadService.uploadPDF(file, 'resumes');

        const resume = this.resumeRepository.create({
            email: createResumeDto.email,
            status: createResumeDto.status,
            user: { id: userEntity.id },
            job: { id: jobDto.id },
            fileUrl: uploadResult.secure_url,
            publicId: uploadResult.public_id,
        });

        const savedResume = await this.resumeRepository.save(resume);

        return {
            id: savedResume.id,
            email: savedResume.email,
            job: jobDto.name,
            company: jobDto.company?.name || '',
            createAt: savedResume.createAt,
            updateAt: savedResume.updateAt,
        };
    }

    private async existsByUserIdAndJobId(userId: string, jobId: string) {
        const resume = await this.resumeRepository.findOne({
            where: {
                user: { id: userId },
                job: { id: jobId },
            },
        });
        if (resume) {
            return true;
        }
        return false;
    }

    private mapToResponseDto(resume: Resume): ResumeResponseDto {
        return {
            id: resume.id,
            email: resume.email,
            job: resume.job?.name || '',
            company: resume.job?.company?.name || '',
            createAt: resume.createAt,
            updateAt: resume.updateAt,
        };
    }
}
