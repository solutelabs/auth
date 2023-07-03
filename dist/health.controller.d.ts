import { TypeOrmHealthIndicator, HealthCheckService } from '@nestjs/terminus';
export declare class HealthController {
    private health;
    private dbHealth;
    constructor(health: HealthCheckService, dbHealth: TypeOrmHealthIndicator);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
