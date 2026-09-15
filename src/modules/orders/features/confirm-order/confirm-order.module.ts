import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { ConfirmOrderController } from './confirm-order.controller';
import { ConfirmOrderHandler } from './confirm-order.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrdersEntity])],
  controllers: [ConfirmOrderController],
  providers: [ConfirmOrderHandler],
})
export class ConfirmOrderModule {}

