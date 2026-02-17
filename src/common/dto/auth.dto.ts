import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username', example: 'JohnDoe' })
  @MinLength(1)
  @MaxLength(32)
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password', example: 'cryptoscam' })
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
