import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseRecommendationsDto {
 @ApiProperty({description:'ID of the recommendation', example: 1})
 @Expose()
 id: number

  @ApiProperty({ description: 'ID of the user', example: 1 })
  @Expose()
  user_id: number;

  @ApiProperty({ description: 'ID of the movie', example: 1 })
  @Expose()
  movie_id: number;

  @ApiProperty({ description: 'Recommendation score', required: false, example: 5 })
  @Expose()
  score?: number;
}
