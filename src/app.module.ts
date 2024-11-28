import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { StoreController } from './store/store.controller';
import { StoreModule } from './store/store.module';
import { SalesHistoryController } from './sales-history/sales-history.controller';
import { SalesHistoryService } from './sales-history/sales-history.service';
import { SalesHistoryModule } from './sales-history/sales-history.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only in development, do not use in production
    }),
    AuthModule,
    UsersModule,
    MenuModule,
    StoreModule,
    SalesHistoryModule,
  ],
  controllers: [AppController, MenuController, StoreController, SalesHistoryController],
  providers: [AppService, SalesHistoryService],
})
export class AppModule {}
