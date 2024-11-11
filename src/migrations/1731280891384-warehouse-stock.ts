import { MigrationInterface, QueryRunner } from "typeorm";

export class WarehouseStock1731280891384 implements MigrationInterface {
    name = 'WarehouseStock1731280891384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "warehouse_stock" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "warehouseId" integer, "productId" integer, CONSTRAINT "PK_322b20c9d37694411ea10c733c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_3b428dd94da788ba06938ccd063" FOREIGN KEY ("warehouseId") REFERENCES "warehouse"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" ADD CONSTRAINT "FK_a9c427fdd01a2007b29a59f442e" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_a9c427fdd01a2007b29a59f442e"`);
        await queryRunner.query(`ALTER TABLE "warehouse_stock" DROP CONSTRAINT "FK_3b428dd94da788ba06938ccd063"`);
        await queryRunner.query(`DROP TABLE "warehouse_stock"`);
    }

}
