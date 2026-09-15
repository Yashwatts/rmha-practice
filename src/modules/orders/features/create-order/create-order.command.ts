import { Command } from '@nestjs/cqrs';

export class CreateOrderCommand extends Command<{orderId: string}> {
  constructor(
    public readonly customerName: string,
    public readonly amount: number,
  ) {
    super();
  }
}
