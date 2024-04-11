import { AuthService } from './../auth.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import {
  JwtFromRequestFunction,
  Strategy,
  VerifiedCallback,
  VerifyCallbackWithRequest,
} from 'passport-jwt';
import { plainToClass } from 'class-transformer';
import { JwtPayloadDto } from '../dtos/jwt.payload.dto';
import { assertHasUser } from '../assertHasUser';
import { validate } from 'class-validator';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const jwtFromRequest: JwtFromRequestFunction<Request> = (req) => {
  return req?.signedCookies?.token ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: unknown,
    //  done: VerifiedCallback
  ): Promise<Express.User> {
    const userData = plainToClass(JwtPayloadDto, payload);
    const errors = await validate(userData, { whitelist: true });
    if (errors.length === 0) {
      const user = await this.authService.getCurrentUser(userData.id);
      return { data: user ?? undefined };
    }
    return { data: undefined };
  }
}
