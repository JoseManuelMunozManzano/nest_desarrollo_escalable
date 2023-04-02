// DTO (Data Transfer Object) - Son clases que se usan para asegurarnos que nuestra data fluye
// como queremos entre diferentes piezas de mi aplicación (lo que esperamos del request).
// Es mejor que sean clases en vez de interfaces porque incluso podemos hacer validaciones de la
// data.
// Usando decoradores indicamos validaciones.
// Estos validators vienen de haber instalado class-validator
//

import { IsString } from 'class-validator';

// Es buena práctica que sean readonly para no modificar lo que nos llega en el request.
export class CreateCarDto {
  // Se debe enviar y como string
  // En este ejemplo se manda un mensaje personalizado
  @IsString({ message: `The brand must be a cool string` })
  readonly brand: string;

  @IsString()
  readonly model: string;
}
