import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CancelOrderCommand } from './cancel-order.command';

@Controller('orders/:orderId/cancel')
export class CancelOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async cancelOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<{ orderId: string }> {
    return await this.commandBus.execute(new CancelOrderCommand(orderId));
  }
}
