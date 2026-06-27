import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { CurrentUser } from 'src/common/decorators/user-infor.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateResumeDto } from './dtos/create-permission.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) { }

  @ResponseMessage('Nộp hồ sơ thành công')
  @UseInterceptors(FileInterceptor('file'))
  @Post('apply')
  apply(
    @CurrentUser() user: JwtPayload,
    @Body() createResumeDto: CreateResumeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resumeService.createResume(user, createResumeDto, file);
  }
}
