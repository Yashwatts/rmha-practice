import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { ConfirmOrderController } from './confirm-order.controller';
import { ConfirmOrderHandler } from './confirm-order.handler';
import { OrdersOutboxEntity } from '../../infrastructure/database/outbox/orders-outbox.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OrdersEntity, OrdersOutboxEntity]),
  ],
  controllers: [ConfirmOrderController],
  providers: [ConfirmOrderHandler],
})
export class ConfirmOrderModule {}
