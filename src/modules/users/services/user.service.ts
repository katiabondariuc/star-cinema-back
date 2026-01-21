import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, EntityManager } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { UpdateUserProfileDto } from "../dto/update-user.dto";
import { plainToInstance } from "class-transformer";
import * as bcrypt from 'bcrypt';
import {  PaginateQuery, paginate } from "nestjs-paginate";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(dto: CreateUserDto, manager?: EntityManager): Promise<UserResponseDto> {
  const hashedPassword = await bcrypt.hash(dto.password, 10); // 10 salt rounds
  const repo = manager ? manager.getRepository(UserEntity) : this.userRepository;
  const user = repo.create({ ...dto, password: hashedPassword });
  await repo.save(user);
  return plainToInstance(UserResponseDto, user);
}

async getList(query: PaginateQuery): Promise<{
  data: UserResponseDto[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [keyof UserResponseDto, 'ASC' | 'DESC'][];
    searchBy: (keyof UserResponseDto)[];
    search?: string;
    select: string[];
    filter?: Record<string, any>;
  };
  links: {
    first?: string;
    previous?: string;
    next?: string;
    last?: string;
  };
}> {
  const result = await paginate(query, this.userRepository, {
    sortableColumns: ['id', 'username', 'email', 'created_at'],
    searchableColumns: ['username', 'email'],
    defaultSortBy: [['id', 'ASC']],
  });

  const meta = {
    itemsPerPage: result.meta.itemsPerPage,
    totalItems: result.meta.totalItems ?? 0,
    currentPage: result.meta.currentPage ?? 1,
    totalPages: result.meta.totalPages ?? 1,
    sortBy: result.meta.sortBy.map(
      ([column, order]) => [column as keyof UserResponseDto, order] as [keyof UserResponseDto, 'ASC' | 'DESC']
    ),
    searchBy: ['username', 'email'] as (keyof UserResponseDto)[],
    search: result.meta.search,
    select: [],
    filter: result.meta.filter,
  };

  return {
    data: result.data.map(user => plainToInstance(UserResponseDto, user)),
    meta,
    links: result.links,
  };
}

  async findOne(id: number, manager?: EntityManager): Promise<UserResponseDto> {
    const repo = manager ? manager.getRepository(UserEntity) : this.userRepository;
    const user = await repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(UserResponseDto, user);
  }

  async updateProfile(id: number, dto: UpdateUserProfileDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.update(id, dto);
    const updated = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(UserResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}
