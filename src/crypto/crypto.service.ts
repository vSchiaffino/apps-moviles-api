import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

export type JwtPayload = {
  id: number;
  user: string;
  mail: string;
  name: string;
  lastName: string;
};

@Injectable()
export class CryptoService {
  constructor(private readonly configService: ConfigService) {}

  public async hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  public async verify(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  public sign(payload: JwtPayload): string {
    return sign(payload, this.configService.getOrThrow<string>('JWT_SECRET'), {
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    });
  }

  public verifyToken(token: string): JwtPayload {
    try {
      return verify(
        token,
        this.configService.getOrThrow<string>('JWT_SECRET'),
      ) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or not provided');
    }
  }
}
