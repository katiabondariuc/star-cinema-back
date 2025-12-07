import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export class InsertErrorHandler {
  static handle(error: any, entity: string, relatedEntities: any[] = []): void {
    switch (error.code) {
      // Handle unique constraint violations (e.g., duplicate email, name)
      case '23505': // Unique violation (PostgreSQL)
      case 'ER_DUP_ENTRY': // Duplicate entry (MySQL)
      case 'SQLITE_CONSTRAINT_UNIQUE': // SQLite unique constraint
        throw new ConflictException(`Duplicate ${entity} detected. Please check your input data.`);

      // Handle foreign key violations (e.g., trying to update with a non-existing reference)
      case '23503': // Foreign key violation (PostgreSQL)
      case 'ER_ROW_IS_REFERENCED': // MySQL foreign key
      case 'SQLITE_CONSTRAINT_FOREIGNKEY': // SQLite foreign key
        throw new BadRequestException(
          `One or more related entities not found: ${relatedEntities.join(',')}. Please check your input data.,`
        );

      // Handle not null constraint violations (e.g., missing required field)
      case '23502': // Not null violation (PostgreSQL)
      case 'SQLITE_CONSTRAINT_NOTNULL': // SQLite not null
        throw new BadRequestException(
          'Some required fields are missing. Please check your input data.',
        );

      // Handle check constraint violations (e.g., invalid values for fields)
      case '23514': // Check constraint violation (PostgreSQL)
      case 'ER_CHECK_CONSTRAINT_VIOLATED': // MySQL check constraint
        throw new BadRequestException('Invalid value for one or more fields.');

      // Handle any other errors that do not match known codes
      default:
        throw new InternalServerErrorException(
          'An unexpected error occurred during the update operation.',
        );
    }
  }
}