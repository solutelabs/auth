import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TwitterAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oauth_token: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oauth_verifier: string;
}