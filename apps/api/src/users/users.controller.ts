import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@GetUser('id') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) return null;
    const { password, hashedRefreshToken, ...rest } = user as any;
    return rest;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@GetUser('id') userId: string, @Body() body: any) {
    const allowed = { name: body.name };
    const user = await this.usersService.update(userId, allowed);
    const { password, hashedRefreshToken, ...rest } = user as any;
    return rest;
  }
}
