import { Global, Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_LIFETIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
