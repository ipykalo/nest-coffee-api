import { Coffee } from './src/coffee/schemas/coffee.schema';
import { CoffeeRefactor1723871158666 } from './src/migrations/1723871158666-CoffeeRefactor';
import { DataSource } from 'typeorm';
import { SchemaSync1723873436136 } from './src/migrations/1723873436136-SchemaSync';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '12457800',
  database: 'coffee',
  entities: [Coffee],
  migrations: [CoffeeRefactor1723871158666, SchemaSync1723873436136],
});
