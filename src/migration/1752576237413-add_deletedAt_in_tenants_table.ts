import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtInTenantsTable1752576237413
    implements MigrationInterface
{
    name = 'AddDeletedAtInTenantsTable1752576237413';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tenants" ADD "deletedAt" TIMESTAMP`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "tenants" DROP COLUMN "deletedAt"`,
        );
    }
}
