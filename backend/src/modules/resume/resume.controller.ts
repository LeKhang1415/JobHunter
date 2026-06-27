import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResumeService } from './resume.service';
import { CurrentUser } from 'src/common/decorators/user-infor.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateResumeDto } from './dtos/create-resume.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { UpdateResumeDto } from './dtos/update-resume.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination-query.dto';

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

  @Get('me')
  @ResponseMessage('Lấy lịch sử ứng tuyển thành công')
  findMyResumes(@CurrentUser() user: JwtPayload, @Query() pagination: PaginationQueryDto) {
    return this.resumeService.findMyResumes(user, pagination);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Cập nhật hồ sơ thành công')
  update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() updateResumeDto: UpdateResumeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.resumeService.updateResume(id, user, updateResumeDto, file);
  }

  @Delete(':id')
  @ResponseMessage('Rút hồ sơ thành công')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.resumeService.removeResume(id, user);
  }

}
