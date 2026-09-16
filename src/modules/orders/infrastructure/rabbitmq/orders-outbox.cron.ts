import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { OrdersOutboxEntity } from '../database/outbox/orders-outbox.entity';
import { OrdersPublisher } from './orders.publisher';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersOutboxCron {
  constructor(
    @InjectRepository(OrdersOutboxEntity)
    private readonly outboxRepository: Repository<OrdersOutboxEntity>,
    private readonly ordersPublisher: OrdersPublisher,
  ) {}

  @Cron('*/2 * * * * *')
  async publishPendingEvents(): Promise<void> {
    const events = await this.outboxRepository.find({
      where: {
        published: false,
      },
      order: {
        created_at: 'ASC',
      },
      take: 50,
    });

    for (const event of events) {
      try {
        await this.ordersPublisher.publish(event);
        event.published = true;
        await this.outboxRepository.save(event);
      } catch (error) {
        console.error(`Failed to publish outbox event ${event.id}`, error);
      }
    }
  }
}
