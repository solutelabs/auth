"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntityModified1679034009763 = void 0;
class UserEntityModified1679034009763 {
    constructor() {
        this.name = 'UserEntityModified1679034009763';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "provider" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "provider" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL`);
    }
}
exports.UserEntityModified1679034009763 = UserEntityModified1679034009763;
//# sourceMappingURL=1679034009763-UserEntityModified.js.map