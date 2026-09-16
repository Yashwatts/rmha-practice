import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DeliveriesInbox1789551836706 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'inbox',
        schema: 'deliveries',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'message_id',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'event_type',
            type: 'varchar',
          },
          {
            name: 'payload',
            type: 'jsonb',
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
    await queryRunner.dropTable('inbox');
  }
}
