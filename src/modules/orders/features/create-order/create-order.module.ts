import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderHandler } from './create-order.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([OrdersEntity])],
  controllers: [CreateOrderController],
  providers: [CreateOrderHandler],
})
export class CreateOrderModule {}
