import { Command } from '@nestjs/cqrs';

export class CancelOrderCommand extends Command<{ orderId: string }> {
  constructor(public readonly orderId: string) {
    super();
  }
}
