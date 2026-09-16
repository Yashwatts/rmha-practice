import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { CompletePaymentController } from './complete-payment.controller';
import { CompletePaymentHandler } from './complete-payment.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PaymentsEntity])],
  controllers: [CompletePaymentController],
  providers: [CompletePaymentHandler],
})
export class CompletePaymentModule {}
