import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { GetCoffeeDto } from './dto/get-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';

@Controller('coffee')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  @Public()
  @Get()
  getCoffees(
    @Query() paginationQuery: PaginationQueryDto,
    @Protocol('https') protocol: string,
  ): Promise<GetCoffeeDto[]> {
    console.log('protocol', protocol);
    return this.coffeeService.getAllCoffees(paginationQuery);
  }

  @Public()
  @Get('/:id')
  async getCoffee(@Param('id', ParseIntPipe) id: string): Promise<Coffee> {
    return this.coffeeService.getCoffeeById(id);
  }

  @Public()
  @Post()
  createCoffee(@Body() dto: CreateCoffeeDto): Promise<GetCoffeeDto> {
    return this.coffeeService.create(dto);
  }

  @Public()
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

  @Post('/recommend/:id')
  recommendCoffee(@Param('id') id: number): Promise<void> {
    return this.coffeeService.recommendCoffee(id);
  }
}
