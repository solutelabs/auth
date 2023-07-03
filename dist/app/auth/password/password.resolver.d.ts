import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { PasswordService } from './password.service';
import { IChangePasswordResponse, IForgetPasswordResponse, IResetPasswordResponse } from './interface';
import { LoginEntity } from '../entity';
export declare class PasswordResolver {
    private readonly passwordService;
    constructor(passwordService: PasswordService);
    changePassword(data: ChangePasswordDto, user: LoginEntity): Promise<IChangePasswordResponse | undefined>;
    forgetPassword(data: ForgetPasswordDto): Promise<IForgetPasswordResponse | undefined>;
    resetPassword(data: ResetPasswordDto): Promise<IResetPasswordResponse>;
}
