import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeliveryStatusEnum } from './enums/delivery-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Entity({
  name: 'deliveries',
  schema: 'deliveries',
})
export class DeliveriesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  order_id: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatusEnum,
    default: DeliveryStatusEnum.READY,
  })
  status: DeliveryStatusEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  static create(order_id: string): DeliveriesEntity {
    const delivery = new DeliveriesEntity();

    delivery.id = uuidv4();
    delivery.order_id = order_id;
    delivery.status = DeliveryStatusEnum.READY;

    return delivery;
  }

  prepare(): void {
    if (this.status !== DeliveryStatusEnum.READY) {
      throw new Error(`Delivery cannot be prepared from ${this.status} status`);
    }
    this.status = DeliveryStatusEnum.PREPARED;
  }
}
