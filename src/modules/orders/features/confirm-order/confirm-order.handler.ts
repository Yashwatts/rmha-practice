import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmOrderCommand } from './confirm-order.command';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { OrderConfirmedEvent } from '../../domains/orders/events/order-confirmed.event';
import { OrdersOutboxEntity } from '../../infrastructure/database/outbox/orders-outbox.entity';

@CommandHandler(ConfirmOrderCommand)
export class ConfirmOrderHandler implements ICommandHandler<ConfirmOrderCommand> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: ConfirmOrderCommand): Promise<{ orderId: string }> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(OrdersEntity, {
        where: { id: command.orderId },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!order) {
        throw new Error('Order not found');
      }
      order.confirm();
      await manager.save(OrdersEntity, order);
      const event = new OrderConfirmedEvent(order.id);

      const outboxEvent = new OrdersOutboxEntity();
      outboxEvent.event_type = OrderConfirmedEvent.name;
      outboxEvent.aggregate_id = order.id;
      outboxEvent.payload = event;
      outboxEvent.published = false;

      await manager.save(OrdersOutboxEntity, outboxEvent);
      
      return { orderId: order.id };
    });
  }
}
