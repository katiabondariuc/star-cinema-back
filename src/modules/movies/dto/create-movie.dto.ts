
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, MaxLength, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Inception', description: 'Movie title' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 2010, description: 'Year of release', required: false })
  @IsOptional()
  @IsInt()
  release_year?: number;

  @ApiProperty({ example: 148, description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({ example: 'Sci-Fi', description: 'Genre', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  genre?: string;

  @ApiProperty({ example: 'A mind-bending thriller...', description: 'Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Christopher Nolan', description: 'Director', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  director?: string;

  @ApiProperty({ example: 'English', description: 'Language', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;
}
