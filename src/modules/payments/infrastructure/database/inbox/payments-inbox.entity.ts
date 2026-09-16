import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'inbox',
  schema: 'payments',
})
export class PaymentsInboxEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  message_id: string;

  @Column()
  event_type: string;

  @Column({
    type: 'jsonb',
  })
  payload: any;

  @CreateDateColumn()
  created_at: Date;
}
