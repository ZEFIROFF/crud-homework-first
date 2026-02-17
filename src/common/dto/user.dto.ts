import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  CreateUserInput,
  ResponseUser,
  UpdateUserInput,
} from '../types/user.type';

export abstract class UserBaseDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Username', example: 'JohnDoe' })
  username: string;

  @IsEmail()
  @ApiProperty({ description: 'Email', example: 'john.doe@example.com' })
  email: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiProperty({ description: 'Age', example: 20 })
  age: number;

  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    description: 'Description',
    example: 'I am a software engineer',
  })
  description: string;
}

export class ResponseUserDto extends UserBaseDto implements ResponseUser {
  @IsString()
  @IsUUID()
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
}

export class CreateUserDto extends UserBaseDto implements CreateUserInput {
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @ApiProperty({ description: 'Password', example: 'cryptoscam' })
  password: string;
}

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements UpdateUserInput {}
