"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModification1679030032710 = void 0;
class UserModification1679030032710 {
    constructor() {
        this.name = 'UserModification1679030032710';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "magic_link" text`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "magic_link"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }
}
exports.UserModification1679030032710 = UserModification1679030032710;
//# sourceMappingURL=1679030032710-UserModification.js.map