import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  // Transformar la data, porque los dto por defecto no la transforman. Aunque se diga que es un number,
  // del request llegan como string y NO van a pasar las validaciones que hemos puesto aquí.
  // Se va a hacer distinto a 03-pokedex, donde se transformaba la data usando app.useGlobalPipes en main.ts con
  // enableImplicitConversions: true
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
