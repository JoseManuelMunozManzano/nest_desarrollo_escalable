// La data que vamos a recibir en un POST
import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

// La tenemos que validar, por lo que tenemos que instalar: yarn add class-validator class-transformer
export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;

  @IsString()
  @MinLength(1)
  name: string;
}
