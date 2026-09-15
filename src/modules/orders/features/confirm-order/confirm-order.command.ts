import { Command } from '@nestjs/cqrs';

export class ConfirmOrderCommand extends Command<{ orderId: string }> {
  constructor(public readonly orderId: string) {
    super();
  }
}
