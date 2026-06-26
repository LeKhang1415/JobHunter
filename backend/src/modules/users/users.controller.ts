import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserQueryDto } from './dtos/user-query.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RequirePermissions } from 'src/common/decorators/permission.decorator';
import { CurrentUser } from 'src/common/decorators/user-infor.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @RequirePermissions('GET /users')
  @ResponseMessage('Lấy danh sách người dùng thành công')
  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAllUsers(query);
  }

  @RequirePermissions('GET /users/:id')
  @ResponseMessage('Lấy thông tin người dùng thành công')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @RequirePermissions('POST /users')
  @ResponseMessage('Tạo người dùng thành công')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @RequirePermissions('PATCH /users/:id')
  @ResponseMessage('Cập nhật người dùng thành công')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  //   @RequirePermissions('DELETE /users/:id')
  //   @ResponseMessage('Xóa người dùng thành công')
  //   @Delete(':id')
  //   delete(@Param('id') id: string) {
  //     return this.usersService.deleteUser(id);
  //   }

  @ResponseMessage('Cập nhật thông tin cá nhân thành công')
  @Patch('me/update')
  updateSelf(@CurrentUser() user: JwtPayload, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(user.sub, updateUserDto);
  }

  @ResponseMessage('Cập nhật ảnh đại diện thành công')
  @UseInterceptors(FileInterceptor('file'))
  @Patch('me/avatar')
  updateSelfAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateSelfAvatar(user.email, file);
  }
}
