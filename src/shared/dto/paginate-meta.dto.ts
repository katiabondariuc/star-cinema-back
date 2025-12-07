import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginateMetaResponseDto {
  @ApiProperty({
    example: 5,
    description: 'Total items per page',
  })
  itemsPerPage: number;

  @ApiProperty({
    example: 10,
    description: 'Total items count in the database',
  })
  totalItems: number;

  @ApiProperty({
    example: 1,
    description: 'Current page number',
  })
  currentPage: number;

  @ApiProperty({
    example: 2,
    description: 'Total number of pages',
  })
  totalPages: number;

  @ApiProperty({
    example: [['id', 'DESC']],
    description: 'Sorting criteria as [column, direction]',
    type: () => [[String]],
  })
  sortBy: [string, 'ASC' | 'DESC'][];

  @ApiProperty({
    example: ['name'],
    description: 'Columns used in search',
    type: [String],
  })
  searchBy: string[];

  @ApiProperty({
    example: 'movie name',
    description: 'Search query string',
  })
  search: string;

  @ApiProperty({
    example: ['id', 'name'],
    description: 'Fields selected for response',
    type: [String],
  })
  select: string[];

  @ApiPropertyOptional({
    example: { name: 'movie name' },
    description: 'Key-value filter criteria',
    type: Object,
  })
  filter?: { [key: string]: string | string[] };
}