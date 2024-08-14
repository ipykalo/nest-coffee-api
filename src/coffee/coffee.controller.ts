import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { GetCoffeeDto } from './dto/get-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Controller('coffee')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  @Get()
  getCoffees(): Promise<GetCoffeeDto[]> {
    return this.coffeeService.getAllCoffees();
  }

  @Get('/:id')
  getCoffee(@Param('id') id: string): Promise<Coffee> {
    return this.coffeeService.getCoffeeById(id);
  }

  @Put()
  createCoffee(@Body() dto: CreateCoffeeDto): Promise<GetCoffeeDto> {
    return this.coffeeService.create(dto);
  }

  @Patch('/:id')
  patchCoffee(
    @Param('id') id: string,
    @Body() dto: CreateCoffeeDto,
  ): Promise<GetCoffeeDto> {
    return this.coffeeService.update(id, dto);
  }

  @Delete('/:id')
  deleteCoffee(@Param('id') id: string): Promise<GetCoffeeDto> {
    return this.coffeeService.remove(id);
  }
}
