"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordModule = void 0;
const common_1 = require("@nestjs/common");
const password_service_1 = require("./password.service");
const password_controller_1 = require("./password.controller");
const utility_1 = require("../../../app/utility");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth.module");
const entity_1 = require("../entity");
const microservices_1 = require("@nestjs/microservices");
const environment_1 = require("../../../core/environment");
let PasswordModule = class PasswordModule {
};
PasswordModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entity_1.LoginEntity, entity_1.UserEntity]),
            microservices_1.ClientsModule.register([
                {
                    name: 'MAIL_SERVICE',
                    transport: 1,
                    options: {
                        url: environment_1.MAIL_REDIS_URL,
                        queue: environment_1.MAIL_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        providers: [password_service_1.PasswordService, password_controller_1.PasswordController, utility_1.UtilityService],
    })
], PasswordModule);
exports.PasswordModule = PasswordModule;
//# sourceMappingURL=password.module.js.map