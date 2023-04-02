import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

// Notar que tanto CreateCarDto como UpdateCarDto son identicos, salvo la propiedad id y que aquí
// las propiedades son opcionales.
// Se puede hacer que UpdateCarDto se base en las propiedades que ya existen en CreateCarDto, pero
// por ahora lo dejamos así.

// Es buena práctica que sean readonly para no modificar lo que nos llega en el request.
export class UpdateCarDto {
  // Es muy común que el programador front-end también nos envíe en el JSON el id.
  // Además de indicar el decorador de Nest @IsOptional(), a nivel TypeScript es recomendable usar
  // el signo ? para indicar opcionalidad.
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly id?: string;

  @IsString()
  @IsOptional()
  readonly brand?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  readonly model?: string;
}
