import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Module({
  controllers: [CoffeeController],
  providers: [CoffeeService],
  imports: [TypeOrmModule.forFeature([Coffee, Flavor])],
  exports: [CoffeeService],
})
export class CoffeeModule {}
