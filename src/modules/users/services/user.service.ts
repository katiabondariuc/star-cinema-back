import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { hash } from "argon2";
import { plainToInstance } from "class-transformer";
import { InsertErrorHandler } from "../../../database/handlers/insert.error.handler";
import { UpdateUserProfileDto } from "../dto/update-user.dto";
import { UpdateErrorHandler } from "../../../database/handlers/update.error.handler";
import { DeleteErrorHandler } from "../../../database/handlers/delete.error.handler";
import { paginate, PaginateQuery } from "nestjs-paginate";
import { PaginateResponseDto } from "../../../shared/dto/paginate-response.dto";

@Injectable()
export class UserService{
    constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto, manager?: EntityManager): Promise<UserResponseDto
  > {
    try {
      const hashedPassword = await hash(dto.password);

      const repo = manager ? manager.getRepository(UserEntity) : this.userRepository;
      const user = repo.create({ ...dto, password: hashedPassword });
      await repo.insert(user);

      return plainToInstance(UserResponseDto, user);
    } catch (error) {
      InsertErrorHandler.handle(error, 'user');
      throw error;
    }
  }

  async getList(
  query: PaginateQuery,
): Promise<PaginateResponseDto<UserResponseDto>> {
  const result = await paginate(query, this.userRepository, {
    sortableColumns: ['id', 'username', 'email', 'created_at'],
    searchableColumns: ['username', 'email'],
    defaultSortBy: [['id', 'ASC']],
    relations: [],
  });

  return {
    data: result.data.map((user) => plainToInstance(UserResponseDto, user)),
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

  async findOne(id: number, manager?: EntityManager): Promise<UserResponseDto> {
    const repo = manager ? manager.getRepository(UserEntity) : this.userRepository;
    return await repo.findOneByOrFail({ id });
  }

  async updateProfile(id: number, dto: UpdateUserProfileDto): Promise<UserResponseDto> {
    try {
      await this.userRepository.update({ id }, dto);
      const updated = await this.userRepository.findOneByOrFail({ id });
      return plainToInstance(UserResponseDto, updated);
    } catch (error) {
      UpdateErrorHandler.handle(error, 'user', id);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.userRepository.findOneByOrFail({ id });
      await this.userRepository.delete({ id });
    } catch (error) {
      DeleteErrorHandler.handle(error, 'user', id);
    }
  }
}
