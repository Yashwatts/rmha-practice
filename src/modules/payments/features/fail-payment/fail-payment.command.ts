import { Command } from '@nestjs/cqrs';

export class FailPaymentCommand extends Command<{ paymentId: string }> {
  constructor(public readonly paymentId: string) {
    super();
  }
}
