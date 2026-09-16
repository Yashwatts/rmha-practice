import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrderModule } from './features/create-order/create-order.module';
import { Module } from '@nestjs/common';
import { GetOrderDetailsModule } from './features/get-order-details/get-order-details.module';
import { ConfirmOrderModule } from './features/confirm-order/confirm-order.module';
import { CancelOrderModule } from './features/cancel-order/cancel-order.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './domains/orders/orders.entity';
import { OrdersOutboxEntity } from './infrastructure/database/outbox/orders-outbox.entity';
import { OrdersOutboxCron } from './infrastructure/rabbitmq/orders-outbox.cron';
import { OrdersPublisher } from './infrastructure/rabbitmq/orders.publisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, OrdersOutboxEntity]),
    CqrsModule,
    CreateOrderModule,
    GetOrderDetailsModule,
    ConfirmOrderModule,
    CancelOrderModule,
  ],
  providers: [OrdersPublisher, OrdersOutboxCron],
})
export class OrdersModule {}
