import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from './process-payment.command';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { Repository } from 'typeorm';

@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler implements ICommandHandler<ProcessPaymentCommand> {
  constructor(
    @InjectRepository(PaymentsEntity)
    private readonly paymentsRepository: Repository<PaymentsEntity>,
  ) {}

  async execute(
    command: ProcessPaymentCommand,
  ): Promise<{ paymentId: string }> {
    const payment = await this.paymentsRepository.findOne({
      where: { id: command.paymentId },
    });

    if (!payment) {
      throw new Error(`Payment not found for paymentId: ${command.paymentId}`);
    }

    payment.process();
    await this.paymentsRepository.save(payment);
    return { paymentId: payment.id };
  }
}
