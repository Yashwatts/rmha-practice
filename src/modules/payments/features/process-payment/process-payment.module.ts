import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { ProcessPaymentController } from './process-payment.controller';
import { ProcessPaymentHandler } from './process-payment.handler';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PaymentsEntity])],
  controllers: [ProcessPaymentController],
  providers: [ProcessPaymentHandler],
})
export class ProcessPaymentModule {}
