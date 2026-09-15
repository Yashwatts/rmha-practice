import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const MODULES = ['orders', 'payments', 'deliveries'] as const;
type ModuleName = (typeof MODULES)[number];

function getModuleFromEnv(): ModuleName | undefined {
  const matched = MODULES.filter(
    (mod) => process.env[`npm_config_${mod}`] === 'true',
  );

  if (matched.length > 1) {
    throw new Error(
      `Multiple module flags passed: ${matched.join(', ')}. Pass only one, e.g. --orders`,
    );
  }
  return matched[0];
}

const moduleName = getModuleFromEnv();

const migrations = [
  __dirname +
    `/../../../modules/${moduleName}/infrastructure/database/migrations/*.{ts,js}`,
];

const entities = [
  __dirname + `/../../../modules/${moduleName}/domains/orders/*.entity.{ts,js}`,
  __dirname + `/../../../modules/${moduleName}/domains/payments/*.entity.{ts,js}`,
  __dirname + `/../../../modules/${moduleName}/domains/deliveries/*.entity.{ts,js}`,
];

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities,
  migrations,
  migrationsRun: true,
  synchronize: false,
};

export default typeOrmConfig;
