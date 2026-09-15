import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DeliveriesTable1789464130551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'deliveries',
        schema: 'deliveries',
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
            name: 'status',
            type: 'enum',
            enum: ['READY', 'PREPARED'],
            default: "'READY'",
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
    await queryRunner.dropTable('deliveries', true);
  }
}
