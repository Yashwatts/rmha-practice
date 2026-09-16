import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';

@Injectable()
export class DeliveriesConsumer implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    const exchange = process.env.RABBITMQ_PAYMENTS_TO_DELIVERIES_EXCHANGE!;
    const queue = process.env.RABBITMQ_DELIVERIES_QUEUE!;
    const routingKey = process.env.RABBITMQ_PAYMENT_COMPLETED_ROUTING_KEY!;

    await channel.assertExchange(exchange, 'topic', {
      durable: true,
    });

    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.bindQueue(queue, exchange, routingKey);

    await channel.consume(
      queue,
      async (message) => {
        if (!message) {
          return;
        }
        try {
          const event = JSON.parse(message.content.toString());
          console.log('Received PaymentCompletedEvent:', event);
          channel.ack(message);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      },
    );
  }
}
