import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({ example: 1, description: 'ID of the user who wrote the review' })
  @IsInt()
  @IsOptional()
  user_id?: number;

  @ApiProperty({ example: 5, description: 'ID of the movie being reviewed' })
  @IsInt()
  @IsOptional()
  movie_id?: number;

  @ApiProperty({
    example: 4,
    description: 'Rating from 1 to 5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: 'Amazing movie!',
    required: false,
    description: 'Optional comment for the review',
  })
  @IsOptional()
  @IsString()
  @IsOptional()
  comment?: string;
}
