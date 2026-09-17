import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { OrdersOutboxEntity } from '../database/outbox/orders-outbox.entity';

@Injectable()
export class OrdersPublisher {
  constructor(private readonly rabbitMqService: RabbitMQService) {}

  async publish(outboxEvent: OrdersOutboxEntity): Promise<void> {
    const channel = this.rabbitMqService.getChannel();
    const exchange = process.env.RABBITMQ_ORDERS_TO_PAYMENTS_EXCHANGE!;

    let routingKey: string;
    switch (outboxEvent.event_type) {
      case 'OrderCreatedEvent':
        routingKey = process.env.RABBITMQ_ORDER_CREATED_ROUTING_KEY!;
        break;
      case 'OrderConfirmedEvent':
        routingKey = process.env.RABBITMQ_ORDER_CONFIRMED_ROUTING_KEY!;
        break;
      case 'OrderCancelledEvent':
        routingKey = process.env.RABBITMQ_ORDER_CANCELLED_ROUTING_KEY!;
        break;
      default:
        throw new Error(`Unknown event type: ${outboxEvent.event_type}`);
    }

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
        headers: {
          'x-event-type': outboxEvent.event_type,
        },
      },
    );
  }
}
