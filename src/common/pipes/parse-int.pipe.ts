import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const number = parseInt(value, 10);

    if (isNaN(number)) {
      throw new BadRequestException(
        `Validation failed. The value: ${value} is not integer.`,
      );
    }

    return number;
  }
}
