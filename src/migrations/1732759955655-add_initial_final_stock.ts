import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInitialFinalStock1732759955655 implements MigrationInterface {
    name = 'AddInitialFinalStock1732759955655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift" ADD "startStock" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "shift" ADD "endStock" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift" DROP COLUMN "endStock"`);
        await queryRunner.query(`ALTER TABLE "shift" DROP COLUMN "startStock"`);
    }

}
