import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CancelPaymentCommand } from './cancel-payment.command';
import { PaymentsInboxEntity } from '../../infrastructure/database/inbox/payments-inbox.entity';
import { PaymentsEntity } from '../../domains/payments/payments.entity';

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentHandler implements ICommandHandler<CancelPaymentCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CancelPaymentCommand): Promise<{ paymentId: string }> {
    return this.dataSource.transaction(async (manager) => {
      const existingInbox = await manager.findOne(PaymentsInboxEntity, {
        where: { message_id: command.messageId },
      });

      if (existingInbox) {
        const existingPayment = await manager.findOne(PaymentsEntity, {
          where: { order_id: command.orderId },
        });

        if (!existingPayment) {
          throw new Error(`Payment not found for orderId: ${command.orderId}`);
        }

        return { paymentId: existingPayment.id };
      }

      const payment = await manager.findOne(PaymentsEntity, {
        where: { order_id: command.orderId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!payment) {
        throw new Error(`Payment not found for orderId: ${command.orderId}`);
      }

      payment.cancel();
      await manager.save(PaymentsEntity, payment);

      const inbox = new PaymentsInboxEntity();
      inbox.message_id = command.messageId;
      inbox.event_type = command.eventType;
      inbox.payload = command.payload;

      await manager.save(PaymentsInboxEntity, inbox);

      return {
        paymentId: payment.id,
      };
    });
  }
}
