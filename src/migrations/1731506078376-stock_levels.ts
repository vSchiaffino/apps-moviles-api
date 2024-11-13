import { MigrationInterface, QueryRunner } from "typeorm";

export class StockLevels1731506078376 implements MigrationInterface {
    name = 'StockLevels1731506078376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stock_level_product" ("id" SERIAL NOT NULL, "initialStock" integer NOT NULL, "finalStock" integer NOT NULL, "stockLevelId" integer, "productId" integer, CONSTRAINT "PK_dda0d2580ff55ca940846ca2428" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stock_level" ("id" SERIAL NOT NULL, "date" date NOT NULL, CONSTRAINT "PK_88ff7d9dfb57dc9d435e365eb69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stock_level_product" ADD CONSTRAINT "FK_1f198f9d26f0991eb29b41e85aa" FOREIGN KEY ("stockLevelId") REFERENCES "stock_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stock_level_product" ADD CONSTRAINT "FK_456e59e6abd764cfee5ccaaed93" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock_level_product" DROP CONSTRAINT "FK_456e59e6abd764cfee5ccaaed93"`);
        await queryRunner.query(`ALTER TABLE "stock_level_product" DROP CONSTRAINT "FK_1f198f9d26f0991eb29b41e85aa"`);
        await queryRunner.query(`DROP TABLE "stock_level"`);
        await queryRunner.query(`DROP TABLE "stock_level_product"`);
    }

}
