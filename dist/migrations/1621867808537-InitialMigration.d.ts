import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class InitialMigration1621867808537 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
