import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateEpisodeDto {
  @IsString()
  podcastId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
