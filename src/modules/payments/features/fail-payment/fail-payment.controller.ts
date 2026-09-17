import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FailPaymentCommand } from './fail-payment.command';

@Controller('payments/:paymentId/fail')
export class FailPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async failPayment(@Param('paymentId', ParseUUIDPipe) paymentId: string) {
    return await this.commandBus.execute(new FailPaymentCommand(paymentId));
  }
}