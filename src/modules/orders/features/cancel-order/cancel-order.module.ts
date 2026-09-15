import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { CancelOrderController } from './cancel-order.controller';
import { CancelOrderHandler } from './cancel-order.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrdersEntity])],
  controllers: [CancelOrderController],
  providers: [CancelOrderHandler],
})
export class CancelOrderModule {}
