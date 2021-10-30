import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WinstonModule } from 'nest-winston';
import { LoggerConfig } from './logger/LoggerConfig';
import { SubscribeModule } from './subscribe/subscribe.module';
import { WorkerModule } from './worker/worker.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    WinstonModule.forRoot(new LoggerConfig().console()),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    SubscribeModule,
    WorkerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
