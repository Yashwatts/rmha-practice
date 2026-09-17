import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';
import { PaymentsRetryPublisher } from './payments-retry.publisher';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../../features/create-payment/create-payment.command';
import { ProcessPaymentCommand } from '../../features/process-payment/process-payment.command';
import { CancelPaymentCommand } from '../../features/cancel-payment/cancel-payment.command';

@Injectable()
export class PaymentsConsumer implements OnModuleInit {
  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly paymentsRetryPublisher: PaymentsRetryPublisher,
    private readonly commandBus: CommandBus,
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

    const orderCreatedRoutingKey =
      process.env.RABBITMQ_ORDER_CREATED_ROUTING_KEY!;
    const orderConfirmedRoutingKey =
      process.env.RABBITMQ_ORDER_CONFIRMED_ROUTING_KEY!;
    const orderCancelledRoutingKey =
      process.env.RABBITMQ_ORDER_CANCELLED_ROUTING_KEY!;
    const orderRetryRoutingKey = process.env.RABBITMQ_ORDER_RETRY_ROUTING_KEY!;

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

    await channel.bindQueue(queue, exchange, orderCreatedRoutingKey);
    await channel.bindQueue(queue, exchange, orderConfirmedRoutingKey);
    await channel.bindQueue(queue, exchange, orderCancelledRoutingKey);
    await channel.bindQueue(queue, exchange, orderRetryRoutingKey);

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
        'x-dead-letter-routing-key': orderRetryRoutingKey,
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
          const eventType = message.properties.headers?.['x-event-type'];

          if (!eventType) {
            throw new Error('RabbitMQ event type is missing');
          }
          if (!messageId) {
            throw new Error('RabbitMQ messageId is missing');
          }

          const currentRetryCount = Number(
            message.properties.headers?.['x-retry-count'] ?? 0,
          );
          const maxRetries = Number(process.env.RABBITMQ_MAX_RETRIES);
          const maxInternalAttempts = Number(
            process.env.RABBITMQ_MAX_INTERNAL_ATTEMPTS,
          );

          for (let attempt = 1; attempt <= maxInternalAttempts; attempt++) {
            try {
              switch (eventType) {
                case 'OrderCreatedEvent':
                  await this.commandBus.execute(
                    new CreatePaymentCommand(
                      event.orderId,
                      event.amount,
                      messageId,
                      eventType,
                      event,
                    ),
                  );
                  break;

                case 'OrderConfirmedEvent':
                  await this.commandBus.execute(
                    new ProcessPaymentCommand(
                      event.orderId,
                      messageId,
                      eventType,
                      event,
                    ),
                  );
                  break;

                case 'OrderCancelledEvent':
                  await this.commandBus.execute(
                    new CancelPaymentCommand(
                      event.orderId,
                      messageId,
                      eventType,
                      event,
                    ),
                  );
                  break;

                default:
                  throw new Error(`Unsupported order event: ${eventType}`);
              }
              channel.ack(message);
              return;
            } catch (error) {
              console.error(
                `Attempt ${attempt}/${maxInternalAttempts} failed:`,
                error,
              );
            }
          }

          if (currentRetryCount >= maxRetries - 1) {
            console.error(
              `Message ${messageId} exhausted ${maxRetries} retry cycles.`,
            );
            channel.nack(message, false, false);
            return;
          }

          const nextRetryCount = currentRetryCount + 1;

          await this.paymentsRetryPublisher.publish(message.content, {
            'x-retry-count': nextRetryCount,
            'x-attempt-count': 0,
            'x-message-id': messageId,
            'x-event-type': eventType,
          });

          channel.ack(message);
        } catch (error) {
          console.error('Error preparing message:', error);

          channel.nack(message, false, false);
        }
      },
      {
        noAck: false,
      },
    );
  }
}
