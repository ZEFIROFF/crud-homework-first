import {
  Controller,
  HttpStatus,
  HttpCode,
  UseGuards,
  Param,
  Req,
  Get,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import {
  ResponseUserDto,
  UpdateUserByUsernameDto,
  UserNameSearchDto,
} from '../dto/user.dto';
import { UserService } from '../service/user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
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
  @ApiProperty({ type: UserNameSearchDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Users successfully fetched',
    schema: {
      example: [ResponseUserDto],
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
  async getAllUsers(
    @Param('username') username?: string,
    @Param('page') page: number = 1,
    @Param('limit') limit: number = 10,
  ): Promise<ResponseUserDto[]> {
    this.logger.verbose(
      `Getting all users with username ${username}`,
      UserController.name,
    );
    return this.userService.getAllUsers(username, page, limit);
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
    schema: {
      example: ResponseUserDto,
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
  @ApiProperty({ type: UpdateUserByUsernameDto })
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated',
  })
  async updateUser(
    @Req() req: Request & { username: string },
    @Body() updateUserDto: UpdateUserByUsernameDto,
  ): Promise<ResponseUserDto> {
    this.logger.verbose(`Updating user ${req.username}`, UserController.name);
    return this.userService.updateUserByUsername(
      req.username,
      updateUserDto.description,
    );
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
  async deleteUser(
    @Req() req: Request & { username: string },
  ): Promise<{ message: string; status: number }> {
    this.logger.verbose(`Deleting user ${req.username}`, UserController.name);
    await this.userService.deleteUserByUsername(req.username);
    return { message: 'User successfully deleted', status: HttpStatus.OK };
  }
}
