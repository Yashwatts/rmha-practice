import { Query } from '@nestjs/cqrs';
import { getDeliveryInterface } from './get-delivery.interface';

export class GetDeliveryQuery extends Query<getDeliveryInterface> {
  constructor(public readonly orderId: string) {
    super();
  }
}
