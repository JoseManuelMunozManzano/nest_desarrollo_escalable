// Toda la carpeta pokemon creada con el CLI de Nest, comando
// nest g res pokemon --no-spec
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  // Para crear la referencias con nuestra colección basado en el esquema que acabamos de crear
  // El name que aparece en Pokemon.name sale de extender de Document. No es el campo name.
  // Cuando hacemos esto y vamos a MongoDB Compass ya deberíamos tener creada la tabla pokemons
  // RECORDAR: Módulos -> imports
  imports: [
    ConfigModule, // Para poder inyectar el ConfigurationService en pokemon.service.ts
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonSchema,
      },
    ]),
  ],

  // Para poder inyectar en seed.service.ts una variable de tipo Model<Pokemon> tenemos que exportar
  // el MongooseModule
  exports: [MongooseModule],
})
export class PokemonModule {}
