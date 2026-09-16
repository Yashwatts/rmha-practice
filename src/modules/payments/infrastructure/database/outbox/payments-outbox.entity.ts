import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'outbox',
  schema: 'payments',
})
export class PaymentsOutboxEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  event_type: string;

  @Column({
    type: 'uuid',
  })
  aggregate_id: string;

  @Column({
    type: 'jsonb',
  })
  payload: any;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  created_at: Date;
}
