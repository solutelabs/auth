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
exports.LoginEntity = void 0;
const entity_1 = require("../../utility/entity");
const typeorm_1 = require("typeorm");
let LoginEntity = class LoginEntity extends entity_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.Column)('text', { unique: true }),
    __metadata("design:type", String)
], LoginEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], LoginEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], LoginEntity.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], LoginEntity.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], LoginEntity.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], LoginEntity.prototype, "country_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], LoginEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], LoginEntity.prototype, "reset_password_token", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: true }),
    __metadata("design:type", Boolean)
], LoginEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], LoginEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], LoginEntity.prototype, "magic_link", void 0);
LoginEntity = __decorate([
    (0, typeorm_1.Entity)('login')
], LoginEntity);
exports.LoginEntity = LoginEntity;
//# sourceMappingURL=login.entity.js.map