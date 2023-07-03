import {MigrationInterface, QueryRunner} from "typeorm";

export class countryCode1680525815243 implements MigrationInterface {
    name = 'countryCode1680525815243'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "country_id" TO "country_code"`);
        await queryRunner.query(`ALTER TABLE "login" DROP CONSTRAINT "UQ_3ebe927993cf38a7f09a9a098f3"`);
        await queryRunner.query(`ALTER TABLE "login" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "login" DROP COLUMN "country_code"`);
        await queryRunner.query(`ALTER TABLE "login" ADD "contact" text`);
        await queryRunner.query(`ALTER TABLE "login" ADD CONSTRAINT "UQ_afa04ea7379eadadebb76a99fc9" UNIQUE ("contact")`);
        await queryRunner.query(`ALTER TABLE "login" ADD "country_id" text`);
        await queryRunner.query(`ALTER TABLE "login" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "login" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "country" ALTER COLUMN "created_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "country" ALTER COLUMN "updated_at" SET DEFAULT ('now'::text)::timestamp(6) with time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "country" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "country" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "otp" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "role" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "login" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "login" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE "login" DROP COLUMN "country_id"`);
        await queryRunner.query(`ALTER TABLE "login" DROP CONSTRAINT "UQ_afa04ea7379eadadebb76a99fc9"`);
        await queryRunner.query(`ALTER TABLE "login" DROP COLUMN "contact"`);
        await queryRunner.query(`ALTER TABLE "login" ADD "country_code" text`);
        await queryRunner.query(`ALTER TABLE "login" ADD "phone" text`);
        await queryRunner.query(`ALTER TABLE "login" ADD CONSTRAINT "UQ_3ebe927993cf38a7f09a9a098f3" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "country_code" TO "country_id"`);
    }

}
