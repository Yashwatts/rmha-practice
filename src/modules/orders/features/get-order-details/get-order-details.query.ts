import { Query } from '@nestjs/cqrs';
import { GetOrderDetailsInterface } from './get-order-details.interface';

export class GetOrderDetailsQuery extends Query<GetOrderDetailsInterface> {
  constructor(public readonly orderId: string) {
    super();
  }
}
