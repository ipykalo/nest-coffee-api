import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { ConfigModule } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';
import { LoggingMiddleware } from 'src/common/middlewares/logging/logging.middleware';

@Module({
  controllers: [CoffeeController],
  providers: [CoffeeService],
  imports: [
    ConfigModule.forFeature(coffeeConfig),
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
  ],
  exports: [CoffeeService],
})
export class CoffeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(CoffeeController);
  }
}
