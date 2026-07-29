import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { Resume } from './entities/resume.entity';
import { UsersModule } from '../users/users.module';
import { JobModule } from '../job/job.module';
import { UploadModule } from '../upload/upload.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { ResumeNotificationModule } from '../resume-notification/resume-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resume]),
    forwardRef(() => UsersModule),
    forwardRef(() => JobModule),
    UploadModule,
    PaginationModule,
    ResumeNotificationModule,
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule { }
