import { Controller, Post, Body, HttpCode, UseGuards, Get, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private config: ConfigService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(dto.email, dto.password);
    const refreshTtl = this.config.get<string | number>('REFRESH_TOKEN_TTL') ?? '7d';
    const cookieOpts: any = {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    };

    const maxAge = this.parseTtlToMs(refreshTtl);
    if (maxAge) cookieOpts.maxAge = maxAge;

    res.cookie('refreshToken', tokens.refreshToken, cookieOpts);
    return { accessToken: tokens.accessToken };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return { ok: false };
    const tokens = await this.authService.refreshTokens(refreshToken);

    const refreshTtl = this.config.get<string | number>('REFRESH_TOKEN_TTL') ?? '7d';
    const cookieOpts: any = {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    };
    const maxAge = this.parseTtlToMs(refreshTtl);
    if (maxAge) cookieOpts.maxAge = maxAge;
    res.cookie('refreshToken', tokens.refreshToken, cookieOpts);
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@GetUser('id') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(userId);
    res.clearCookie('refreshToken', { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-test')
  async refreshTest(@GetUser('id') userId: string) {
    // Example protected route to verify auth
    return { userId };
  }

  private parseTtlToMs(ttl: string | number): number | null {
    if (typeof ttl === 'number') return ttl * 1000;
    const s = (ttl as string).toString();
    const num = parseInt(s.slice(0, -1), 10);
    const unit = s.slice(-1);
    if (!num || !unit) return null;
    switch (unit) {
      case 's':
        return num * 1000;
      case 'm':
        return num * 60 * 1000;
      case 'h':
        return num * 60 * 60 * 1000;
      case 'd':
        return num * 24 * 60 * 60 * 1000;
      default:
        return null;
    }
  }
}
