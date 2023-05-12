//import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// Para poder usar OpenApi, PartialType lo tenemos que importar de swagger. Con eso, coge los @ApiProperty que
// tengamos, en este caso en CreateProductDto.
export class UpdateProductDto extends PartialType(CreateProductDto) {}
