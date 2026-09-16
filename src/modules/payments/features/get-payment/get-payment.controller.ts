import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetPaymentInterface } from './get-payment.interface';
import { GetPaymentQuery } from './get-payment.query';

@Controller('payments/:orderId')
export class GetPaymentController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getPayment(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<GetPaymentInterface> {
    return await this.queryBus.execute(new GetPaymentQuery(orderId));
  }
}
