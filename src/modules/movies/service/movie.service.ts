import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { MovieEntity } from '../entity/movie.entity';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { MovieResponseDto } from '../dto/response-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieResponseDto> {
    const createdMovie = this.movieRepository.create(createMovieDto);
    await this.movieRepository.insert(createdMovie);
    return plainToInstance(MovieResponseDto, createdMovie);
  }

  async getList(query: PaginateQuery): Promise<{
    data: MovieResponseDto[];
    meta: {
      itemsPerPage: number;
      totalItems: number;
      currentPage: number;
      totalPages: number;
      sortBy: [string, 'ASC' | 'DESC'][];
      searchBy?: string[];
      search?: string;
      select: string[];
      filter?: Record<string, any>;
    };
    links: {
      first?: string;
      previous?: string;
      current?: string;
      next?: string;
      last?: string;
    };
  }> {
    const result = await paginate(query, this.movieRepository, {
      sortableColumns: ['id', 'title', 'release_year', 'created_at'],
      searchableColumns: ['release_year'],
      defaultSortBy: [['id', 'ASC']],
      relations: [],
    });

    const meta = {
      itemsPerPage: result.meta.itemsPerPage,
      totalItems: result.meta.totalItems ?? 0,
      currentPage: result.meta.currentPage ?? 1,
      totalPages: result.meta.totalPages ?? 1,
      sortBy: result.meta.sortBy,
      searchBy: result.meta.searchBy,
      search: result.meta.search,
      select: [],
      filter: result.meta.filter,
    };

    return {
      data: result.data.map(movie => plainToInstance(MovieResponseDto, movie)),
      meta,
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
    const movie = await this.movieRepository.findOneByOrFail({ id });
    return plainToInstance(MovieResponseDto, movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<MovieResponseDto> {
    await this.movieRepository.update(id, updateMovieDto);
    const updatedMovie = await this.movieRepository.findOneByOrFail({ id });
    return plainToInstance(MovieResponseDto, updatedMovie);
  }

  async remove(id: number): Promise<void> {
    await this.movieRepository.findOneByOrFail({ id });
    await this.movieRepository.delete(id);
  }
}
