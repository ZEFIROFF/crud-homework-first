import {
  Inject,
  Injectable,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../../user/service/user.service';
import { User } from 'generated/prisma/client';
import { verifyPassword } from 'src/common/utils/crypto.util';
import { JwtService } from '@nestjs/jwt';
import { JWTDto } from 'src/auth/dto/JWT.dto';
import { LocalAuthGuard } from '../guard/local.auth.guard';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
@UseGuards(LocalAuthGuard)
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  //приходит хешированный пароль и username, проверяем совпадает ли пароль с хешированным паролем в базе данных
  async validateUser(
    username: string,
    password: string,
  ): Promise<User | UnauthorizedException> {
    const user = await this.userService.findByUsernamePassword(
      username,
      password,
    );
    if (user && verifyPassword(password, user.password)) {
      return user;
    }
    throw new UnauthorizedException();
  }

  async login(username: string, password: string): Promise<JWTDto> {
    const user = await this.validateUser(username, password);
    if (user instanceof UnauthorizedException) {
      throw user;
    }
    const payload = { id: user.id, username };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>('JWT_EXPIRATION_TIME'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME'),
    });
    await this.cacheManager.set(user.username, true);
    return {
      accessToken: { accessToken },
      refreshToken: { refreshToken },
    };
  }
}
