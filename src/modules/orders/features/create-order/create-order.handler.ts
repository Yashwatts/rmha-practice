import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateOrderCommand } from './create-order.command';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { DataSource } from 'typeorm';
import { OrderCreatedEvent } from '../../domains/orders/events/order-created.event';
import { OrdersOutboxEntity } from '../../infrastructure/database/outbox/orders-outbox.entity';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CreateOrderCommand): Promise<{ orderId: string }> {
    return this.dataSource.transaction(async (manager) => {
      const order = OrdersEntity.create(command.customerName, command.amount);
      await manager.save(OrdersEntity, order);

      const event = new OrderCreatedEvent(
        order.id,
        order.customer_name,
        order.amount,
      );

      const outboxEvent = new OrdersOutboxEntity();

      outboxEvent.event_type = OrderCreatedEvent.name;
      outboxEvent.aggregate_id = order.id;
      outboxEvent.payload = event;
      outboxEvent.published = false;

      await manager.save(OrdersOutboxEntity, outboxEvent);

      return { orderId: order.id };
    });
  }
}
