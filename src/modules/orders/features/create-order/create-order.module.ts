import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { CreateOrderController } from './create-order.controller';
import { CreateOrderHandler } from './create-order.handler';
import { OrdersOutboxEntity } from '../../infrastructure/database/outbox/orders-outbox.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OrdersEntity, OrdersOutboxEntity]),
  ],
  controllers: [CreateOrderController],
  providers: [CreateOrderHandler],
})
export class CreateOrderModule {}
