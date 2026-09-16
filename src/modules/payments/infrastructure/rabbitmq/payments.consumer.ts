import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { DataSource } from 'typeorm';
import { PaymentsInboxEntity } from '../database/inbox/payments-inbox.entity';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { PaymentsRetryPublisher } from './payments-retry.publisher';

@Injectable()
export class PaymentsConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly paymentsRetryPublisher: PaymentsRetryPublisher,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    const channel = this.rabbitMQService.getChannel();

    const dlqExchange = process.env.RABBITMQ_DLQ_EXCHANGE!;
    const dlqQueue = process.env.RABBITMQ_DLQ_QUEUE!;
    const dlqRoutingKey = process.env.RABBITMQ_DLQ_ROUTING_KEY!;

    await channel.assertExchange(dlqExchange, 'direct', {
      durable: true,
    });

    await channel.assertQueue(dlqQueue, {
      durable: true,
    });

    await channel.bindQueue(dlqQueue, dlqExchange, dlqRoutingKey);

    const exchange = process.env.RABBITMQ_ORDERS_TO_PAYMENTS_EXCHANGE!;
    const queue = process.env.RABBITMQ_PAYMENTS_QUEUE!;
    const routingKey = process.env.RABBITMQ_ORDER_CREATED_ROUTING_KEY!;

    await channel.assertExchange(exchange, 'topic', {
      durable: true,
    });

    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlqExchange,
        'x-dead-letter-routing-key': dlqRoutingKey,
      },
    });

    await channel.bindQueue(queue, exchange, routingKey);

    const retryExchange = process.env.RABBITMQ_RETRY_EXCHANGE!;
    const retryQueue = process.env.RABBITMQ_RETRY_QUEUE!;
    const retryRoutingKey = process.env.RABBITMQ_RETRY_ROUTING_KEY!;

    await channel.assertExchange(retryExchange, 'direct', {
      durable: true,
    });

    await channel.assertQueue(retryQueue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': exchange,
        'x-dead-letter-routing-key': routingKey,
      },
    });

    await channel.bindQueue(retryQueue, retryExchange, retryRoutingKey);

    const prefetchCount = Number(process.env.RABBITMQ_PREFETCH_COUNT);
    channel.prefetch(prefetchCount);

    await channel.consume(
      queue,
      async (message) => {
        if (!message) {
          return;
        }

        try {
          const event = JSON.parse(message.content.toString());
          const messageId = message.properties.messageId;
          if (!messageId) {
            throw new Error('RabbitMQ messageId is missing');
          }

          await this.dataSource.transaction(async (manager) => {
            const existingInbox = await manager.findOne(PaymentsInboxEntity, {
              where: { message_id: messageId },
            });
            if (existingInbox) {
              return;
            }
            // throw new Error('TEST RETRY');
            const payment = PaymentsEntity.create(event.orderId, event.amount);
            await manager.save(PaymentsEntity, payment);

            const inbox = new PaymentsInboxEntity();

            inbox.message_id = messageId;
            inbox.event_type = 'OrderCreatedEvent';
            inbox.payload = event;

            await manager.save(PaymentsInboxEntity, inbox);
          });
          channel.ack(message);
        } catch (error) {
          console.error('Error processing message:', error);
          const currentRetryCount = Number(
            message.properties.headers?.['x-retry-count'] ?? 0,
          );

          const maxRetries = Number(process.env.RABBITMQ_MAX_RETRIES);

          if (currentRetryCount >= maxRetries) {
            channel.nack(message, false, false);
            return;
          }

          const nextRetryCount = currentRetryCount + 1;

          await this.paymentsRetryPublisher.publish(message.content, {
            'x-retry-count': nextRetryCount,
            'x-message-id': message.properties.messageId,
          });

          channel.ack(message);
        }
      },
      {
        noAck: false,
      },
    );
  }
}
