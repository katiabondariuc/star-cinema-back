
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MovieResponseDto {
  @ApiProperty({ example: 1, description: 'Movie ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Inception', description: 'Movie title' })
  @Expose()
  title: string;

  @ApiProperty({ example: 2010, description: 'Year of release', required: false })
  @Expose()
  release_year?: number;

  @ApiProperty({ example: 148, description: 'Duration in minutes', required: false })
  @Expose()
  duration?: number;

  @ApiProperty({ example: 'Sci-Fi', description: 'Genre', required: false })
  @Expose()
  genre?: string;

  @ApiProperty({ example: 'A mind-bending thriller...', description: 'Description', required: false })
  @Expose()
  description?: string;

  @ApiProperty({ example: 'Christopher Nolan', description: 'Director', required: false })
  @Expose()
  director?: string;

  @ApiProperty({ example: 'English', description: 'Language', required: false })
  @Expose()
  language?: string;

  @ApiProperty({ example: '2025-12-07T22:00:00.000Z', description: 'Created at' })
  @Expose()
  created_at: Date;
}

