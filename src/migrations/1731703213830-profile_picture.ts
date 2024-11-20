import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfilePicture1731703213830 implements MigrationInterface {
    name = 'ProfilePicture1731703213830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_product" DROP CONSTRAINT "FK_a50b661dd4ed9ce26b27d17ea2a"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profilePictureUrl" character varying NOT NULL DEFAULT 'https://variacion-canasta-zips.s3.sa-east-1.amazonaws.com/default-profile-picture.jpg'`);
        await queryRunner.query(`ALTER TABLE "sale_product" ADD CONSTRAINT "FK_a50b661dd4ed9ce26b27d17ea2a" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_product" DROP CONSTRAINT "FK_a50b661dd4ed9ce26b27d17ea2a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profilePictureUrl"`);
        await queryRunner.query(`ALTER TABLE "sale_product" ADD CONSTRAINT "FK_a50b661dd4ed9ce26b27d17ea2a" FOREIGN KEY ("saleId") REFERENCES "sale"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
