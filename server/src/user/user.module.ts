import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UtilsModule } from '../utils/utils.module';
import { AuthService } from './auth.service';
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), UtilsModule],
  controllers: [AuthController, UserController],
  providers: [UserService, AuthService],
  exports: [AuthService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
