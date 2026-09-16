import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesEntity } from '../../domains/deliveries/deliveries.entity';
import { GetDeliveryController } from './get-delivery.controller';
import { GetDeliveryHandler } from './get-delivery.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([DeliveriesEntity])],
  controllers: [GetDeliveryController],
  providers: [GetDeliveryHandler],
})
export class GetDeliveryModule {}
