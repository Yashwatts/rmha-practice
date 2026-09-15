import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmOrderCommand } from './confirm-order.command';

@Controller('orders/:orderId/confirm')
export class ConfirmOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async confirmOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<{ orderId: string }> {
    return await this.commandBus.execute(new ConfirmOrderCommand(orderId));
  }
}
