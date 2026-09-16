import { Command } from '@nestjs/cqrs';

export class CompletePaymentCommand extends Command<{ paymentId: string }> {
  constructor(public readonly paymentId: string) {
    super();
  }
}
