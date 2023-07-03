"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1621867808537 = void 0;
class InitialMigration1621867808537 {
    constructor() {
        this.name = 'InitialMigration1621867808537';
    }
    async up(queryRunner) {
        await queryRunner.query('CREATE TABLE "login" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "email" text NOT NULL, "password" text, "firstname" text, "lastname" text, "phone" text, "country_code" text, "role" text NOT NULL, "reset_password_token" text, "is_active" boolean NOT NULL DEFAULT true, "provider" text NOT NULL, "magic_link" text, CONSTRAINT "UQ_a1fa377d7cba456bebaa6922edf" UNIQUE ("email"), CONSTRAINT "UQ_3ebe927993cf38a7f09a9a098f3" UNIQUE ("phone"), CONSTRAINT "PK_0e29aa96b7d3fb812ff43fcfcd3" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "role" text NOT NULL, CONSTRAINT "UQ_367aad98203bd8afaed0d704093" UNIQUE ("role"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "otp_secret" text NOT NULL, "otp_verified_at" TIMESTAMP, "mobile_number" text NOT NULL, CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))');
        await queryRunner.query('CREATE TABLE "country" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(6), "name" character varying NOT NULL, "code" character varying NOT NULL, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))');
    }
    async down(queryRunner) {
        await queryRunner.query('DROP TABLE "country"');
        await queryRunner.query('DROP TABLE "otp"');
        await queryRunner.query('DROP TABLE "role"');
        await queryRunner.query('DROP TABLE "login"');
    }
}
exports.InitialMigration1621867808537 = InitialMigration1621867808537;
//# sourceMappingURL=1621867808537-InitialMigration.js.map