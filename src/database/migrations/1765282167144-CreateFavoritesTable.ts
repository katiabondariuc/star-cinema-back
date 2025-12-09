import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFavoritesTable1765282167144 implements MigrationInterface {
    name = 'CreateFavoritesTable1765282167144'

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'favorites',
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
            name: 'added_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // --- Add foreign keys ---
    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        name: 'favorites_users_fk',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'favorites',
      new TableForeignKey({
        name:'favorites_movies_fk',
        columnNames: ['movie_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'movies',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('favorites', 'favorites_movies_fk');
    await queryRunner.dropForeignKey('favorites', 'favorites_users_fk');


    await queryRunner.dropTable('favorites');
  }

}
