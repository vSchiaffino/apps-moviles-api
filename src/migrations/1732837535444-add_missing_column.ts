import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingColumn1732837535444 implements MigrationInterface {
    name = 'AddMissingColumn1732837535444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift" ADD "missing" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift" DROP COLUMN "missing"`);
    }

}
