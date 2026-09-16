import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateDeliveryValidator } from './create-delivery.validator';
import { CreateDeliveryCommand } from './create-delivery.command';

@Controller('deliveries')
export class CreateDeliveryController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createDelivery(
    @Body() createDeliveryValidator: CreateDeliveryValidator,
  ): Promise<{ deliveryId: string }> {
    return await this.commandBus.execute(
      new CreateDeliveryCommand(createDeliveryValidator.orderId),
    );
  }
}
