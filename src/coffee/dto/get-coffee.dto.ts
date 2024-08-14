import { OmitType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from './create-coffee.dto';

interface Flavor {
  id: number;
  name: string;
}

export class GetCoffeeDto extends OmitType(CreateCoffeeDto, ['flavors']) {
  id: number;
  flavors: Flavor[];
}
