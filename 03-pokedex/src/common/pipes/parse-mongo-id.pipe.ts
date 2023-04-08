import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// To-dos los pipes tienen que implementar la interface PipeTransform.
// Los pipes transforman y/o validan los datos.
// En este caso validamos que el value es un mongoId válido.
@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({ value, metadata });

    if (!isValidObjectId(value)) {
      throw new BadRequestException(`${value} is not a valid MongoId`);
    }

    return value;
  }
}
