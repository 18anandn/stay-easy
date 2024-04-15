import { UtilsService } from './../../utils/utils.service';
import { AuthService } from './../auth.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Profile,
  Strategy,
  StrategyOptions,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20';
import { GoogleUserDetailsDto } from '../dtos/google.userdetails.dto';
import { validate as validator } from 'class-validator';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly utilsService: UtilsService,
    private readonly authService: AuthService,
  ) {
    const options: StrategyOptions = {
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      callbackURL: new URL(
        configService.getOrThrow('GOOGLE_CLIENT_CALLBACK_PATH'),
        utilsService.mainURL,
      ).toString(),
      scope: ['profile', 'email'],
    };
    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    // console.log(accessToken);
    // console.log(refreshToken);
    const userDetails = new GoogleUserDetailsDto();
    userDetails.email = profile.emails![0].value;
    userDetails.first_name = profile.name!.givenName;
    userDetails.last_name = profile.name!.familyName;
    const errors = await validator(userDetails, { whitelist: true });
    if (errors.length === 0) {
      const user = await this.authService.handleGoogleLogin(userDetails);
      return user;
    }
    return null;
  }

  // authenticate(
  //   req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  //   options?: any,
  // ): void {
  //   console.log('in authenticate', req.query.state);
  //   super.authenticate(req, options);
  // }
}
