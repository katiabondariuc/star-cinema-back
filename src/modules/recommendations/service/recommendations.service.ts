import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { RecommendationEntity } from '../entity/recommendations.entity';
import { CreateRecommendationDto } from '../dto/create-recommendations.dto';
import { ResponseRecommendationsDto } from '../dto/response-recommendations.dto';
import { UpdateRecommendationsDto } from '../dto/update-recommendations.dto';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectRepository(RecommendationEntity)
    private readonly recommendationRepository: Repository<RecommendationEntity>,
  ) {}

  async create(createRecommendationDto: CreateRecommendationDto): Promise<ResponseRecommendationsDto> {
    const createdRecommendation = this.recommendationRepository.create(createRecommendationDto);
    await this.recommendationRepository.insert(createdRecommendation);
    return plainToInstance(ResponseRecommendationsDto, createdRecommendation);
  }

  async getList(query: PaginateQuery): Promise<{
    data: ResponseRecommendationsDto[];
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
    const result = await paginate(query, this.recommendationRepository, {
      sortableColumns: ['id', 'movie_id', 'user_id', 'score'],
      searchableColumns: ['generated_at'],
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
      data: result.data.map(rec => plainToInstance(ResponseRecommendationsDto, rec)),
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

  async findOne(id: number): Promise<ResponseRecommendationsDto> {
    const recommendation = await this.recommendationRepository.findOneByOrFail({ id });
    return plainToInstance(ResponseRecommendationsDto, recommendation);
  }

  async update(id: number, update: UpdateRecommendationsDto): Promise<ResponseRecommendationsDto> {
    await this.recommendationRepository.update(id, update);
    const updatedRecommendation = await this.recommendationRepository.findOneByOrFail({ id });
    return plainToInstance(ResponseRecommendationsDto, updatedRecommendation);
  }

  async remove(id: number): Promise<void> {
    await this.recommendationRepository.findOneByOrFail({ id });
    await this.recommendationRepository.delete(id);
  }
}
