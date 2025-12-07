import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { MovieEntity } from '../entity/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { MovieResponseDto } from '../dto/response-movie.dto';
import { InsertErrorHandler } from '../../../database/handlers/insert.error.handler';
import { PaginateResponseDto } from '../../../shared/dto/paginate-response.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { UpdateErrorHandler } from '../../../database/handlers/update.error.handler';
import { DeleteErrorHandler } from '../../../database/handlers/delete.error.handler';


@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async create(
    createMoviePayloadDto: CreateMovieDto,
  ): Promise<MovieResponseDto> {
    try {
      const createdMovie = this.movieRepository.create(createMoviePayloadDto);
      await this.movieRepository.insert(createdMovie);
      return plainToInstance(MovieResponseDto, createdMovie);
    } catch (error) {
      InsertErrorHandler.handle(error, 'movies');
      throw error;
    }
  }

  async getList(
    query: PaginateQuery,
  ): Promise<PaginateResponseDto<MovieResponseDto>> {
    const result = await paginate(query, this.movieRepository, {
      sortableColumns: ['id', 'title', 'release_year', 'created_at'],
      searchableColumns: ['release_year'],
      defaultSortBy: [['id', 'ASC']],
      relations: [],
    });

    return {
      data: result.data.map((movie) => plainToInstance(MovieResponseDto, movie)),
      meta: {
        itemsPerPage: result.meta.itemsPerPage,
        totalItems: result.meta.totalItems ?? 0, // <--- дефолт
        currentPage: result.meta.currentPage ?? 1,
        totalPages: result.meta.totalPages ?? 1,
        sortBy: result.meta.sortBy,
        search: result.meta.search,
        filter: result.meta.filter,
        searchBy: result.meta.searchBy,
        select: []
      },
      links: {
        first: result.links.first,
        previous: result.links.previous,
        current: result.links.current,
        next: result.links.next,
        last: result.links.last,
      },
    };
  }
  async findOne(id: number): Promise<MovieResponseDto> {
    return await this.movieRepository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieResponseDto> {
    try {
      await this.movieRepository.update(id, updateMovieDto);
      const movie = await this.movieRepository.findOneByOrFail({ id });

      return plainToInstance(MovieResponseDto, movie);
    } catch (error) {
      UpdateErrorHandler.handle(error, 'movies', id);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.movieRepository.findOneByOrFail({ id });
      await this.movieRepository.delete(id);
    } catch (error) {
      DeleteErrorHandler.handle(error, 'movies', id);
    }
  }

}
