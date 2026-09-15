import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatusEnum } from './enums/payment-status.enum';

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
}
