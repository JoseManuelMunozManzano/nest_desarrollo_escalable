import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';

// Para conectar Nest a la BD de tipo relacional ver la siguiente página:
// https://docs.nestjs.com/techniques/database
// Hay que instalar:
// yarn add @nestjs/typeorm typeorm pg

@Module({
  imports: [
    // Para poder usar variables de entorno (.env) en Nest
    // Se modifica para poder usarlo de manera global
    ConfigModule.forRoot({ isGlobal: true }),
    // Configuración del TypeOrm usando Postgres
    // NOTA: Se usa forFeature() cuando queremos expandir funcionalidades.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // Para que cargue automáticamente las entidades que vamos definiendo.
      autoLoadEntities: true,
      // Esta propiedad a true solo para desarrollo. No se suele usar en Producción.
      // Cuando se borra una columna automáticamente la sincroniza.
      // Se puede usar una variable de entorno para gestionar el true o false.
      // En Producción se suelen hacer procesos de migraciones cuando cambia un archivo.
      synchronize: true,
    }),

    // Otras formas de desplegar los archivos usando una carpeta public.
    // En este ejemplo suponemos que las imágenes son contenido estático, es decir, son las que son.
    // Son recursos públicos que no van a cambiar. Los usuarios deben conocer el path para poder verlas.
    // Ventaja: Apenas hay que hacer nada salvo una instalación y una pequeña configuración.
    // Instalación necesaria: yarn add @nestjs/serve-static
    // Y la siguiente configuración.
    // Con esto podemos ir al navegador y escribir: http://localhost:3001/products/1473809-00-A_1_2000.jpg
    //
    // NOTA: Para el proyecto se quitan las imágenes de la ruta public y se llevan a la carpeta static/products.
    //   Hacemos uso del controlador y tenemos un control total de quien puede ver la imágenes (autorización)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
    AuthModule,
  ],
})
export class AppModule {}
