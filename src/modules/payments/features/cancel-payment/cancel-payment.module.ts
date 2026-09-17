import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { PaymentsInboxEntity } from '../../infrastructure/database/inbox/payments-inbox.entity';
import { CancelPaymentHandler } from './cancel-payment.handler';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PaymentsEntity, PaymentsInboxEntity]),
  ],
  controllers: [],
  providers: [CancelPaymentHandler],
})
export class CancelPaymentModule {}
