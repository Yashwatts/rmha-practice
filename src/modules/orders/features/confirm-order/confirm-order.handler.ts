import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmOrderCommand } from './confirm-order.command';
import { Repository } from 'typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmOrderCommand> {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<{ orderId: string }> {
    const order = await this.orderRepository.findOne({
      where: { id: command.orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${command.orderId} not found`);
    }

    order.confirm();
    await this.orderRepository.save(order);
    return { orderId: order.id };
  }
}
