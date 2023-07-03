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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const constant_1 = require("../../core/constant");
const error_1 = require("../../core/error");
const utility_1 = require("../../core/utility");
const typeorm_2 = require("typeorm");
const auth_service_1 = require("../auth/auth.service");
const entity_1 = require("../auth/entity");
let AdminService = class AdminService {
    constructor(userRepository, authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }
    async getAllUsers() {
        return await this.userRepository.find({
            where: {
                role: constant_1.ROLES.USER,
            },
        });
    }
    async deleteUser(id) {
        const user = await this.userRepository.findOne(id);
        if (!user)
            throw new common_1.BadRequestException('User does not exists');
        if (user.role === constant_1.ROLES.ADMIN)
            throw new common_1.BadRequestException('Admin cannot be deleted');
        await this.userRepository.delete(id);
        return {
            user,
            message: 'User deleted successfully',
        };
    }
    async deactivateUser(id) {
        const user = await this.userRepository.findOne(id);
        if (!user)
            throw new common_1.BadRequestException('User does not exists');
        if (user.role === constant_1.ROLES.ADMIN)
            throw new common_1.BadRequestException('Admin cannot be deactivated');
        if (user.is_active === false)
            throw new common_1.BadRequestException('User is already deactivated');
        user.is_active = false;
        await this.userRepository.save(user);
        return {
            user,
            message: 'User is deactivated',
        };
    }
    async activateUser(id) {
        const user = await this.userRepository.findOne(id);
        if (!user)
            throw new common_1.BadRequestException('User does not exists');
        if (user.is_active === true)
            throw new common_1.BadRequestException('User is already activated');
        user.is_active = true;
        await this.userRepository.save(user);
        return {
            user,
            message: 'User is activated',
        };
    }
    async createUser(user) {
        const { email, username, password } = user;
        if ((await this.userRepository.findOne({ where: { username } })) ||
            (await this.userRepository.findOne({ where: { email } })))
            throw new common_1.BadRequestException(error_1.USER_ALREADY_EXISTS);
        const hashedPassword = await (0, utility_1.generateHash)(password);
        user.password = hashedPassword;
        const newUser = this.userRepository.create(user);
        await this.userRepository.save(newUser);
        return {
            newUser,
            message: 'User has been created',
        };
    }
    async updateUser(user) {
        let existing_user = await this.userRepository.findOne(user.id);
        if (!existing_user)
            throw new common_1.BadRequestException(error_1.USER_NOT_FOUND);
        if (user.email && user.email !== existing_user.email) {
            if (await this.userRepository.findOne({ where: { email: user.email } }))
                throw new common_1.BadRequestException('User with the updated email already exists');
        }
        if (user.contact && user.contact !== existing_user.contact) {
            if (await this.userRepository.findOne({ where: { contact: user.contact } }))
                throw new common_1.BadRequestException('User with the updated contact already exists');
        }
        if (user.password) {
            if (!(await (0, utility_1.compareHash)(user.password, existing_user.password))) {
                user.password = await (0, utility_1.generateHash)(user.password);
            }
            else
                throw new common_1.BadRequestException('New and Old password cannot be same');
        }
        Object.assign(existing_user, user);
        const updatedUser = await this.userRepository.save(existing_user);
        return {
            updatedUser,
            message: 'User has been updated',
        };
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map