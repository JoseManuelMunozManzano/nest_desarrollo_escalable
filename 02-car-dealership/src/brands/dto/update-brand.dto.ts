// El paquete mapped-types instalado automáticamente con el mandato nest g resource brands --no-spec
// nos permite extender un DTO basado en otro DTO con la excepción de que el PartialType hace que
// todas las propiedades que tenga en este caso CreateBrandDto sean opcionales.
// También se pueden añadir características únicas que tenga UpdateBrandDto.
//
// Esto es como lo que indicamos (pero no hicimos) en cars/dtos/UpdateCarDto

// import { PartialType } from '@nestjs/mapped-types';
// import { CreateBrandDto } from './create-brand.dto';

// export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

// NOTA: Para este caso no hace falta extender nada.
import { IsString, MinLength } from 'class-validator';
export class UpdateBrandDto {
  @IsString()
  @MinLength(1)
  name: string;
}
