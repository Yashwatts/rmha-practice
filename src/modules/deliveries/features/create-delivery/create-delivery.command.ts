import { Command } from '@nestjs/cqrs';

export class CreateDeliveryCommand extends Command<{ deliveryId: string }> {
  constructor(public readonly orderId: string) {
    super();
  }
}
