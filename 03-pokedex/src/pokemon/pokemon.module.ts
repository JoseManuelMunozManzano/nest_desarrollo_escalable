// Toda la carpeta pokemon creada con el CLI de Nest, comando
// nest g res pokemon --no-spec
import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
