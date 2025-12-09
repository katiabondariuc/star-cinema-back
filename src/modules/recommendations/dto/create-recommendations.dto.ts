import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateRecommendationDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'ID of the movie', example: 1 })
  @IsNumber()
  movie_id: number;

  @ApiProperty({ description: 'Recommendation score', required: false, example: 5 })
  @IsOptional()
  @IsNumber()
  score?: number;
}
