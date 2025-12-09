import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateFavoriteDto {
  @ApiProperty({
    description: 'ID of the user who adds the movie to favorites',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  user_id?: number;

  @ApiProperty({
    description: 'ID of the movie being added to favorites',
    example: 12,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  movie_id?: number;
}
