import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { GetPaymentModule } from './features/get-payment/get-payment.module';
import { ProcessPaymentModule } from './features/process-payment/process-payment.module';
import { CompletePaymentModule } from './features/complete-payment/complete-payment.module';
import { FailPaymentModule } from './features/fail-payment/fail-payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsEntity } from './domains/payments/payments.entity';
import { PaymentsInboxEntity } from './infrastructure/database/inbox/payments-inbox.entity';
import { PaymentsOutboxEntity } from './infrastructure/database/outbox/payments-outbox.entity';
import { PaymentsConsumer } from './infrastructure/rabbitmq/payments.consumer';
import { PaymentsRetryPublisher } from './infrastructure/rabbitmq/payments-retry.publisher';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentsEntity,
      PaymentsInboxEntity,
      PaymentsOutboxEntity,
    ]),
    CqrsModule,
    GetPaymentModule,
    ProcessPaymentModule,
    CompletePaymentModule,
    FailPaymentModule,
  ],
  providers: [PaymentsConsumer, PaymentsRetryPublisher],
})
export class PaymentsModule {}
