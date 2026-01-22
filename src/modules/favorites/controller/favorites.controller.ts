import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateFavoriteDto } from '../dto/create-favorites.dto';
import { ResponseFavoriteDto } from '../dto/response-favorites.dto';
import { UpdateFavoriteDto } from '../dto/update-favorites.dto';
import type { PaginateQuery } from 'nestjs-paginate';
import { FavoritesService } from '../service/favorites.service';

@ApiTags('favorites(for all users)')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoriteService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Add movie to favorites' })
  @ApiResponse({
    status: 201,
    description: 'Favorite successfully created',
    type: ResponseFavoriteDto,
  })
  async create(@Body() dto: CreateFavoriteDto): Promise<ResponseFavoriteDto> {
    return this.favoriteService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of favorites with pagination' })
  async getList(@Query() query: PaginateQuery) {
    return this.favoriteService.getList(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one favorite by ID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite found',
    type: ResponseFavoriteDto,
  })
  async findOne(@Param('id') id: string) {
    return this.favoriteService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update favorite record' })
  @ApiResponse({
    status: 200,
    description: 'Favorite successfully updated',
    type: ResponseFavoriteDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateFavoriteDto,
  ): Promise<ResponseFavoriteDto> {
    return this.favoriteService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete favorite record' })
  @ApiResponse({
    status: 200,
    description: 'Favorite successfully deleted',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.favoriteService.remove(+id);
  }
}
