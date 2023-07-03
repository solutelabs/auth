import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { Repository } from 'typeorm';
import { IChangePasswordResponse, IForgetPasswordResponse, IResetPasswordResponse } from './interface';
import { UtilityService } from '../../../app/utility';
import { UserEntity } from '../entity';
import { AuthService } from '../auth.service';
import { ClientProxy } from '@nestjs/microservices';
export declare class PasswordService {
    private userRepository;
    private readonly authService;
    private readonly utilityService;
    private readonly client;
    constructor(userRepository: Repository<UserEntity>, authService: AuthService, utilityService: UtilityService, client: ClientProxy);
    changePassword(data: ChangePasswordDto, user: UserEntity): Promise<IChangePasswordResponse | undefined>;
    setNewPassword(userId: string, password: string): Promise<void>;
    forgetPassword(data: ForgetPasswordDto): Promise<IForgetPasswordResponse | undefined>;
    resetPassword(data: ResetPasswordDto): Promise<IResetPasswordResponse>;
}
