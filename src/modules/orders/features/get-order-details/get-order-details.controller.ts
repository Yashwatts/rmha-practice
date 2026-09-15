import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrderDetailsInterface } from './get-order-details.interface';
import { GetOrderDetailsQuery } from './get-order-details.query';

@Controller('orders/:orderId')
export class GetOrderDetailsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getOrderDetails(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<GetOrderDetailsInterface> {
    return await this.queryBus.execute(new GetOrderDetailsQuery(orderId));
  }

}
