import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { CreateDeliveryModule } from './features/create-delivery/create-delivery.module';
import { GetDeliveryModule } from './features/get-delivery/get-delivery.module';
import { PrepareDeliveryModule } from './features/prepare-delivery/prepare-delivery.module';

@Module({
  imports: [
    CqrsModule,
    CreateDeliveryModule,
    GetDeliveryModule,
    PrepareDeliveryModule,
  ],
  providers: [],
})
export class DeliveriesModule {}