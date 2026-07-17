import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('episodes')
export class EpisodesController {
  constructor(private episodesService: EpisodesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreateEpisodeDto) {
    return this.episodesService.create(userId, dto);
  }

  @Get()
  findAll() {
    return this.episodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.episodesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@GetUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdateEpisodeDto) {
    return this.episodesService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.episodesService.remove(id, userId);
  }
}
