import { Controller, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CompletePaymentCommand } from './complete-payment.command';

@Controller('payments/:paymentId/complete')
export class CompletePaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Patch()
  async completePayment(
    @Param('paymentId', ParseUUIDPipe) paymentId: string,
  ): Promise<{ paymentId: string }> {
    return await this.commandBus.execute(new CompletePaymentCommand(paymentId));
  }
}
