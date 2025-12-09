import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID of the user who wrote the review' })
  @IsInt()
  user_id: number;

  @ApiProperty({ example: 5, description: 'ID of the movie being reviewed' })
  @IsInt()
  movie_id: number;

  @ApiProperty({
    example: 4,
    description: 'Rating from 1 to 5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    example: 'Amazing movie!',
    required: false,
    description: 'Optional comment for the review',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
