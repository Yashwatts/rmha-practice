import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDeliveryQuery } from './get-delivery.query';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveriesEntity } from '../../domains/deliveries/deliveries.entity';
import { Repository } from 'typeorm';
import { getDeliveryInterface } from './get-delivery.interface';

@QueryHandler(GetDeliveryQuery)
export class GetDeliveryHandler implements IQueryHandler<GetDeliveryQuery> {
  constructor(
    @InjectRepository(DeliveriesEntity)
    private readonly deliveriesRepository: Repository<DeliveriesEntity>,
  ) {}

  async execute(query: GetDeliveryQuery): Promise<getDeliveryInterface> {
    const delivery = await this.deliveriesRepository.findOne({
      where: { order_id: query.orderId },
    });

    if (!delivery) {
      throw new Error(`Delivery not found for orderId: ${query.orderId}`);
    }

    return {
      id: delivery.id,
      orderId: delivery.order_id,
      status: delivery.status,
    };
  }
}
