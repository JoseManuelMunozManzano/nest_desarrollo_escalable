import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  // Documentar DTO's es fundamental, porque es la información que estamos esperando para que nuestro backend no
  // responda con un bad request.
  // Se hace igual que con las entities, usando @ApiProperty
  @ApiProperty({
    default: 10,
    description: 'How many rows do you need',
  })
  @IsOptional()
  @IsPositive()
  // Transformar la data, porque los dto por defecto no la transforman. Aunque se diga que es un number,
  // del request llegan como string y NO van a pasar las validaciones que hemos puesto aquí.
  // Se va a hacer distinto a 03-pokedex, donde se transformaba la data usando app.useGlobalPipes en main.ts con
  // enableImplicitConversions: true
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'How many rows do you want to skip',
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}
