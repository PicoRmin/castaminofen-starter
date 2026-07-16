import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EpisodesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { podcastId: string; title: string; description?: string; audioUrl?: string; publishedAt?: Date }) {
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

  async update(id: string, data: any) {
    return this.prisma.episode.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.episode.delete({ where: { id } });
  }
}
