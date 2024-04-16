import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UtilsService } from '../utils/utils.service';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import crypto from 'crypto';

import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { CurrentUserDto } from './dtos/current-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { GoogleUserDetailsDto } from './dtos/google.userdetails.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  readonly email_address!: string;
  readonly email_password!: string;

  constructor(
    private readonly utilsService: UtilsService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this.email_address = configService.getOrThrow('MAIL_ADDRESS');
    this.email_password = configService.getOrThrow('MAIL_PASSWORD');
  }

  async signup(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Password fields do not match');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email: createUserDto.email },
      });
      if (user) {
        throw new BadRequestException('Email is already in use');
      }

      createUserDto.password = await this.utilsService.hashPassword(
        createUserDto.password,
      );

      const token = crypto.randomBytes(32).toString('hex');

      if (
        createUserDto.last_name !== undefined &&
        createUserDto.last_name.length === 0
      ) {
        delete createUserDto.last_name;
      }

      const newUser = await userRepo.save(
        userRepo.create({ ...createUserDto, verification_token: token }),
      );
      const verificationURL = new URL(
        `verify/${newUser.id}`,
        this.utilsService.mainURL,
      );
      verificationURL.searchParams.set('token', token);

      try {
        await this.mailerService.sendMail({
          to: createUserDto.email, // list of receivers
          from: this.email_address,
          subject: 'StayEasy Account Verification', // Subject line
          text: `Click on the following link to verify you account. ${verificationURL.toString()}`, // plaintext body
          html: `<p>Click <a href="${verificationURL.toString()}">here</a> to verify your account.</p>`, // HTML body content
        });
      } catch (error) {
        throw new BadRequestException(
          'Could not send verification email. Please try to log in using Google',
        );
      }

      await queryRunner.commitTransaction();
      return { id: newUser.id, email: newUser.email, role: newUser.role };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an error while signing up',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async verifyUserToken(userId: string, token: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId, verified: false, verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification request');
    }

    user.verified = true;
    user.verification_token = null;
    await this.usersRepository.save(user);

    return { message: 'success' };
  }

  async handleForgetPassword(email: string) {
    if (email === 'test@test.com') {
      throw new BadRequestException('Cannot reset password for test account');
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const user = await userRepo.findOne({
        where: { email },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const token = crypto.randomBytes(32).toString('hex');

      user.forgot_password = true;
      user.verification_token = token;

      await this.usersRepository.save(user);

      const verificationURL = new URL(
        `reset-password/${user.id}`,
        this.utilsService.mainURL,
      );
      verificationURL.searchParams.set('token', token);

      try {
        await this.mailerService.sendMail({
          to: email, // list of receivers
          from: this.email_address,
          subject: 'StayEasy Account Password Reset', // Subject line
          text: `Click on the following link to reset your password. ${verificationURL.toString()}`, // plaintext body
          html: `<p>Click <a href="${verificationURL.toString()}">here</a> to reset your password.</p>`, // HTML body content
        });
      } catch (error) {
        throw new BadRequestException(
          'Could not send email for reseting password. Please try to log in using Google',
        );
      }

      await queryRunner.commitTransaction();
      return { message: 'success' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an error while signing up',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async handleResetUserPassword(
    userId: string,
    token: string,
    newPassword: ResetPasswordDto,
  ) {
    if (newPassword.password !== newPassword.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }
    const user = await this.usersRepository.findOne({
      where: { id: userId, forgot_password: true, verification_token: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid request for resetting password');
    }

    if (user.password) {
      const isSameAsOldPassword = await this.utilsService.comparePassword(
        newPassword.password,
        user.password,
      );

      if (isSameAsOldPassword) {
        throw new BadRequestException(
          'New password should be different from the old password',
        );
      }
    }

    user.password = await this.utilsService.hashPassword(newPassword.password);
    user.verified = true;
    user.forgot_password = false;
    user.verification_token = null;
    await this.usersRepository.save(user);

    return { message: 'success' };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersRepository.findOne({
      where: { email, verified: true },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new BadRequestException('Login with Google');
    }

    const isValidPassword = await this.utilsService.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, email: user.email, role: user.role };
  }

  async getUserFromCookie(
    req: Request,
    res: Response,
  ): Promise<CurrentUserDto | null> {
    const { token } = req.signedCookies;
    if (token) {
      const { id } = await this.utilsService.isTokenValid(token);
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        console.log('remv');
        this.utilsService.removeTokenFromCookes(res);
        return null;
      }
      const { email, role } = user;
      return { id, email, role };
    }
    return null;
  }

  async getCurrentUser(id: string): Promise<CurrentUserDto | null> {
    const user = await this.usersRepository.findOne({
      select: {
        email: true,
        role: true,
      },
      where: {
        id,
        verified: true,
      },
    });
    if (!user) return null;
    const { email, role } = user;
    return { id, email, role };
  }

  async handleGoogleLogin(
    userDetails: GoogleUserDetailsDto,
  ): Promise<CurrentUserDto> {
    const user = await this.usersRepository.findOne({
      where: {
        email: userDetails.email,
      },
    });
    if (user) {
      return { id: user.id, email: user.email, role: user.role };
    }
    const newUser = await this.usersRepository.save(
      this.usersRepository.create({ ...userDetails, verified: true }),
    );
    return { id: newUser.id, email: newUser.email, role: newUser.role };
  }
}
