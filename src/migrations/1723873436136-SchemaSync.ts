import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1723873436136 implements MigrationInterface {
    name = 'SchemaSync1723873436136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "price" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "price"`);
    }

}
