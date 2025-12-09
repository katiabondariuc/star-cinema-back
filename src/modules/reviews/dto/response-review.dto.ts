import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseReviewDto {
  @ApiProperty({example: 1, description: 'ID od the review'})
  @Expose()
  id: number;

  @ApiProperty({ example: 1, description: 'ID of the user who wrote the review' })
  @Expose()
  user_id: number;

  @ApiProperty({ example: 5, description: 'ID of the movie being reviewed' })
  @Expose()
  movie_id: number;

  @ApiProperty({
    example: 4,
    description: 'Rating from 1 to 5',
  })
  @Expose()
  rating: number;

  @ApiProperty({
    example: 'Amazing movie!',
    description: 'Optional comment for the review',
  })
  @Expose()
  comment?: string;
}
