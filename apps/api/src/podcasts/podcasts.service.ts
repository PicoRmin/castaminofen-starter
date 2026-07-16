import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PodcastsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; rssUrl: string; description?: string; website?: string; artworkUrl?: string }) {
    return this.prisma.podcast.create({ data });
  }

  async findAll() {
    return this.prisma.podcast.findMany();
  }

  async findById(id: string) {
    return this.prisma.podcast.findUnique({
      where: { id },
      include: { episodes: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.podcast.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.podcast.delete({ where: { id } });
  }
}
