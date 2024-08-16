import { Module } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  controllers: [CoffeeController],
  providers: [CoffeeService],
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  exports: [CoffeeService],
})
export class CoffeeModule {}
