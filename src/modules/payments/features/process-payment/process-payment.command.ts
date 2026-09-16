import { Command } from '@nestjs/cqrs';

export class ProcessPaymentCommand extends Command<{ paymentId: string }> {
  constructor(public readonly paymentId: string) {
    super();
  }
}
