import { Command } from '@nestjs/cqrs';

export class CancelPaymentCommand extends Command<{ paymentId: string }> {
  constructor(
    public readonly orderId: string,
    public readonly messageId: string,
    public readonly eventType: string,
    public readonly payload: Record<string, any>,
  ) {
    super();
  }
}
