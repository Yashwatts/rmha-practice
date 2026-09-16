import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PaymentsOutbox1789551608207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'outbox',
        schema: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'event_type',
            type: 'varchar',
          },
          {
            name: 'aggregate_id',
            type: 'uuid',
          },
          {
            name: 'payload',
            type: 'jsonb',
          },
          {
            name: 'published',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('outbox');
  }
}
