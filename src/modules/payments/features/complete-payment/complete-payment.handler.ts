import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { Repository } from 'typeorm';
import { CompletePaymentCommand } from './complete-payment.command';

@CommandHandler(CompletePaymentCommand)
export class CompletePaymentHandler implements ICommandHandler<CompletePaymentCommand> {
  constructor(
    @InjectRepository(PaymentsEntity)
    private readonly paymentsRepository: Repository<PaymentsEntity>,
  ) {}

  async execute(
    command: CompletePaymentCommand,
  ): Promise<{ paymentId: string }> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: command.paymentId },
    });

    if (!payment) {
      throw new Error(`Payment not found for paymentId: ${command.paymentId}`);
    }

    payment.complete();
    await this.paymentsRepository.save(payment);
    return { paymentId: payment.id };
  }
}
