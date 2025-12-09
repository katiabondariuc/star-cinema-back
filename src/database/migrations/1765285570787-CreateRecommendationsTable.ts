import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRecommendationsTable1765285570787 implements MigrationInterface {
    name = 'CreateRecommendationsTable1765285570787'

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recommendations',
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
            name: 'score',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'generated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'recommendations_users_fk',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
              name: 'recommendations_movies_fk',
            columnNames: ['movie_id'],
            referencedTableName: 'movies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('recommendations', 'recommendations_movies_fk')
    await queryRunner.dropForeignKey('recommendations', 'recommendations_users_fk')
    await queryRunner.dropTable('recommendations');
  }
}
