
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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import * as nestjsPaginate from 'nestjs-paginate';
import { MovieService } from '../service/movie.service';
import { MovieResponseDto } from '../dto/response-movie.dto';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({ status: 201, description: 'Movie successfully created', type: MovieResponseDto })
  async create(@Body() createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    return this.movieService.create(createMovieDto);
  }
@Get()
@ApiOperation({ summary: 'Get list of movies with pagination' })
@ApiResponse({
  status: 200,
  description: 'Paginated list of movies',
})
async getList(@Query() query: nestjsPaginate.PaginateQuery) {
  return this.movieService.getList(query);
}


  @Get(':id')
  @ApiOperation({ summary: 'Get a single movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Movie details', type: MovieResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MovieResponseDto> {
    return this.movieService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 200, description: 'Updated movie', type: MovieResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    return this.movieService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a movie by ID' })
  @ApiParam({ name: 'id', description: 'Movie ID', type: Number })
  @ApiResponse({ status: 204, description: 'Movie successfully deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.movieService.remove(id);
  }
}
