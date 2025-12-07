import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

export class DeleteErrorHandler {
  static handle(
    error: any,
    entity: string,
    id: number,
    relatedEntities: any[] = [],
  ): never {
    if (error instanceof EntityNotFoundError) {
      throw new NotFoundException(`${entity} with id = ${id} not found.`);
    }

    switch (error.code) {
      // Foreign key violation — entity is still referenced
      case '23503': // PostgreSQL
      case 'ER_ROW_IS_REFERENCED_2': // MySQL
      case 'SQLITE_CONSTRAINT_FOREIGNKEY': // SQLite
        throw new ConflictException(
          `Cannot delete ${entity} with id = ${id} because it is referenced by other entities: ${relatedEntities.join(
            ', ',
          )}.`,
        );

      // General constraint violation (can happen in some DBs)
      case '23000': // SQL general integrity constraint violation
        throw new BadRequestException(
          'Failed to delete due to data integrity constraints.',
        );

      // Default: unknown or unhandled error
      default:
        throw new InternalServerErrorException(
          'An unexpected error occurred during the delete operation.',
        );
    }
  }
}
