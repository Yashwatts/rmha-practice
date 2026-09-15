import { DataSource } from 'typeorm';
import { typeOrmConfig } from './config/orm.config';

export const AppDataSource = new DataSource(typeOrmConfig);
