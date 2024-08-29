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
import { Coffee } from './schemas/coffee.schema';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';
import { Protocol } from '../common/decorators/protocol.decorator';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffee')
@Controller('coffee')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
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
  async getCoffee(@Param('id') id: string): Promise<Coffee> {
    return this.coffeeService.getCoffeeById(id);
  }

  @Post()
  createCoffee(@Body() dto: CreateCoffeeDto): Promise<GetCoffeeDto> {
    return this.coffeeService.create(dto);
  }

  @Patch('/:id')
  patchCoffee(
    @Param('id') id: string,
    @Body() dto: UpdateCoffeeDto,
  ): Promise<GetCoffeeDto> {
    return this.coffeeService.update(id, dto);
  }

  @Delete('/:id')
  deleteCoffee(@Param('id') id: string): Promise<GetCoffeeDto> {
    return this.coffeeService.remove(id);
  }

  @Post('recommend/:id')
  recommendCoffee(@Param('id') id: string) {
    return this.coffeeService.recommendCoffee(id);
  }
}
