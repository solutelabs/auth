import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { OTP_OPTIONS } from 'src/core/constant';

 export class SendOtpDto {
  @ApiProperty({type:String, description:'mobile_number'})
  contact: string;

  @ApiProperty({type:String, description:'country_code'})
  country_code: string;

  @ApiProperty({type:String, description:'signup/login/update/verify'})
  mode?: OTP_OPTIONS;
}
