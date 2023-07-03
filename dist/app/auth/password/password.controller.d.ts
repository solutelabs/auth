import { UserEntity } from '../entity';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { IChangePasswordResponse, IForgetPasswordResponse, IResetPasswordResponse } from './interface';
import { PasswordService } from './password.service';
export declare class PasswordController {
    private readonly passwordService;
    constructor(passwordService: PasswordService);
    changePassword(data: ChangePasswordDto, user: UserEntity): Promise<IChangePasswordResponse | undefined>;
    forgetPassword(data: ForgetPasswordDto): Promise<IForgetPasswordResponse | undefined>;
    resetPassword(data: ResetPasswordDto): Promise<IResetPasswordResponse>;
}
