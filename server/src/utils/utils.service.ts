import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  genSalt,
  hash as hashWithSalt,
  compare as hashAndCompareWith,
} from 'bcryptjs';
import { Response } from 'express';
import { addDays } from 'date-fns';

@Injectable()
export class UtilsService {
  readonly domain_name: string | undefined;
  readonly token_cookie = 'token';
  readonly login_cookie = 'logged-in';
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.domain_name = this.configService.getOrThrow('DOMAIN');
    // this.domain_name = undefined;
  }

  createJwt(payload: Object) {
    return this.jwtService.signAsync(payload);
  }

  isTokenValid(token: string) {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  getDomainName() {
    return this.domain_name;
  }

  async attachTokenToCookies(res: Response, payload: Object): Promise<void> {
    const token = await this.createJwt(payload);
    const expires = addDays(new Date(), 30);
    res.cookie(this.token_cookie, token, {
      expires,
      domain: this.domain_name,
      path: '/',
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') !== 'development',
      signed: true,
    });
    res.cookie(this.login_cookie, this.login_cookie, {
      path: '/',
      expires,
      domain: this.domain_name,
    });
  }

  removeTokenFromCookes(res: Response) {
    const expires = new Date();
    res.cookie(this.token_cookie, null, {
      path: '/',
      domain: this.domain_name,
      expires,
    });
    res.cookie(this.login_cookie, null, {
      path: '/',
      domain: this.domain_name,
      expires,
    });
  }

  async hashPassword(password: string) {
    const salt = await genSalt(10);
    return hashWithSalt(password, salt);
  }

  comparePassword(submittedPassword: string, hashedDbPassword: string) {
    return hashAndCompareWith(submittedPassword, hashedDbPassword);
  }
}
