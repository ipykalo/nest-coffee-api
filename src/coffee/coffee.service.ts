import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { GetCoffeeDto } from './dto/get-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { ConfigType } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';

@Injectable()
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(coffeeConfig.KEY)
    private readonly coffeesConfig: ConfigType<typeof coffeeConfig>,
  ) {
    console.log(this.coffeesConfig);
  }

  getAllCoffees(paginationQuery: PaginationQueryDto): Promise<GetCoffeeDto[]> {
    return this.coffeeRepository.find({
      relations: { flavors: true },
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  async getCoffeeById(id: string): Promise<Coffee> {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: { flavors: true },
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} not found.`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto): Promise<GetCoffeeDto> {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });

    return this.coffeeRepository.save(coffee);
  }

  async update(
    id: string,
    updateCoffeeDto: UpdateCoffeeDto,
  ): Promise<GetCoffeeDto> {
    let flavors = [];

    if (Array.isArray(updateCoffeeDto.flavors)) {
      flavors = await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      );
    }

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string): Promise<GetCoffeeDto> {
    const coffee = await this.getCoffeeById(id);

    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const coffee = await queryRunner.manager.findOneBy(Coffee, { id });
      coffee.recommendations++;

      const event = new Event();
      event.name = 'recommend_event';
      event.type = 'coffee';
      event.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(event);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });

    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }
}
