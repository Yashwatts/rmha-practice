import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePaymentHandler } from './create-payment.handler';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { PaymentsInboxEntity } from '../../infrastructure/database/inbox/payments-inbox.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PaymentsEntity, PaymentsInboxEntity]),
  ],
  controllers: [],
  providers: [CreatePaymentHandler],
})
export class CreatePaymentModule {}
