import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { InsertErrorHandler } from '../../../database/handlers/insert.error.handler';
import { PaginateResponseDto } from '../../../shared/dto/paginate-response.dto';
import { UpdateErrorHandler } from '../../../database/handlers/update.error.handler';
import { DeleteErrorHandler } from '../../../database/handlers/delete.error.handler';
import { FavoriteEntity } from '../entity/favorites.entity';
import { CreateFavoriteDto } from '../dto/create-favorites.dto';
import { ResponseFavoriteDto } from '../dto/response-favorites.dto';
import { UpdateMovieDto } from '../../movies/dto/update-movie.dto';
import { UpdateFavoriteDto } from '../dto/update-favorites.dto';


@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  async create(
    createFavoritePayloadDto: CreateFavoriteDto,
  ): Promise<ResponseFavoriteDto> {
    try {
      const createdFavorites = this.favoriteRepository.create(createFavoritePayloadDto);
      await this.favoriteRepository.insert(createdFavorites);
      return plainToInstance(ResponseFavoriteDto, createdFavorites);
    } catch (error) {
      InsertErrorHandler.handle(error, 'favorites');
      throw error;
    }
  }

  async getList(
    query: PaginateQuery,
  ): Promise<PaginateResponseDto<ResponseFavoriteDto>> {
    const result = await paginate(query, this.favoriteRepository, {
      sortableColumns: ['id', 'movie_id', 'user_id'],
      searchableColumns: ['added_at'],
      defaultSortBy: [['id', 'ASC']],
      relations: [],
    });

    return {
      data: result.data.map((favorite) => plainToInstance(ResponseFavoriteDto, favorite)),
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
  async findOne(id: number): Promise<ResponseFavoriteDto> {
    return await this.favoriteRepository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updateFavoriteDto: UpdateFavoriteDto,
  ): Promise<ResponseFavoriteDto> {
    try {
      await this.favoriteRepository.update(id, updateFavoriteDto);
      const favorite = await this.favoriteRepository.findOneByOrFail({ id });

      return plainToInstance(ResponseFavoriteDto, favorite);
    } catch (error) {
      UpdateErrorHandler.handle(error, 'favorites', id);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.favoriteRepository.findOneByOrFail({ id });
      await this.favoriteRepository.delete(id);
    } catch (error) {
      DeleteErrorHandler.handle(error, 'favorites', id);
    }
  }

}
