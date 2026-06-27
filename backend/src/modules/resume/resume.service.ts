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
import { FindOptionsWhere, Repository } from 'typeorm';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateResumeDto } from './dtos/create-resume.dto';
import { ResumeResponseDto } from './dtos/resume-response.dto';

import { UploadService } from '../upload/upload.service';
import { UpdateResumeDto } from './dtos/update-resume.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ResumeStatus } from 'src/common/enums/resume-status.enum';

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

    async createResume(user: JwtPayload, createResumeDto: CreateResumeDto, file: Express.Multer.File): Promise<ResumeResponseDto> {
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

    async findMyResumes(user: JwtPayload, pagination: PaginationQueryDto): Promise<Paginated<ResumeResponseDto>> {
        const userEntity = await this.usersService.findById(user.sub);
        if (!userEntity) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        const where: FindOptionsWhere<Resume> = { user: { id: userEntity.id } }

        const paginated = await this.paginationProvider.paginateQuery(
            pagination,
            this.resumeRepository,
            where,
            {},
            ['job', 'job.company'],
        );

        return {
            data: paginated.data.map((resume) => this.mapToResponseDto(resume)),
            meta: paginated.meta,
        };

    }

    async updateResume(resumeId: string, user: JwtPayload, updateResumeDto: UpdateResumeDto, file?: Express.Multer.File): Promise<ResumeResponseDto> {
        const existedResume = await this.checkResumeOwnershipAndStatus(resumeId, user.sub);

        if (file) {
            await this.uploadService.deletePDF(existedResume.publicId);

            const uploadResult = await this.uploadService.uploadPDF(file, 'resumes');

            existedResume.publicId = uploadResult.public_id;

            existedResume.fileUrl = uploadResult.secure_url;
        }

        if (updateResumeDto.email) {
            existedResume.email = updateResumeDto.email
        }

        const savedResume = await this.resumeRepository.save(existedResume);

        return this.mapToResponseDto(savedResume)
    }

    async removeResume(resumeId: string, user: JwtPayload): Promise<void> {
        const existedResume = await this.checkResumeOwnershipAndStatus(resumeId, user.sub);

        await this.uploadService.deletePDF(existedResume.publicId);

        await this.resumeRepository.remove(existedResume);
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

    private async checkResumeOwnershipAndStatus(resumeId: string, userId: string): Promise<Resume> {
        const userEntity = await this.usersService.findById(userId);
        if (!userEntity) {
            throw new NotFoundException('Người dùng không tồn tại');
        }

        const existedResume = await this.resumeRepository.findOne({
            where: { id: resumeId, user: { id: userEntity.id } }
        });

        if (!existedResume) {
            throw new NotFoundException('Không tìm thấy hồ sơ');
        }

        if (existedResume.status !== ResumeStatus.PENDING) {
            throw new BadRequestException('Hồ sơ đã được nhà tuyển dụng xem xét, không thể thay đổi');
        }

        return existedResume;
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
