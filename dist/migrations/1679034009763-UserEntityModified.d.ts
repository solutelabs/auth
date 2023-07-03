import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UserEntityModified1679034009763 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
