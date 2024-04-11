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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { GoogleUserDetailsDto } from './dtos/google.userdetails.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Password fields do not match');
    }

    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email is already in use');
    }

    createUserDto.password = await this.utilsService.hashPassword(
      createUserDto.password,
    );

    const newUser = await this.userService.create(createUserDto);

    return { id: newUser.id, email: newUser.email, role: newUser.role };
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new BadRequestException('User does not have any password');
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

  async getUserFromCookie(req: Request): Promise<CurrentUserDto | null> {
    const { token } = req.signedCookies;
    if (token) {
      const { id } = await this.utilsService.isTokenValid(token);
      const user = await this.userService.findById(id);
      if (!user) {
        throw new UnauthorizedException('User does not exist');
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
      user.first_name = userDetails.first_name;
      user.last_name = userDetails.last_name;
      const newUser = await this.usersRepository.save(user);
      return { id: newUser.id, email: newUser.email, role: newUser.role };
    }
    const newUser = await this.usersRepository.save(
      this.usersRepository.create(userDetails),
    );
    return { id: newUser.id, email: newUser.email, role: newUser.role };
  }
}
