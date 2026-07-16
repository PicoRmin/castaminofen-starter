import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(payload: { email: string; password: string; name?: string }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) throw new ForbiddenException('Email already in use');
    const hashed = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.create({
      email: payload.email,
      password: hashed,
      name: payload.name,
    });
    const { password, hashedRefreshToken, ...rest } = user as any;
    return rest;
  }

  async validateUser(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(plainPassword, (user as any).password);
    if (!valid) return null;
    const { password, hashedRefreshToken, ...rest } = user as any;
    return rest;
  }

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: this.config.get<string | number>('ACCESS_TOKEN_TTL') ?? '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string | number>('REFRESH_TOKEN_TTL') ?? '7d',
    });
    return { accessToken, refreshToken };
  }

  async login(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new ForbiddenException('Invalid credentials');
    const valid = await bcrypt.compare(plainPassword, (user as any).password);
    if (!valid) throw new ForbiddenException('Invalid credentials');
    const tokens = await this.getTokens(user.id, user.email);
    const hashedRefresh = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.update(user.id, { hashedRefreshToken: hashedRefresh });
    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch (e) {
      throw new ForbiddenException('Access denied');
    }

    const userId = payload.sub as string;
    const user = await this.usersService.findById(userId);
    if (!user || !(user as any).hashedRefreshToken) throw new ForbiddenException('Access denied');

    const valid = await bcrypt.compare(refreshToken, (user as any).hashedRefreshToken);
    if (!valid) throw new ForbiddenException('Access denied');

    const tokens = await this.getTokens(user.id, user.email);
    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersService.update(user.id, { hashedRefreshToken: hashed });
    return tokens;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, { hashedRefreshToken: null });
  }
}
