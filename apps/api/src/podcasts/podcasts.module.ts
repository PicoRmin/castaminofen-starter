import { Module } from '@nestjs/common';
import { PodcastsService } from './podcasts.service';
import { PodcastsController } from './podcasts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PodcastsService],
  controllers: [PodcastsController],
  exports: [PodcastsService],
})
export class PodcastsModule {}
