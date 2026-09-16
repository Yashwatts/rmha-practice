import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { OrdersOutboxEntity } from '../database/outbox/orders-outbox.entity';

@Injectable()
export class OrdersPublisher {
  constructor(private readonly rabbitMqService: RabbitMQService) {}

  async publish(outboxEvent: OrdersOutboxEntity): Promise<void> {
    const channel = this.rabbitMqService.getChannel();
    const exchange = process.env.RABBITMQ_ORDERS_TO_PAYMENTS_EXCHANGE!;
    const routingKey = process.env.RABBITMQ_ORDER_CREATED_ROUTING_KEY!;

    await channel.assertExchange(exchange, 'topic', {
      durable: true,
    });

    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(outboxEvent.payload)),
      {
        persistent: true,
        contentType: 'application/json',
        messageId: outboxEvent.id,
      },
    );
  }
}
