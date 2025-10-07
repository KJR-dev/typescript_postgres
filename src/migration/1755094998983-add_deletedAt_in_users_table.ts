import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtInUsersTable1755094998983
    implements MigrationInterface
{
    name = 'AddDeletedAtInUsersTable1755094998983';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ADD "deletedAt" TIMESTAMP`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
    }
}
