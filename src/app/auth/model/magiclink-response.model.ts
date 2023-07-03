import { ApiProperty } from '@nestjs/swagger';

export class MagicLinkResponse {
  @ApiProperty({ example: true, description: 'Indicates if the magic link was sent successfully' })
  success: boolean;

  @ApiProperty({ example: 'Magic link sent', description: 'A message indicating the outcome of the magic link send operation' })
  message: string;
}