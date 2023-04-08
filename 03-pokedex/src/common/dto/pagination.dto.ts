import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';
import { toNumber } from '../helper/valueTransform.helper';

export class PaginationDto {
  // Forma 2 de transformar un valor de query parameter de string a number (RECOMENDADA)
  // Usamos una función helper en common/helper, ya que es genérica y el decorador @Transform() para usarla.
  // Lo bueno es que no hacemos nada a nivel de aplicación. Al campo del DTO que lo necesite le hacemos la transformación.
  @Transform(({ value }) => toNumber(value))
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?: number;

  // Forma 3 de transformar un valor de query parameter de string a number.
  // Usando el decorador @Type y el tipo de dato al que se quiere pasar.
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  offset?: number;
}
