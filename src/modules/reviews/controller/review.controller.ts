import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { PaginateQuery } from 'nestjs-paginate';

import { CreateReviewDto } from '../dto/create-review.dto';
import { ResponseReviewDto } from '../dto/response-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { ReviewService } from '../service/review.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // === CREATE ===
  @Post()
  @ApiOperation({ summary: 'Create new review' })
  @ApiResponse({
    status: 201,
    description: 'Review successfully created',
    type: ResponseReviewDto,
  })
  async create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  // === LIST (PAGINATION) ===
@Get()
@ApiOperation({ summary: 'Get paginated list of reviews' })
@ApiResponse({ status: 200, description: 'Paginated list of reviews' })
async getList(@Query() query: PaginateQuery) {
  return this.reviewService.getList(query);
}

  // === GET ONE ===
  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Review successfully returned',
    type: ResponseReviewDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  // === UPDATE ===
  @Put(':id')
  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({
    status: 200,
    description: 'Review successfully updated',
    type: ResponseReviewDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewService.update(id, updateReviewDto);
  }

  // === DELETE ===
  @Delete(':id')
  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({
    status: 200,
    description: 'Review successfully deleted',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
