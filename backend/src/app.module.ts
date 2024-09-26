import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDbModule } from './modules-v1/test-db/test-db.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import ms from 'ms';
import { APP_GUARD } from '@nestjs/core';
import { MediaModule } from './modules-v1/media/media.module';
import { AuthModule } from './v1/auth/auth.module';
import { UserModule } from './v1/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_HOST_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [
          __dirname + '/modules-*/**/entities/*.entity{.ts,.js}',
          __dirname + '/database/entities/*.entity{.ts,.js}',
        ],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(ms(config.get<string>('THROTTLE_TTL') || '1m')),
          limit: config.get<number>('THROTTLE_LIMIT') || 60,
        },
      ],
      inject: [ConfigService],
    }),
    TestDbModule,
    MediaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
