import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { GetOrderDetailsController } from './get-order-details.controller';
import { GetOrderDetailsHandler } from './get-order-details.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrdersEntity])],
  controllers: [GetOrderDetailsController],
  providers: [GetOrderDetailsHandler],
})
export class GetOrderDetailsModule {}
