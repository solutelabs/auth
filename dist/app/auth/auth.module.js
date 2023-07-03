"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const environment_1 = require("./../../core/environment");
const strategy_1 = require("./strategy");
const otp_module_1 = require("./otp/otp.module");
const password_module_1 = require("./password/password.module");
const typeorm_1 = require("@nestjs/typeorm");
const entity_1 = require("./entity");
const auth_controller_1 = require("./auth.controller");
const microservices_1 = require("@nestjs/microservices");
const strategies_1 = require("./strategy/strategies");
const country_module_1 = require("../country/country.module");
const nestjs_session_1 = require("nestjs-session");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: environment_1.JWT_SECRET,
                verifyOptions: {
                    algorithms: ['HS256'],
                },
                signOptions: { expiresIn: `${environment_1.JWT_EXPIRES_IN_DAYS}d` },
            }),
            nestjs_session_1.SessionModule.forRoot({
                session: {
                    secret: 'your_secret_key_here',
                    resave: true,
                    saveUninitialized: true,
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([entity_1.UserEntity]),
            microservices_1.ClientsModule.register([
                {
                    name: 'ASSET_SERVICE',
                    transport: 1,
                    options: {
                        url: environment_1.MAIL_REDIS_URL,
                        queue: 'asset_queue',
                        queueOptions: {
                            durable: false,
                        },
                    },
                },
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
            password_module_1.PasswordModule,
            otp_module_1.OtpModule,
            country_module_1.CountryModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            strategy_1.JwtStrategy,
            strategy_1.GoogleStrategy,
            strategies_1.TwitterOAuth2Strategy,
            strategies_1.AppleOAuth2Strategy,
            strategies_1.FacebookOAuth2Strategy,
        ],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map