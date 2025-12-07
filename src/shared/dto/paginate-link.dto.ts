import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaginateLinkResponseDto {
  @ApiPropertyOptional({
    description: 'Link to the first page',
  })
  first?: string;

  @ApiPropertyOptional({
    description: 'Link to the previous page',
  })
  previous?: string;

  @ApiProperty({
    description: 'Link to the current page',
  })
  current: string;

  @ApiPropertyOptional({
    description: 'Link to the next page',
  })
  next?: string;

  @ApiPropertyOptional({
    description: 'Link to the last page',
  })
  last?: string;
}