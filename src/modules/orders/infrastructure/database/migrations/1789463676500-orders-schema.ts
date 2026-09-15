import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrdersSchema1789463676500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('orders', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema('orders', true);
  }
}
