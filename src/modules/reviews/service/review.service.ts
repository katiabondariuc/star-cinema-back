import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { plainToInstance } from 'class-transformer';
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

  async create(createReviewDto: CreateReviewDto): Promise<ResponseReviewDto> {
    const createdReview = this.reviewRepository.create(createReviewDto);
    await this.reviewRepository.insert(createdReview);
    return plainToInstance(ResponseReviewDto, createdReview);
  }

  async getList(query: PaginateQuery): Promise<{
    data: ResponseReviewDto[];
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
    const result = await paginate(query, this.reviewRepository, {
      sortableColumns: ['id', 'movie_id', 'user_id', 'comment'],
      searchableColumns: ['created_at'],
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
      data: result.data.map(review => plainToInstance(ResponseReviewDto, review)),
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

  async findOne(id: number): Promise<ResponseReviewDto> {
    const review = await this.reviewRepository.findOneByOrFail({ id });
    return plainToInstance(ResponseReviewDto, review);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<ResponseReviewDto> {
    await this.reviewRepository.update(id, updateReviewDto);
    const updatedReview = await this.reviewRepository.findOneByOrFail({ id });
    return plainToInstance(ResponseReviewDto, updatedReview);
  }

  async remove(id: number): Promise<void> {
    await this.reviewRepository.findOneByOrFail({ id });
    await this.reviewRepository.delete(id);
  }
}
