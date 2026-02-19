import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
} from '../../common/types/user.type';

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

  constructor(user: ResponseUser) {
    super();
    Object.assign(this, user);
  }
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

export class UserNameSearchDto {
  // мне лень было оптимизировать код, поэтому я оставил этот дто
  @IsString()
  @MinLength(1)
  @IsOptional()
  @ApiProperty({ description: 'Username', example: 'JohnDoe' })
  username: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({ description: 'Page', example: 1 })
  page: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @ApiProperty({ description: 'Limit', example: 10 })
  limit: number;
}

export class UpdateUserByUsernameDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  @ApiProperty({ description: 'What to update', example: 'description' })
  description: string;
}
