"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity1678953705487 = void 0;
class UserEntity1678953705487 {
    constructor() {
        this.name = 'UserEntity1678953705487';
    }
    async up(queryRunner) {
        console.log('creating user table');
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "email" text NOT NULL, "contact" text, "password" text, "firstname" text, "lastname" text, "reset_password_token" text, "profile_pic" text, "google_id" text, "facebook_id" text, "twitter_id" text, "apple_id" text, "is_active" boolean NOT NULL DEFAULT true, "provider" text NOT NULL, "country_id" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_7adac5c0b28492eb292d4a93871" UNIQUE ("google_id"), CONSTRAINT "UQ_189473aaba06ffd667bb024e71a" UNIQUE ("facebook_id"), CONSTRAINT "UQ_55008adb3b4101af12f495c9c1d" UNIQUE ("twitter_id"), CONSTRAINT "UQ_fda2d885fb612212b85752f5ab1" UNIQUE ("apple_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
exports.UserEntity1678953705487 = UserEntity1678953705487;
//# sourceMappingURL=1678953705487-UserEntity.js.map