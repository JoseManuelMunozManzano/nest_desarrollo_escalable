import { join } from 'path'; // en Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';

@Module({
  // Para cargar contenido estático se ha creado la carpeta public en el raiz del proyecto.
  // Se ha instalado el paquete: yarn add @nestjs/serve-static
  // Y se añade el siguiente código a los imports.
  // Igual se haría para Angular, React, Vue...
  // NOTA: Cuando aparece la palabra Module, siempre va en los inputs.
  imports: [
    // La posición es importante. Para las variables de entorno, poner al principio. Así evitamos
    // usar una variable de entorno sin que las hayamos cargado primero.
    //
    // Indicar que el Configuration Module nos ofrece un servicio que nos va a permitir hacer la inyección de
    // dependencias de las variables de entorno entre otras cosas (ver pokemon.service.ts y app.config.ts)
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // Para conectar Nest con Mongo se han hecho las siguientes instalaciones.
    // yarn add @nestjs/mongoose mongoose.
    // https://docs.nestjs.com/techniques/mongodb
    // Usamos variables de entorno. Ver fichero .env en raiz
    MongooseModule.forRoot(process.env.MONGODB),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {
  // Node ya tiene, de por si, variables de entorno.
  // Pero no aparecerán las de nuestro fichero .env hasta que no le digamos a Nest que las lea y las cargue para
  // que podamos usarlas.
  // Para ello hay que hacer 3 cosas:
  // 1) Hay que instalar el siguiente paquete:
  // yarn add @nestjs/config
  // 2) E importar (arriba se ve) ConfigModule.forRoot()
  // 3) Terminar la ejecución (Ctrl+C) y volver a ejecutar el proyecto.
  //
  // NOTA: Las variables de entorno, por defecto, siempre son string
  constructor() {
    console.log(process.env);
  }
}
