"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const entity_1 = require("../../../app/auth/entity");
const entity_2 = require("../../../app/auth/otp/entity");
const entity_3 = require("../../../app/country/entity");
const environment_1 = require("../../environment");
const config = {
    type: 'postgres',
    url: environment_1.DATABASE_URL,
    entities: [entity_1.RoleEntity, entity_1.LoginEntity, entity_2.OtpEntity, entity_3.CountryEntity, entity_1.UserEntity],
    logging: environment_1.ENVIRONMENT === 'local',
    synchronize: false,
    migrations: [path_1.default.join(__dirname, '../../../migrations/*{.ts,.js}')],
    cli: {
        migrationsDir: 'src/migrations',
        entitiesDir: 'src/app/**/entity/*.entity{.ts,.js}',
    },
};
module.exports = config;
//# sourceMappingURL=index.js.map