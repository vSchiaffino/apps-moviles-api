import { MigrationInterface, QueryRunner } from "typeorm";

export class Sales1731522909999 implements MigrationInterface {
    name = 'Sales1731522909999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_level_product" DROP CONSTRAINT "FK_456e59e6abd764cfee5ccaaed93"`);
        await queryRunner.query(`CREATE TABLE "sale" ("id" SERIAL NOT NULL, "date" character varying NOT NULL, CONSTRAINT "PK_d03891c457cbcd22974732b5de2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_product" ("id" SERIAL NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "saleId" integer, CONSTRAINT "PK_4c90923fcc89bf8eeecd181fffc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_level_product" ADD CONSTRAINT "FK_456e59e6abd764cfee5ccaaed93" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_product" ADD CONSTRAINT "FK_a50b661dd4ed9ce26b27d17ea2a" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_product" DROP CONSTRAINT "FK_a50b661dd4ed9ce26b27d17ea2a"`);
        await queryRunner.query(`ALTER TABLE "stock_level_product" DROP CONSTRAINT "FK_456e59e6abd764cfee5ccaaed93"`);
        await queryRunner.query(`DROP TABLE "sale_product"`);
        await queryRunner.query(`DROP TABLE "sale"`);
        await queryRunner.query(`ALTER TABLE "stock_level_product" ADD CONSTRAINT "FK_456e59e6abd764cfee5ccaaed93" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
