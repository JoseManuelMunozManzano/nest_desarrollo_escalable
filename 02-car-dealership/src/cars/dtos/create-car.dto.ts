// DTO (Data Transfer Object) - Son clases que se usan para asegurarnos que nuestra data fluye
// como queremos entre diferentes piezas de mi aplicación (lo que esperamos del request).
// Es mejor que sean clases en vez de interfaces porque incluso podemos hacer validaciones de la
// data.
//
// Es buena práctica que sean readonly para no modificar lo que nos llega en el request.
export class CreateCarDto {
  readonly brand: string;
  readonly model: string;
}
