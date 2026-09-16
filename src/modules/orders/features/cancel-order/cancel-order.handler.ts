import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { CancelOrderCommand } from './cancel-order.command';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { OrderCancelledEvent } from '../../domains/orders/events/order-cancelled.event';
import { OrdersOutboxEntity } from '../../infrastructure/database/outbox/orders-outbox.entity';

@CommandHandler(CancelOrderCommand)
export class CancelOrderHandler implements ICommandHandler<CancelOrderCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: CancelOrderCommand): Promise<{ orderId: string }> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrdersEntity, {
        where: { id: command.orderId },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!order) {
        throw new Error(`Order with ID ${command.orderId} not found`);
      }

      order.cancel();
      await manager.save(OrdersEntity, order);

      const event = new OrderCancelledEvent(order.id);
      const outboxEvent = new OrdersOutboxEntity();
      outboxEvent.event_type = OrderCancelledEvent.name;
      outboxEvent.aggregate_id = order.id;
      outboxEvent.payload = event;
      outboxEvent.published = false;

      await manager.save(OrdersOutboxEntity, outboxEvent);

      return { orderId: order.id };
    });
  }
}
