import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class FacebookAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}