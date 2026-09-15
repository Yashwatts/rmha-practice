import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class OrdersTable1789463992879 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        schema: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'customer_name',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'numeric',
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['CREATED', 'CONFIRMED', 'CANCELLED'],
            default: "'CREATED'",
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
    await queryRunner.dropTable('orders', true);
  }
}
