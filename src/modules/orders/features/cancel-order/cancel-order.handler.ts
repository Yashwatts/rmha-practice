import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CancelOrderCommand } from './cancel-order.command';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
  ) {}

  async execute(command: CancelOrderCommand): Promise<{ orderId: string }> {
    const order = await this.orderRepository.findOne({
      where: { id: command.orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${command.orderId} not found`);
    }

    order.cancel();
    await this.orderRepository.save(order);
    return { orderId: order.id };
  }
}
