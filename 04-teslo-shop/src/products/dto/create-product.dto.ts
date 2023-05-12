// La información que estamos esperando en el request para hacer el create del producto.
// Recordar que para poder usar los decoradores de validaciones hay que instalar 2 paquetes:
// yarn add class-validator class-transformer
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title (unique)',
    nullable: false,
    minLength: 1,
    required: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  // Hay que indicar @IsOptional() porque la interrogación indica que es opcional SOLO PARA TYPESCRIPT!
  @ApiProperty({
    description: 'Product price',
    default: 0,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Product description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product slug',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Product Stock',
    default: 0,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // Cada uno de los elementos del array tiene que ser un string, de ahí el each a true
  @ApiProperty({
    description: 'Product sizes',
    default: ['M', 'L'],
    required: true,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  // Se esperan estos valores
  @ApiProperty({
    description: 'Product gender',
    default: ['women'],
    required: true,
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  // Como hay un default value lo ponemos como opcional
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Product images',
    default: [],
    required: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
