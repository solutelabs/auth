import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UserModification1679030032710 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
