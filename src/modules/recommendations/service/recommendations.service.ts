import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { InsertErrorHandler } from '../../../database/handlers/insert.error.handler';
import { PaginateResponseDto } from '../../../shared/dto/paginate-response.dto';
import { UpdateErrorHandler } from '../../../database/handlers/update.error.handler';
import { DeleteErrorHandler } from '../../../database/handlers/delete.error.handler';
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

  async create(
    createRecommendationsPayloadDto: CreateRecommendationDto,
  ): Promise<ResponseRecommendationsDto> {
    try {
      const createdRecommendations = this.recommendationRepository.create(createRecommendationsPayloadDto);
      await this.recommendationRepository.insert(createdRecommendations);
      return plainToInstance(ResponseRecommendationsDto, createdRecommendations);
    } catch (error) {
      InsertErrorHandler.handle(error, 'recommendations');
      throw error;
    }
  }

  async getList(
    query: PaginateQuery,
  ): Promise<PaginateResponseDto<ResponseRecommendationsDto>> {
    const result = await paginate(query, this.recommendationRepository, {
      sortableColumns: ['id', 'movie_id', 'user_id', 'score'],
      searchableColumns: ['generated_at'],
      defaultSortBy: [['id', 'ASC']],
      relations: [],
    });

    return {
      data: result.data.map((recommendation) => plainToInstance(ResponseRecommendationsDto, recommendation)),
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
  async findOne(id: number): Promise<ResponseRecommendationsDto> {
    return await this.recommendationRepository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    update: UpdateRecommendationsDto,
  ): Promise<ResponseRecommendationsDto> {
    try {
      await this.recommendationRepository.update(id, update);
      const recommendation = await this.recommendationRepository.findOneByOrFail({ id });

      return plainToInstance(ResponseRecommendationsDto, recommendation);
    } catch (error) {
      UpdateErrorHandler.handle(error, 'recommendations', id);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.recommendationRepository.findOneByOrFail({ id });
      await this.recommendationRepository.delete(id);
    } catch (error) {
      DeleteErrorHandler.handle(error, 'recommendations', id);
    }
  }

}
