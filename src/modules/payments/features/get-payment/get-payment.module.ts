import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { GetPaymentController } from './get-payment.controller';
import { GetPaymentHandler } from './get-payment.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PaymentsEntity])],
  controllers: [GetPaymentController],
  providers: [GetPaymentHandler],
})
export class GetPaymentModule {}
