import {
    BadRequestException,
    ConflictException,
    HttpException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export class UpdateErrorHandler {
  static handle(
    error: any,
    entity: string,
    id: number,
    relatedEntities: any[] = [],
  ): void {
    if (error instanceof EntityNotFoundError) {
      throw new NotFoundException(`${entity} with id = ${id} not found.`);
    }

    if (error instanceof HttpException) {
      throw error; // просто пробросить
    }

    switch (error.code) {
      case '23505': // Unique violation (PostgreSQL)
      case 'ER_DUP_ENTRY': // Duplicate entry (MySQL)
      case 'SQLITE_CONSTRAINT_UNIQUE':
        throw new ConflictException(
          `Duplicate ${entity} detected. Please check your input data.`,
        );

      case '23503': // Foreign key violation (PostgreSQL)
      case 'ER_ROW_IS_REFERENCED': // MySQL foreign key
      case 'SQLITE_CONSTRAINT_FOREIGNKEY':
        throw new BadRequestException(
          `One or more related entities not found: ${relatedEntities.join(
            ', ',
          )}. Please check your input data.`,
        );

      case '23502': // Not null violation (PostgreSQL)
      case 'SQLITE_CONSTRAINT_NOTNULL':
        throw new BadRequestException(
          'Some required fields are missing. Please check your input data.',
        );

      case '23514': // Check constraint violation (PostgreSQL)
      case 'ER_CHECK_CONSTRAINT_VIOLATED':
        throw new BadRequestException(
          'Invalid value for one or more fields.',
        );

      default:
        throw new InternalServerErrorException(
          'An unexpected error occurred during the update operation.',
        );
    }
  }
}
