"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModule = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("./otp.service");
const typeorm_1 = require("@nestjs/typeorm");
const country_module_1 = require("../../country/country.module");
const entity_1 = require("./entity");
const environment_1 = require("../../../core/environment");
const jwt_1 = require("@nestjs/jwt");
const entity_2 = require("../entity");
const microservices_1 = require("@nestjs/microservices");
const auth_module_1 = require("../auth.module");
const otp_controller_1 = require("./otp.controller");
let OtpModule = class OtpModule {
};
OtpModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: environment_1.JWT_SECRET,
                verifyOptions: {
                    algorithms: ['HS256'],
                },
                signOptions: { expiresIn: `${environment_1.JWT_EXPIRES_IN_DAYS}d` },
            }),
            typeorm_1.TypeOrmModule.forFeature([entity_1.OtpEntity, entity_2.LoginEntity]),
            microservices_1.ClientsModule.register([
                {
                    name: 'MESSAGE_SERVICE',
                    transport: 1,
                    options: {
                        url: environment_1.MESSAGE_REDIS_URL,
                        queue: environment_1.MESSAGE_QUEUE,
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
            ]),
            country_module_1.CountryModule,
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
        ],
        controllers: [otp_controller_1.OtpController],
        providers: [otp_service_1.OtpService],
        exports: [otp_service_1.OtpService],
    })
], OtpModule);
exports.OtpModule = OtpModule;
//# sourceMappingURL=otp.module.js.map