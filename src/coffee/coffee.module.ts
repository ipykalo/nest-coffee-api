import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { Coffee, CoffeeSchema } from './schemas/coffee.schema';
import { ConfigModule } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';
import { LoggingMiddleware } from '../common/middlewares/logging/logging.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from '../events/schemas/event.schema';

@Module({
  controllers: [CoffeeController],
  providers: [CoffeeService],
  imports: [
    ConfigModule.forFeature(coffeeConfig),
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema,
      },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  exports: [CoffeeService],
})
export class CoffeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes(CoffeeController);
  }
}
