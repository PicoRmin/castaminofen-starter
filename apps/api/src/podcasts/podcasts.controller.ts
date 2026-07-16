import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';

@Controller('podcasts')
export class PodcastsController {
  constructor(private podcastsService: PodcastsService) {}

  @Post()
  create(@Body() dto: CreatePodcastDto) {
    return this.podcastsService.create(dto);
  }

  @Get()
  findAll() {
    return this.podcastsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.podcastsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePodcastDto) {
    return this.podcastsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.podcastsService.remove(id);
  }
}
