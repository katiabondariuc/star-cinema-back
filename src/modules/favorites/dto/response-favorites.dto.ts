import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

@Exclude()
export class ResponseFavoriteDto {
   @ApiProperty({
    description: 'ID of favorites',
    example: 1
   })
   @Expose()
   id: number

  @ApiProperty({
    description: 'ID of the user who adds the movie to favorites',
    example: 5,
  })
  @Expose()
  user_id: number;

  @ApiProperty({
    description: 'ID of the movie being added to favorites',
    example: 12,
  })
  @Expose()
  movie_id: number;
}
