import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { PrepareDeliveryCommand } from './prepare-delivery.command';

@Controller('deliveries/:deliveryId/prepare')
export class PrepareDeliveryController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async prepareDelivery(
    @Param('deliveryId', ParseUUIDPipe) deliveryId: string,
  ) {
    return await this.commandBus.execute(
      new PrepareDeliveryCommand(deliveryId),
    );
  }
}
