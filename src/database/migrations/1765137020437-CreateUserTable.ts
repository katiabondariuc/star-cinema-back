import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUserTable1765137020437 implements MigrationInterface {
    name = 'CreateUserTable1765137020437'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                        unsigned: true,
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        isNullable: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["USER", "ADMIN"], // подставь значения из MainRoleEnum
                        default: "'USER'",
                    },
                    {
                        name: "created_at",
                        type: "timestamptz",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }

}
