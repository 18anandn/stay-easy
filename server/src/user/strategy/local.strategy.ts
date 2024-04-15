import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    });
  }

  async validate(email: string, password: string): Promise<Express.User> {
    const user = await this.authService.login({ email, password });
    if (!user) throw new UnauthorizedException();
    const { id, role } = user;
    return { data: { id, email, role } };
  }
}
