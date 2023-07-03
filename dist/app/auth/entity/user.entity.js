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
exports.UserEntity = void 0;
const entity_1 = require("../../utility/entity");
const typeorm_1 = require("typeorm");
const constant_1 = require("../../../core/constant");
let UserEntity = class UserEntity extends entity_1.BaseEntity {
    ;
};
__decorate([
    (0, typeorm_1.Column)('text', { unique: true, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "reset_password_token", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "profile_pic", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "google_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "facebook_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "twitter_id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
        unique: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "apple_id", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: true }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)('text', {
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "country_code", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { unique: true, nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { default: constant_1.ROLES.USER }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "magic_link", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)('user')
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map