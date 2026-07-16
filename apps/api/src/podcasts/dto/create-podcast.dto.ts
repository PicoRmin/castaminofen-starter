import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  title: string;

  @IsString()
  rssUrl: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsUrl()
  artworkUrl?: string;
}
