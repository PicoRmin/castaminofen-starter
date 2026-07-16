import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { EpisodesModule } from './episodes/episodes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    PodcastsModule,
    EpisodesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
