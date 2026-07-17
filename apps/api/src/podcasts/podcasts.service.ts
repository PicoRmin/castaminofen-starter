import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePodcastDto } from './dto/create-podcast.dto';
import { UpdatePodcastDto } from './dto/update-podcast.dto';
import { GetPodcastsQueryDto } from './dto/get-podcasts-query.dto';

@Injectable()
export class PodcastsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePodcastDto & { ownerId: string }) {
    return this.prisma.podcast.create({ data });
  }

  async findAll(query: GetPodcastsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.PodcastWhereInput | undefined = query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : undefined;

    const orderBy = query.sort === 'newest' ? { createdAt: 'desc' as const } : { createdAt: 'desc' as const };

    const [total, data] = await Promise.all([
      this.prisma.podcast.count({ where }),
      this.prisma.podcast.findMany({ where, orderBy, skip, take: limit }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: string) {
    const podcast = await this.prisma.podcast.findUnique({
      where: { id },
      include: { episodes: true },
    });

    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    return podcast;
  }

  async findEpisodesByPodcastId(podcastId: string) {
    const podcast = await this.prisma.podcast.findUnique({ where: { id: podcastId } });
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }

    return this.prisma.episode.findMany({
      where: { podcastId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, data: UpdatePodcastDto) {
    const podcast = await this.prisma.podcast.findUnique({ where: { id } });
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
    if (podcast.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.podcast.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const podcast = await this.prisma.podcast.findUnique({ where: { id } });
    if (!podcast) {
      throw new NotFoundException('Podcast not found');
    }
    if (podcast.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.prisma.podcast.delete({ where: { id } });
  }
}
