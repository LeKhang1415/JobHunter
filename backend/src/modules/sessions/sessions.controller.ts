import { Controller, Get, Delete, Req, Body } from '@nestjs/common';
import { Request } from 'express';
import { SessionsService } from './sessions.service';
import { CurrentUser } from 'src/common/decorators/user-infor.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly sessionsService: SessionsService) { }

    @ResponseMessage('Lấy danh sách thiết bị thành công')
    @Get()
    async getSessions(
        @CurrentUser() user: JwtPayload,
        @Req() req: Request
    ) {
        const userId = user.sub;

        const currentRefreshToken = req.cookies?.refreshToken || '';

        return this.sessionsService.getAllUserSessions(userId, currentRefreshToken);
    }

    @ResponseMessage('Đã đăng xuất thiết bị thành công')
    @Delete()
    async removeSession(@Body('redisKey') redisKey: string) {
        await this.sessionsService.removeSessionByRedisKey(redisKey);
    }
}
