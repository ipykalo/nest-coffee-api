import { Test, TestingModule } from '@nestjs/testing';
import { CoffeeService } from './coffee.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Coffee } from './schemas/coffee.schema';
import { Flavor } from './schemas/flavor.entity';
import coffeeConfig from './config/coffee.config';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('CoffeeService', () => {
  let service: CoffeeService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeeService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        { provide: coffeeConfig.KEY, useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeeService>(CoffeeService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCoffeeById', () => {
    it('shoud return coffee object', async () => {
      const id = '1';
      const coffee = {};
      coffeeRepository.findOne.mockReturnValueOnce(coffee);

      expect(await service.getCoffeeById(id)).toEqual(coffee);
    });

    it('shoud throw NotFounfException', async () => {
      const id = '1';
      try {
        coffeeRepository.findOne.mockReturnValueOnce(undefined);
        const result = await service.getCoffeeById(id);
        expect(result).toBeFalsy();
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`Coffee with id: ${id} not found.`);
      }
    });
  });

  describe('getAllCoffees', () => {
    it('should return list of coffees', async () => {
      const coffees = [{}, {}, {}];
      coffeeRepository.find.mockReturnValueOnce(coffees);

      const result = await service.getAllCoffees({ limit: 1, offset: 10 });
      expect(result).toEqual(coffees);
    });
  });
});
