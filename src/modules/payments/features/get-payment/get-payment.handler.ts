import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPaymentQuery } from './get-payment.query';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsEntity } from '../../domains/payments/payments.entity';
import { Repository } from 'typeorm';
import { GetPaymentInterface } from './get-payment.interface';

@QueryHandler(GetPaymentQuery)
export class GetPaymentHandler implements IQueryHandler<GetPaymentQuery> {
  constructor(
    @InjectRepository(PaymentsEntity)
    private readonly paymentsRepository: Repository<PaymentsEntity>,
  ) {}

  async execute(query: GetPaymentQuery): Promise<GetPaymentInterface> {
    const payment = await this.paymentsRepository.findOne({
      where: { order_id: query.orderId },
    });

    if (!payment) {
      throw new Error(`Payment not found for orderId: ${query.orderId}`);
    }

    return {
      id: payment.id,
      orderId: payment.order_id,
      amount: payment.amount,
      status: payment.status,
    };
  }
}
