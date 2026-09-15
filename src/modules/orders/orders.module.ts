import { CqrsModule } from '@nestjs/cqrs';
import { CreateOrderModule } from './features/create-order/create-order.module';
import { Module } from '@nestjs/common';
import { GetOrderDetailsModule } from './features/get-order-details/get-order-details.module';
import { ConfirmOrderModule } from './features/confirm-order/confirm-order.module';
import { CancelOrderModule } from './features/cancel-order/cancel-order.module';

@Module({
  imports: [
    CqrsModule,
    CreateOrderModule,
    GetOrderDetailsModule,
    ConfirmOrderModule,
    CancelOrderModule,
  ],
  providers: [],
})
export class OrdersModule {}
