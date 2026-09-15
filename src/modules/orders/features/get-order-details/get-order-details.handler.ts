import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderDetailsQuery } from './get-order-details.query';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domains/orders/orders.entity';
import { Repository } from 'typeorm';
import { GetOrderDetailsInterface } from './get-order-details.interface';

@QueryHandler(GetOrderDetailsQuery)
export class GetOrderDetailsHandler implements IQueryHandler<GetOrderDetailsQuery> {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly orderRepository: Repository<OrdersEntity>,
  ) {}

  async execute(query: GetOrderDetailsQuery) {
    const order = await this.orderRepository.findOne({
      where: { id: query.orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${query.orderId} not found`);
    }

    return {
      id: order.id,
      customer_name: order.customer_name,
      amount: order.amount,
      status: order.status,
    };
  }
}
