import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { FailPaymentController } from './fail-payment.controller';
import { FailPaymentHandler } from './fail-payment.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PaymentsEntity])],
  controllers: [FailPaymentController],
  providers: [FailPaymentHandler],
})
export class FailPaymentModule {}
