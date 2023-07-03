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
exports.MagicLinkStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const environment_1 = require("../../../core/environment");
const auth_service_1 = require("../auth.service");
let MagicLinkStrategy = class MagicLinkStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'MagicLink') {
    constructor(authService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromUrlQueryParameter('token'),
            ignoreExpiration: false,
            secretOrKey: environment_1.JWT_SECRET,
        });
        this.authService = authService;
    }
    async validate(payload) {
        const user = await this.authService.findById(payload.user_id);
        if (!user || !user.is_active) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
MagicLinkStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], MagicLinkStrategy);
exports.MagicLinkStrategy = MagicLinkStrategy;
//# sourceMappingURL=magic-link.strategy.js.map