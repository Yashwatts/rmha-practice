import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeliveriesSchema1789463630849 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('deliveries', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema('deliveries', true);
  }
}
