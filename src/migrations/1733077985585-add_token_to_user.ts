import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenToUser1733077985585 implements MigrationInterface {
    name = 'AddTokenToUser1733077985585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token"`);
    }

}
