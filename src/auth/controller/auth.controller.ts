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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JWTDto } from 'src/auth/dto/JWT.dto';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from '../service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { JwtAuthGuard } from '../guard/jwt.auth.guard';
import { LocalAuthGuard } from '../guard/local.auth.guard';
import { LoginDto } from 'src/auth/dto/auth.dto';
import { LoggerService } from 'src/common/logger/logger.service';

@Controller('auth')
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: LoggerService,
  ) {}

  @Post('register')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create a new user account with username, email and password.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: JWTDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials or username already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<JWTDto> {
    const user = await this.userService.register(createUserDto);
    this.logger.verbose(
      `User ${user.username} registered`,
      AuthController.name,
    );
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
    type: JWTDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<JWTDto> {
    this.logger.verbose(
      `Logging in user ${loginDto.username}`,
      AuthController.name,
    );
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
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  async logout(@Req() req: Request & { username: string }): Promise<void> {
    this.logger.verbose(
      `Logging out user ${req.username}`,
      AuthController.name,
    );
    await this.cacheManager.del(req.username);
  }
}
