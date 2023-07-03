import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entity';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
export declare class AdminService {
    private userRepository;
    private readonly authService;
    constructor(userRepository: Repository<UserEntity>, authService: AuthService);
    getAllUsers(): Promise<UserEntity[]>;
    deleteUser(id: string): Promise<{
        user: UserEntity;
        message: string;
    }>;
    deactivateUser(id: string): Promise<{
        user: UserEntity;
        message: string;
    }>;
    activateUser(id: string): Promise<{
        user: UserEntity;
        message: string;
    }>;
    createUser(user: CreateUserDto): Promise<{
        newUser: UserEntity;
        message: string;
    }>;
    updateUser(user: UpdateUserDto): Promise<{
        updatedUser: UserEntity;
        message: string;
    }>;
}
