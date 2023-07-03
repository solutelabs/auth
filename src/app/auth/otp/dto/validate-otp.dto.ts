import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

 export class ValidateOtpDto {
  @ApiProperty()
  contact: string;

  @ApiProperty()
  country_code: string;

  @ApiProperty()
  otp: string;
}