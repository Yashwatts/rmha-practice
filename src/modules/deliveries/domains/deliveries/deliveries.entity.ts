import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeliveryStatusEnum } from './enums/delivery-status.enum';

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
}
