import { Injectable } from '@nestjs/common';
import { RabbitMQService } from 'src/shared/rabbitmq/rabbitmq.service';

@Injectable()
export class PaymentsRetryPublisher {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async publish(message: Buffer, headers: any): Promise<void> {
    const channel = this.rabbitMQService.getChannel();
    const exchange = process.env.RABBITMQ_RETRY_EXCHANGE!;
    const routingKey = process.env.RABBITMQ_RETRY_ROUTING_KEY!;
    const retryCount = Number(headers['x-retry-count']);

    const baseTtl = Number(process.env.RABBITMQ_RETRY_BASE_TTL);
    const ttl = baseTtl * Math.pow(2, retryCount - 1);

    channel.publish(exchange, routingKey, message, {
      persistent: true,
      contentType: 'application/json',
      messageId: headers['x-message-id'],
      headers: {
        ...headers,
        'x-retry-count': retryCount,
        'x-retry-ttl': ttl,
      },
      expiration: String(ttl),
    });
  }
}
