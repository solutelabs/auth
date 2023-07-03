import {
  PASSWORD_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
} from './../../../../core/constant';
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from './../../../../core/environment';
import { IsNotEmpty, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: PASSWORD_MESSAGE,
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s)/, {
    message: INVALID_PASSWORD_MESSAGE,
  })
  oldPassword: string;

  @IsNotEmpty()
  @Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
    message: PASSWORD_MESSAGE,
  })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s)/, {
    message: INVALID_PASSWORD_MESSAGE,
  })
  newPassword: string;
}