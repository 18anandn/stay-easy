import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UtilsModule } from '../utils/utils.module';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { GlobalAuthController } from './global.auth.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilsModule],
  controllers: [AuthController, UserController, GlobalAuthController],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
