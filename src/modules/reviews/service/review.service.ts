import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterOperator, paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
import { InsertErrorHandler } from '../../../database/handlers/insert.error.handler';
import { PaginateResponseDto } from '../../../shared/dto/paginate-response.dto';
import { UpdateErrorHandler } from '../../../database/handlers/update.error.handler';
import { DeleteErrorHandler } from '../../../database/handlers/delete.error.handler';
import { UpdateMovieDto } from '../../movies/dto/update-movie.dto';
import { ReviewEntity } from '../entity/reviews.entity';
import { CreateReviewDto } from '../dto/create-review.dto';
import { ResponseReviewDto } from '../dto/response-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';


@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(
    createReviewPayloadDto: CreateReviewDto,
  ): Promise<ResponseReviewDto> {
    try {
      const createdReview = this.reviewRepository.create(createReviewPayloadDto);
      await this.reviewRepository.insert(createdReview);
      return plainToInstance(ResponseReviewDto, createdReview);
    } catch (error) {
      InsertErrorHandler.handle(error, 'reviews');
      throw error;
    }
  }

  async getList(
    query: PaginateQuery,
  ): Promise<PaginateResponseDto<ResponseReviewDto>> {
    const result = await paginate(query, this.reviewRepository, {
      sortableColumns: ['id', 'movie_id', 'user_id', 'comment'],
      searchableColumns: ['created_at'],
      defaultSortBy: [['id', 'ASC']],
      relations: [],
    });

    return {
      data: result.data.map((review) => plainToInstance(ResponseReviewDto, review)),
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
  async findOne(id: number): Promise<ResponseReviewDto> {
    return await this.reviewRepository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ResponseReviewDto> {
    try {
      await this.reviewRepository.update(id, updateReviewDto);
      const review = await this.reviewRepository.findOneByOrFail({ id });

      return plainToInstance(ResponseReviewDto, review);
    } catch (error) {
      UpdateErrorHandler.handle(error, 'reviews', id);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.reviewRepository.findOneByOrFail({ id });
      await this.reviewRepository.delete(id);
    } catch (error) {
      DeleteErrorHandler.handle(error, 'reviews', id);
    }
  }

}
