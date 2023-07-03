import {
  Injectable,
  BadRequestException,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { Repository } from 'typeorm';
import {
  IChangePasswordResponse,
  IForgetPasswordResponse,
  IResetPasswordResponse,
} from './interface';
import { compareHash, generateHash, User } from '../../../core/utility';
import { UtilityService } from '../../../app/utility';
import {
  INCORRECT_PASSWORD,
  INVALID_RESET_PASSWORD_TOKEN,
  USER_NOT_FOUND,
} from '../../../core/error';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginEntity, UserEntity } from '../entity';
import { AuthService } from '../auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { RESET_PASSWORD_SLUG } from '../../../core/environment';

@Injectable()
export class PasswordService {
  constructor(
    //@InjectRepository(LoginEntity)
    @InjectRepository(UserEntity)
    //private loginRepository: Repository<LoginEntity>,
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly utilityService: UtilityService,
    @Inject('MAIL_SERVICE') private readonly client: ClientProxy,
  ) {}

  /**
   * @author sambhav
   * @param {object} data - ChangePasswordDto
   * @param {object} user - LoginEntity
   * @returns {object} IChangePasswordResponse
   * @description change password
   */
  async changePassword(
    data: ChangePasswordDto,
    user: UserEntity,
  ): Promise<IChangePasswordResponse | undefined> {
    const isOldPasswordCorrect = await compareHash(
      data.oldPassword,
      user.password,
    );

    if (!isOldPasswordCorrect) {
      throw new BadRequestException('Incorrect password', INCORRECT_PASSWORD);
    }

    await this.setNewPassword(user.id, data.newPassword);

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  /**
   * @author sambhav
   * @param {string} userId
   * @param {string} password
   * @description updates user password
   */
  async setNewPassword(userId: string, password: string): Promise<void> {
    const newHashedPassword = await generateHash(password);
    await this.userRepository.update(
      { id: userId },
      {
        password: newHashedPassword,
      },
    );
  }

  /**
   * @author sambhav
   * @param {object} data ForgetPasswordDto
   * @returns {object} IForgetPasswordResponse
   * @description sends mail to reset password
   */
  async forgetPassword(
    data: ForgetPasswordDto,
  ): Promise<IForgetPasswordResponse | undefined> {
    const user = await this.authService.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found', USER_NOT_FOUND);
    }

    const reset_password_token =
      await this.utilityService.generateRandomToken();
    await this.userRepository.update(
      { id: user.id },
      {
        reset_password_token: reset_password_token,
      },
    );

    const payload = {
      email: user.email,
      templateId: 1,
      payload: {
        name: user.firstname,
        url: `APP_END_POINT/${RESET_PASSWORD_SLUG}/${reset_password_token}`,
      },
    };

    this.client.emit('mail:send', payload);

    return {
      success: true,
      message: 'Mail sent successfully',
    };
  }

  /**
   * @author sambhav
   * @param {object} data - ResetPasswordDto
   * @returns {object} IResetPasswordResponse
   * @description checks token and set new password
   */
  async resetPassword(data: ResetPasswordDto): Promise<IResetPasswordResponse> {
    const user = await this.userRepository.findOne({
      reset_password_token: data.token,
    });
    if (!user) {
      throw new BadRequestException(
        'Invalid Reset Password Token',
        INVALID_RESET_PASSWORD_TOKEN,
      );
    }

    await this.setNewPassword(user.id, data.newPassword);

    await this.userRepository.update(
      { id: user.id },
      {
        reset_password_token: null,
      },
    );

    return {
      success: true,
      message: 'Password Changed successfully',
    };
  }
}
