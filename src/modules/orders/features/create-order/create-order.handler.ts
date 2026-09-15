import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderCommand } from './create-order.command';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
  ) {}

  async execute(command: CreateOrderCommand): Promise<{ orderId: string }> {
    const order = OrdersEntity.create(command.customerName, command.amount);
    await this.orderRepository.save(order);
    return { orderId: order.id };
  }
}
