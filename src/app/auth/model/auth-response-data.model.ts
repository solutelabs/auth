import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthResponseData {
  @IsString()
  @Transform(({ value }) => value.toString())
  user_id: string;

  @IsString()
  @Transform(({ value }) => value.toString())
  role: string;
}
