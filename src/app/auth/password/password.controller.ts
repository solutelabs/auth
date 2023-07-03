import { LoginEntity } from '../entity';
import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard, User } from '../../../core/utility';
import { UserEntity } from '../entity';
import { ChangePasswordDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import {
  IChangePasswordResponse,
  IForgetPasswordResponse,
  IResetPasswordResponse,
} from './interface';
import { PasswordService } from './password.service';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('/changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() data: ChangePasswordDto,
    @User() user: UserEntity,
  ): Promise<IChangePasswordResponse | undefined> {
    return this.passwordService.changePassword(data, user);
  }

  @Post('/forgotPassword')
  async forgetPassword(
    @Body() data: ForgetPasswordDto,
  ): Promise<IForgetPasswordResponse | undefined> {
    return this.passwordService.forgetPassword(data);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body() data: ResetPasswordDto,
  ): Promise<IResetPasswordResponse> {
    return this.passwordService.resetPassword(data);
  }
}
