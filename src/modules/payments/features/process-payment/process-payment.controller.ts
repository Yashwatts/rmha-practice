import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from './process-payment.command';

@Controller('payments/:paymentId/process')
export class ProcessPaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async processPayment(@Param('paymentId', ParseUUIDPipe) paymentId: string) {
    return await this.commandBus.execute(new ProcessPaymentCommand(paymentId));
  }
}
