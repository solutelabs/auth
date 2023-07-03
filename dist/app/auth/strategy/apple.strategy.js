"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_apple_1 = require("passport-apple");
const environment_1 = require("../../../core/environment");
const auth_service_1 = require("../auth.service");
let AppleStrategy = class AppleStrategy extends (0, passport_1.PassportStrategy)(passport_apple_1.Strategy) {
    constructor(authService) {
        super({
            clientID: environment_1.APPLE_CLIENT_ID,
            teamID: environment_1.APPLE_TEAMID,
            keyID: environment_1.APPLE_KEYID,
            keyFilePath: environment_1.APPLE_KEYFILE_PATH,
            callbackURL: environment_1.APPLE_CALLBACK,
            passReqToCallback: true,
            scope: ['email', 'name'],
        });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const { name, emails } = profile;
        const profileUpdated = Object.assign(Object.assign({}, profile), { accessToken, refreshToken });
        done(null, profileUpdated);
    }
};
AppleStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AppleStrategy);
exports.AppleStrategy = AppleStrategy;
//# sourceMappingURL=apple.strategy.js.map