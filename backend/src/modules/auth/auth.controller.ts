import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { RegisterUser } from './dtos/register-user.dto';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginUser } from './dtos/login-user.dto';
import { Response, Request } from 'express';
import { CurrentUser } from 'src/common/decorators/user-infor.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @ResponseMessage('Đăng ký thành công')
  @Post('register')
  async register(
    @Body() registerUser: RegisterUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userAgent = request.headers['user-agent'] || 'Unknown Browser';

    return this.authService.register(registerUser, response, userAgent);
  }

  @Public()
  @ResponseMessage('Đăng nhập thành công')
  @Post('login')
  async login(
    @Body() loginUser: LoginUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userAgent = request.headers['user-agent'] || 'Unknown Browser';

    return this.authService.login(loginUser, response, userAgent);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }

  @ResponseMessage('Đăng xuất thành công')
  @Post('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @CurrentUser() user: JwtPayload,
  ) {
    const refreshToken = request.cookies?.refreshToken;

    await this.authService.logout(response, refreshToken, user?.sub);
    return null;
  }
}
