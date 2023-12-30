import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  genSalt,
  hash as hashWithSalt,
  compare as hashAndCompareWith,
} from 'bcryptjs';
import { Response } from 'express';
import { Brackets, SelectQueryBuilder } from 'typeorm';
import { Hotel } from '../hotel/hotel.entity';
import { Booking } from '../booking/booking.entity';

type callbackFn = (qb: SelectQueryBuilder<Hotel>) => string;
const oneMonth = 30 * 24 * 60 * 60 * 1000;

type cookieOptions = {
  tokenName?: string;
  httpOnly?: boolean;
  signed?: boolean;
};

@Injectable()
export class UtilsService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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

  async attachTokenToCookies(
    res: Response,
    payload: Object,
    options?: cookieOptions,
  ): Promise<void> {
    const { tokenName, httpOnly, signed } = {
      tokenName: 'token',
      httpOnly: true,
      signed: true,
      ...options,
    };
    const token = await this.createJwt(payload);
    res.cookie(tokenName, token, {
      expires: new Date(Date.now() + oneMonth),
      path: '/',
      httpOnly,
      secure: this.configService.get('NODE_ENV') !== 'development',
      signed,
    });
  }

  async hashPassword(password: string) {
    const salt = await genSalt(10);
    return hashWithSalt(password, salt);
  }

  comparePassword(submittedPassword: string, hashedDbPassword: string) {
    return hashAndCompareWith(submittedPassword, hashedDbPassword);
  }

  getNonOverlappingDatesQuery(book_from: Date, book_to: Date): callbackFn {
    return (qb1) => {
      const subQuery = qb1
        .subQuery()
        .select()
        .from(Booking, 'booking')
        .where('booking.cabin_id = cabin.id')
        .andWhere(
          new Brackets((qb2) => {
            qb2.where(
              'booking.from_date <=:book_from AND booking.to_date > :book_from',
              { book_from },
            );
            qb2.orWhere(
              'booking.from_date < :book_to AND booking.to_date >= :book_to',
              { book_to },
            );
            qb2.orWhere(
              'booking.from_date <= :book_from AND booking.to_date >= :book_to',
              { book_from, book_to },
            );
            qb2.orWhere(
              'booking.from_date >= :book_from AND booking.to_date <= :book_to',
              { book_from, book_to },
            );
          }),
        )
        .getQuery();

      return `NOT EXISTS ${subQuery}`;
    };
  }
}
