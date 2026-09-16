import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesEntity } from '../../domains/deliveries/deliveries.entity';
import { PrepareDeliveryController } from './prepare-delivery.controller';
import { PrepareDeliveryHandler } from './prepare-delivery.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([DeliveriesEntity])],
  controllers: [PrepareDeliveryController],
  providers: [PrepareDeliveryHandler],
})
export class PrepareDeliveryModule {}
