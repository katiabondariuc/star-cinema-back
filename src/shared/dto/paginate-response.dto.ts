
import { ApiProperty } from '@nestjs/swagger';
import { PaginateLinkResponseDto } from './paginate-link.dto';
import { PaginateMetaResponseDto } from './paginate-meta.dto';

export class PaginateResponseDto<Entity> {
  @ApiProperty({
    description: 'Paginate Link',
    example: PaginateLinkResponseDto,
    type: [PaginateLinkResponseDto],
  })
  links: PaginateLinkResponseDto;

  @ApiProperty({
    description: 'Paginate Meta',
    example: PaginateMetaResponseDto,
    type: [PaginateMetaResponseDto],
  })
  meta: PaginateMetaResponseDto;

  @ApiProperty({
    description: 'Paginate Data',
  })
  data: Entity[];
}