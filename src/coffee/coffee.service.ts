import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './schemas/coffee.schema';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { GetCoffeeDto } from './dto/get-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { ConfigType } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';
import { Event } from '../events/schemas/event.schema';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectModel(Coffee.name) private readonly coffeeModel: Model<Coffee>,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectConnection() private readonly connection: Connection,
    @Inject(coffeeConfig.KEY)
    private readonly coffeesConfig: ConfigType<typeof coffeeConfig>,
  ) {
    console.log(this.coffeesConfig);
  }

  getAllCoffees(paginationQuery: PaginationQueryDto): Promise<GetCoffeeDto[]> {
    return this.coffeeModel
      .find({}, null, {
        skip: paginationQuery.offset,
        limit: paginationQuery.limit,
      })
      .exec();
  }

  async getCoffeeById(_id: string): Promise<Coffee> {
    const coffee = await this.coffeeModel
      .findOne({
        _id,
      })
      .exec();

    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${_id} not found.`);
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto): Promise<GetCoffeeDto> {
    const coffee = new this.coffeeModel(createCoffeeDto);

    return coffee.save();
  }

  async update(
    _id: string,
    updateCoffeeDto: UpdateCoffeeDto,
  ): Promise<GetCoffeeDto> {
    const updatedCoffee = await this.coffeeModel
      .findOneAndUpdate({ _id }, { $set: updateCoffeeDto }, { new: true })
      .exec();

    if (!updatedCoffee) {
      throw new NotFoundException(`Coffee #${_id} not found`);
    }

    return updatedCoffee;
  }

  remove(_id: string): Promise<GetCoffeeDto> {
    return this.coffeeModel.findOneAndDelete({ _id }).exec();
  }

  async recommendCoffee(coffeeId: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const coffee = await this.getCoffeeById(coffeeId);
      coffee.recommendations++;

      await this.coffeeModel
        .findOneAndUpdate(
          { _id: coffee._id },
          { $set: coffee },
          { new: true, session },
        )
        .exec();

      const event = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId },
      });
      await event.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }
}
