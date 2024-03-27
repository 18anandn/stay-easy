import { UtilsService } from '../utils/utils.service';
import { UserService } from './user.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Request } from 'express';
import { CurrentUserDto } from './dtos/current-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email is already in use');
    }

    createUserDto.password = await this.utilsService.hashPassword(
      createUserDto.password,
    );

    return this.userService.create(createUserDto);
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.utilsService.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async getUserFromCookie(req: Request): Promise<CurrentUserDto | null> {
    const { token } = req.signedCookies;
    if (token) {
      const { userId: id } = await this.utilsService.isTokenValid(token);
      const user = await this.userService.findById(id);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
      }
      const { id: userId, email, role } = user;
      return { userId, email, role };
    }
    return null;
  }
}
