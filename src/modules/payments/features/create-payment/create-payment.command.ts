import { Command } from '@nestjs/cqrs';

export class CreatePaymentCommand extends Command<{ paymentId: string }> {
  constructor(
    public readonly orderId: string,
    public readonly amount: number,
    public readonly messageId: string,
    public readonly eventType: string,
    public readonly payload: any,
  ) {
    super();
  }
}
