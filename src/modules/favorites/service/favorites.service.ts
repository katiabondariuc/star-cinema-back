import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { FavoriteEntity } from '../entity/favorites.entity';
import { CreateFavoriteDto } from '../dto/create-favorites.dto';
import { ResponseFavoriteDto } from '../dto/response-favorites.dto';
import { UpdateFavoriteDto } from '../dto/update-favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<ResponseFavoriteDto> {
    const createdFavorite = this.favoriteRepository.create(createFavoriteDto);
    await this.favoriteRepository.insert(createdFavorite);
    return plainToInstance(ResponseFavoriteDto, createdFavorite);
  }

  async getList(query: PaginateQuery): Promise<{
    data: ResponseFavoriteDto[];
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
    const result = await paginate(query, this.favoriteRepository, {
      sortableColumns: ['id', 'movie_id', 'user_id'],
      searchableColumns: ['added_at'],
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
      data: result.data.map(favorite => plainToInstance(ResponseFavoriteDto, favorite)),
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

  async findOne(id: number): Promise<ResponseFavoriteDto> {
    const favorite = await this.favoriteRepository.findOneByOrFail({ id });
    return plainToInstance(ResponseFavoriteDto, favorite);
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto): Promise<ResponseFavoriteDto> {
    await this.favoriteRepository.update(id, updateFavoriteDto);
    const updatedFavorite = await this.favoriteRepository.findOneByOrFail({ id });
    return plainToInstance(ResponseFavoriteDto, updatedFavorite);
  }

  async remove(id: number): Promise<void> {
    await this.favoriteRepository.findOneByOrFail({ id });
    await this.favoriteRepository.delete(id);
  }
}
