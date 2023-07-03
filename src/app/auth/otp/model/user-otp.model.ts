import { IsString, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserOtp {
  @IsString()
  @Transform(({ value }) => value.toString())
  id: string;

  @IsString()
  @IsOptional()
  otp_secret?: string;

  @IsString()
  mobile_number: string;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @IsOptional()
  updated_at?: Date;
}