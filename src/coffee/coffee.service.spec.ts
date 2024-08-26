import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import coffeeConfig from './config/coffee.config';

describe('CoffeeService', () => {
  let service: CoffeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Coffee), useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} },
        { provide: coffeeConfig.KEY, useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
