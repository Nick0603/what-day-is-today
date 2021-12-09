import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SubscribeModule } from './modules/subscribe/subscribe.module';
import { WorkerModule } from './modules/worker/worker.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminNotificationsController } from './controllers/admin/admin-notifications.controller copy';
import { AdminUsersController } from './controllers/admin/admin-users.controller';

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
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    SubscribeModule,
    WorkerModule,
    NotificationsModule,
  ],
  controllers: [AdminNotificationsController, AdminUsersController],
})
export class AppModule {}
