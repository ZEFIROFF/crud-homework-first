import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
} from '@nestjs/swagger';
import { JWTDto } from 'src/auth/dto/JWT.dto';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from '../service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../guard/jwt.auth.guard';
import { LocalAuthGuard } from '../guard/local.auth.guard';
import { LoginDto } from 'src/auth/dto/auth.dto';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('register')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with username, email and password.',
  })
  @ApiProperty({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    schema: {
      example: JWTDto,
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
    return this.authService.login(user.username, user.password);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Login user',
    description: 'Login the current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
    schema: {
      example: JWTDto.prototype,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials',
    schema: {
      example: {
        message: 'Invalid credentials',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        message: 'Unauthorized',
      },
    },
  })
  @ApiProperty({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<JWTDto> {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout the current user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged out',
    schema: {
      example: {
        message: 'User successfully logged out',
      },
    },
  })
  async logout(
    @Req() req: { username: string },
  ): Promise<{ message: string; status: number }> {
    await this.cacheManager.del(req.username);
    return { message: 'User successfully logged out', status: HttpStatus.OK };
  }
}
