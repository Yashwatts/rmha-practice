import { Query } from '@nestjs/cqrs';
import { GetPaymentInterface } from './get-payment.interface';

export class GetPaymentQuery extends Query<GetPaymentInterface> {
  constructor(public readonly orderId: string) {
    super();
  }
}
