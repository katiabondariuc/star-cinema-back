import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateReviewsTable1765284053381 implements MigrationInterface {
    name = 'CreateReviewsTable1765284053381'

    public async up(queryRunner: QueryRunner): Promise<void> {
    // --- CREATE TABLE ---
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'user_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'movie_id',
            type: 'int',
            unsigned: true,
            isNullable: false,
          },
          {
            name: 'rating',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // --- FOREIGN KEYS ---
    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        name: 'reviews_user_fk',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'reviews',
      new TableForeignKey({
        name: 'reviews_movies_fk',
        columnNames: ['movie_id'],
        referencedTableName: 'movies',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('reviews', 'reviews_users_fk')
    await queryRunner.dropForeignKey('reviews', 'reviews_movies_fk')
    await queryRunner.dropTable('reviews');
  }

}
