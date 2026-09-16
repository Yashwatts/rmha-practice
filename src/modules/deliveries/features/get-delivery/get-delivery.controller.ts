import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { getDeliveryInterface } from './get-delivery.interface';
import { GetDeliveryQuery } from './get-delivery.query';

@Controller('deliveries/:orderId')
export class GetDeliveryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getDelivery(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<getDeliveryInterface> {
    return await this.queryBus.execute(new GetDeliveryQuery(orderId));
  }
}
