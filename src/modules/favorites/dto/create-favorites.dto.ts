import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'ID of the user who adds the movie to favorites',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  user_id: number;

  @ApiProperty({
    description: 'ID of the movie being added to favorites',
    example: 12,
  })
  @IsInt()
  @IsPositive()
  movie_id: number;
}
