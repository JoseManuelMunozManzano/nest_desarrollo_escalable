// Volvemos a ver las entidades.
// En el proyecto 02-car-dealership se creó manualmente una entidad, pero como interface.
// Es mejor crearla como clase porque podemos definir reglas de negocio.
// Las entidades suelen ser iguales a como queremos grabar la data en una tabla (o colección de MongoDB).
// Una instancia es un registro de BD (o documento en MongoDB).
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Al extender de Document se le añaden funcionalidades como nombres, métodos... para trabajar fácilmente con el.
// Se indica el decorador @Schema() para indicar que es un esquema de BD. Le indica a la BD cuando esta se inicia
// cuales son las reglas y columnas que se van a usar.
@Schema()
export class Pokemon extends Document {
  // id: string // Mongo me da el identificador único.

  // Las reglas de negocio las informo con decoradores. Se usa @Prop de property
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

// Voy a basar este esquema en la clase Pokemon
export const PokemonSchema = SchemaFactory.createForClass(Pokemon);

// Nos hace falta hacer una conexión con nuestro módulo de la BD para que Mongoose lo pueda utilizar y yo poder
// hacer la inyección de dependencias para poder usar la clase Pokemon en mis servicios.
// Esto se hace en pokemon.module.ts
