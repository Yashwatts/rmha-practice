import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesEntity } from '../../domains/deliveries/deliveries.entity';
import { CreateDeliveryController } from './create-delivery.controller';
import { CreateDeliveryHandler } from './create-delivery.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([DeliveriesEntity])],
  controllers: [CreateDeliveryController],
  providers: [CreateDeliveryHandler],
})
export class CreateDeliveryModule {}
