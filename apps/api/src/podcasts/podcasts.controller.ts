import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { GetPodcastsQueryDto } from './dto/get-podcasts-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('podcasts')
export class PodcastsController {
  constructor(private podcastsService: PodcastsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@GetUser('id') userId: string, @Body() dto: CreatePodcastDto) {
    return this.podcastsService.create({ ...dto, ownerId: userId });
  }

  @Get()
  findAll(@Query() query: GetPodcastsQueryDto) {
    return this.podcastsService.findAll(query);
  }

  @Get(':id/episodes')
  findEpisodes(@Param('id') id: string) {
    return this.podcastsService.findEpisodesByPodcastId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@GetUser('id') userId: string, @Param('id') id: string, @Body() dto: UpdatePodcastDto) {
    return this.podcastsService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.podcastsService.remove(id, userId);
  }
}
