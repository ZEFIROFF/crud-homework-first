import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JwtAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Access token', example: 'access_token' })
  accessToken: string;
}

export class JwtRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Refresh token', example: 'refresh_token' })
  refreshToken: string;
}

export class JWTDto {
  @ApiProperty({ type: JwtAccessTokenDto })
  accessToken: JwtAccessTokenDto;
  @ApiProperty({ type: JwtRefreshTokenDto })
  refreshToken: JwtRefreshTokenDto;
}
