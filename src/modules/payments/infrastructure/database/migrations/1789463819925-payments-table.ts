import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class PaymentsTable1789463819925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        schema: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'order_id',
            type: 'uuid',
          },
          {
            name: 'amount',
            type: 'numeric',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
            default: "'PENDING'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payments', true);
  }
}
