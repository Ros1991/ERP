import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetTokenToUser1692000000001 implements MigrationInterface {
    name = 'AddResetTokenToUser1692000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token_hash" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "reset_token_expires" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token_expires"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "reset_token_hash"`);
    }

}
