import { Command } from '@nestjs/cqrs';

export class PrepareDeliveryCommand extends Command<{ deliveryId: string }> {
  constructor(public readonly deliveryId: string) {
    super();
  }
}
