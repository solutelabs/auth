import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UserEntity1678953705487 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
