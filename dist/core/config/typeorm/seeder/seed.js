"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const seeder_module_1 = require("./seeder.module");
const seeder_service_1 = require("./seeder.service");
async function bootstrap() {
    core_1.NestFactory.createApplicationContext(seeder_module_1.SeederModule)
        .then((appContext) => {
        const seeder = appContext.get(seeder_service_1.SeederService);
        seeder
            .seed()
            .then(() => {
            common_1.Logger.log('Seeding complete!');
        })
            .catch((error) => {
            common_1.Logger.error('Seeding failed!');
            throw error;
        })
            .finally(() => appContext.close());
    })
        .catch((error) => {
        throw error;
    });
}
bootstrap();
//# sourceMappingURL=seed.js.map