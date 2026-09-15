import { MigrationInterface, QueryRunner } from 'typeorm';

export class PaymentsSchema1789463710595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('payments', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema('payments', true);
  }
}
