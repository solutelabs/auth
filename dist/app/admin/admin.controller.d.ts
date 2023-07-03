import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllUsers(): Promise<import("../auth/entity").UserEntity[]>;
    deleteUser(id: string): Promise<{
        user: import("../auth/entity").UserEntity;
        message: string;
    }>;
    createUser(user: CreateUserDto): Promise<{
        newUser: import("../auth/entity").UserEntity;
        message: string;
    }>;
    updateUser(user: UpdateUserDto): Promise<{
        updatedUser: import("../auth/entity").UserEntity;
        message: string;
    }>;
    deactivateUser(id: string): Promise<{
        user: import("../auth/entity").UserEntity;
        message: string;
    }>;
    activateUser(id: string): Promise<{
        user: import("../auth/entity").UserEntity;
        message: string;
    }>;
}
