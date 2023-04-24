// La información que estamos esperando en el request para hacer el create del producto.
// Recordar que para poder usar los decoradores de validaciones hay que instalar 2 paquetes:
// yarn add class-validator class-transformer
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
  @IsString()
  @MinLength(1)
  title: string;

  // Hay que indicar @IsOptional() porque la interrogación indica que es opcional SOLO PARA TYPESCRIPT!
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  // Cada uno de los elementos del array tiene que ser un string, de ahí el each a true
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  // Se esperan estos valores
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @IsString({ each: true })
  @IsArray()
  // Como hay un default value lo ponemos como opcional
  @IsOptional()
  tags?: string[];

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
