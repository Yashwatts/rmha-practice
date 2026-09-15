import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateOrderValidator } from './create-order.validator';
import { CreateOrderCommand } from './create-order.command';

@Controller('orders')
export class CreateOrderController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  async createOrder(
    @Body() createOrderValidator: CreateOrderValidator,
  ): Promise<{ orderId: string }> {
    return await this.commandBus.execute(
      new CreateOrderCommand(
        createOrderValidator.customerName,
        createOrderValidator.amount,
      ),
    );
  }
}
