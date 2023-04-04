import { join } from 'path'; // en Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  // Para cargar contenido estático se ha creado la carpeta public en el raiz del proyecto.
  // Se ha instalado el paquete: yarn add @nestjs/serve-static
  // Y se añade el siguiente código a los imports.
  // Igual se haría para Angular, React, Vue...
  // NOTA: Cuando aparece la palabra Module, siempre va en los inputs.
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    PokemonModule,
  ],
})
export class AppModule {}
