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
import { AuthService } from 'src/auth/service/auth.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  //getAllUsers (jwt auth guard, maybe login for search users)
  //getUser (jwt auth guard)
  //updateUser (jwt auth guard)
  //deleteUser (jwt auth guard)

  @Get('getAllUsers')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
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
    return this.userService.getAllUsers(username, page, limit);
  }

  @Get('getUser/my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
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
    return this.userService.getUserByUsername(req.username);
  }

  @Patch('updateUser/my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
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
    return this.userService.updateUserByUsername(
      req.username,
      updateUserDto.description,
    );
  }

  @Delete('deleteUser/my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
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
    await this.userService.deleteUserByUsername(req.username);
    return { message: 'User successfully deleted', status: HttpStatus.OK };
  }
}
