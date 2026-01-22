import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRecommendationDto } from '../dto/create-recommendations.dto';
import { UpdateRecommendationsDto } from '../dto/update-recommendations.dto';
import { ResponseRecommendationsDto } from '../dto/response-recommendations.dto';
import type { PaginateQuery } from 'nestjs-paginate';
import { RecommendationsService } from '../service/recommendations.service';

@ApiTags('Recommendations(for all users)')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recommendation' })
  @ApiResponse({ status: 201, description: 'Recommendation created', type: ResponseRecommendationsDto })
  async create(@Body() createDto: CreateRecommendationDto): Promise<ResponseRecommendationsDto> {
    return this.recommendationsService.create(createDto);
  }

@Get()
@ApiOperation({ summary: 'Get paginated list of recommendations' })
@ApiResponse({
  status: 200,
  description: 'List of recommendations',
})
async getList(@Query() query: PaginateQuery) {
  return this.recommendationsService.getList(query);
}


  @Get(':id')
  @ApiOperation({ summary: 'Get a single recommendation by ID' })
  @ApiResponse({ status: 200, description: 'Recommendation found', type: ResponseRecommendationsDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseRecommendationsDto> {
    return this.recommendationsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a recommendation by ID' })
  @ApiResponse({ status: 200, description: 'Recommendation updated', type: ResponseRecommendationsDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateRecommendationsDto,
  ): Promise<ResponseRecommendationsDto> {
    return this.recommendationsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recommendation by ID' })
  @ApiResponse({ status: 200, description: 'Recommendation deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.recommendationsService.remove(id);
  }
}
