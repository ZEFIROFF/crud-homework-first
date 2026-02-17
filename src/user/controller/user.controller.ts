import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from '../../common/dto/user.dto';
import { UserService } from '../service/user.service';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import { JWTDto } from 'src/common/dto/JWT.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with username, email and password.',
  })
  @ApiProperty({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    schema: {
      example: JWTDto.prototype,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials or username already exists',
    schema: {
      example: {
        message: 'Username already in use',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<JWTDto> {
    const user = await this.userService.register(createUserDto);
    if (!user) {
      throw new BadRequestException('Failed to register user');
    }
    return this.authService.login(user.username, user.password);
  }
}
