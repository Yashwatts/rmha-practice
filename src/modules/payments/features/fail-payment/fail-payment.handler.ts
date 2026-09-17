import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FailPaymentCommand } from './fail-payment.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { Repository } from 'typeorm';

@CommandHandler(FailPaymentCommand)
export class FailPaymentHandler implements ICommandHandler<FailPaymentCommand> {
  constructor(
    @InjectRepository(PaymentsEntity)
    private readonly paymentsRepository: Repository<PaymentsEntity>,
  ) {}

  async execute(command: FailPaymentCommand): Promise<{ paymentId: string }> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: command.paymentId },
    });

    if (!payment) {
      throw new Error(`Payment not found for paymentId: ${command.paymentId}`);
    }

    payment.fail();
    await this.paymentsRepository.save(payment);
    return { paymentId: payment.id };
  }
}