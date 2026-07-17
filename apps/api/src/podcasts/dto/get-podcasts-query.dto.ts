import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsIn, Min, Max } from 'class-validator';

export class GetPodcastsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['newest'])
  sort?: 'newest';
}
