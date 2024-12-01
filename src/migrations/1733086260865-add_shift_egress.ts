import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShiftEgress1733086260865 implements MigrationInterface {
    name = 'AddShiftEgress1733086260865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shift_egress" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "shiftId" integer, "productId" integer, "warehouseId" integer, CONSTRAINT "PK_4c763b44b7c8dc00ab2766d08d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shift_egress" ADD CONSTRAINT "FK_c2f1f08e66a1711b624160bf61d" FOREIGN KEY ("shiftId") REFERENCES "shift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shift_egress" ADD CONSTRAINT "FK_2abfc9927b6993506f9a9941101" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shift_egress" ADD CONSTRAINT "FK_e2adcf7f20b5ef96aeae97985df" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shift_egress" DROP CONSTRAINT "FK_e2adcf7f20b5ef96aeae97985df"`);
        await queryRunner.query(`ALTER TABLE "shift_egress" DROP CONSTRAINT "FK_2abfc9927b6993506f9a9941101"`);
        await queryRunner.query(`ALTER TABLE "shift_egress" DROP CONSTRAINT "FK_c2f1f08e66a1711b624160bf61d"`);
        await queryRunner.query(`DROP TABLE "shift_egress"`);
    }

}
