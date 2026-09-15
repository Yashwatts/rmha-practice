import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatusEnum } from './enums/order-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity({
  name: 'orders',
  schema: 'orders',
})
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer_name: string;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.CREATED,
  })
  status: OrderStatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static create(customer_name: string, amount: number): OrdersEntity {
    const order = new OrdersEntity();
    order.id = uuidv4();
    order.customer_name = customer_name;
    order.amount = amount;
    order.status = OrderStatusEnum.CREATED;

    return order;
  }

  confirm(): void {
    if (this.status !== OrderStatusEnum.CREATED) {
      throw new Error(`Order cannot be confirmed from ${this.status} status`);
    }
    this.status = OrderStatusEnum.CONFIRMED;
  }

  cancel(): void {
    if (this.status !== OrderStatusEnum.CREATED) {
      throw new Error(`Order cannot be cancelled from ${this.status} status`);
    }
    this.status = OrderStatusEnum.CANCELLED;
  }
}
