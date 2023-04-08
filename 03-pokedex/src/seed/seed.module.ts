// Módulo seed creado con el comando CLI:
// nest g res seed --no-spec
// Y luego se ha borrado lo que no se necesita: directorios dto, entities y
// verbos de seed.controller.ts y seed.service.ts
import { Module } from '@nestjs/common';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],

  // Para poder inyectar en seed.service.ts una variable de tipo Model<Pokemon> tenemos que importar
  // el PokemonModule, el cual está exportando MongooseModel.
  // En la consola Nest se verá: SeedModule dependencies initialized
  imports: [PokemonModule],
})
export class SeedModule {}
