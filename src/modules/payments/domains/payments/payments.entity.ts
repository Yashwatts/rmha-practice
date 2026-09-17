import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatusEnum } from './enums/payment-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity({
  name: 'payments',
  schema: 'payments',
})
export class PaymentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  order_id: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.PENDING,
  })
  status: PaymentStatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static create(order_id: string, amount: number): PaymentsEntity {
    const payment = new PaymentsEntity();

    payment.id = uuidv4();
    payment.order_id = order_id;
    payment.amount = amount;
    payment.status = PaymentStatusEnum.PENDING;

    return payment;
  }

  process(): void {
    if (this.status !== PaymentStatusEnum.PENDING) {
      throw new Error(`Payment cannot be processed from ${this.status} status`);
    }
    this.status = PaymentStatusEnum.PROCESSING;
  }

  complete(): void {
    if (this.status !== PaymentStatusEnum.PROCESSING) {
      throw new Error(`Payment cannot be completed from ${this.status} status`);
    }
    this.status = PaymentStatusEnum.COMPLETED;
  }

  fail(): void {
    if (this.status !== PaymentStatusEnum.PROCESSING) {
      throw new Error(`Payment cannot be failed from ${this.status} status`);
    }
    this.status = PaymentStatusEnum.FAILED;
  }

  cancel(): void {
    if (this.status !== PaymentStatusEnum.PENDING) {
      throw new Error(`Payment cannot be cancelled from ${this.status} status`);
    }

    this.status = PaymentStatusEnum.CANCELLED;
  }
}
