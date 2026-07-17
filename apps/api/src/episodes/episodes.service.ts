import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateEpisodeDto) {
    const podcast = await this.prisma.podcast.findUnique({ where: { id: data.podcastId } });
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
    if (podcast.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.episode.create({ data });
  }

  async findAll() {
    return this.prisma.episode.findMany();
  }

  async findById(id: string) {
    return this.prisma.episode.findUnique({
      where: { id },
    });
  }

  async update(id: string, userId: string, data: UpdateEpisodeDto) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { podcast: true },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    if (episode.podcast.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.episode.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
      include: { podcast: true },
    });

    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    if (episode.podcast.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.episode.delete({ where: { id } });
  }
}
