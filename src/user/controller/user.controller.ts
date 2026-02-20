import {
  Controller,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ResponseUserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { LoggerService } from 'src/common/logger/logger.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {}

  @Get('getAllUsers')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users with pagination and search by username',
  })
  @ApiQuery({
    name: 'username',
    description: 'Search by username',
    example: 'john',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit number',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users successfully fetched',
    type: ResponseUserDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials or username already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
  })
  async getAllUsers(
    @Query('username') username?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<ResponseUserDto[]> {
    this.logger.verbose(
      `Getting all users with username ${username}`,
      UserController.name,
    );
    return this.userService.getAllUsers(page ?? 1, limit ?? 10, username);
  }

  @Get('getUser/my')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Get user by id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully fetched',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials or username already exists',
    schema: {
      example: {
        message: 'Bad request - Invalid credentials or username already exists',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
  })
  async getUserByUsername(
    @Req() req: Request & { username: string },
  ): Promise<ResponseUserDto> {
    this.logger.verbose(
      `Getting user by username ${req.username}`,
      UserController.name,
    );
    return this.userService.getUserByUsername(req.username);
  }

  @Patch('updateUser/my')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated',
    type: ResponseUserDto,
  })
  @ApiQuery({
    name: 'description',
    description: 'Description',
    example: 'I am a software engineer',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials or username not found',
    schema: {
      example: {
        message: 'Bad request - Invalid credentials or username not found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
  })
  async updateUser(
    @Req() req: Request & { username: string },
    @Query('description') description: string,
  ): Promise<ResponseUserDto> {
    this.logger.verbose(`Updating user ${req.username}`, UserController.name);
    return this.userService.updateUserByUsername(req.username, description);
  }

  @Delete('deleteUser/my')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request - Invalid credentials or username not found',
    schema: {
      example: {
        message: 'Bad request - Invalid credentials or username not found',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error, check logs',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid credentials',
  })
  async deleteUser(@Req() req: Request & { username: string }): Promise<void> {
    this.logger.verbose(`Deleting user ${req.username}`, UserController.name);
    await this.userService.deleteUserByUsername(req.username);
  }
}
