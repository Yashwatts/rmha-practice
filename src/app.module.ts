import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import typeOrmConfig from './shared/database/config/orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
