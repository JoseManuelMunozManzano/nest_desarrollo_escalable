import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';

// Para conectar Nest a la BD de tipo relacional ver la siguiente página:
// https://docs.nestjs.com/techniques/database
// Hay que instalar:
// yarn add @nestjs/typeorm typeorm pg

@Module({
  imports: [
    // Para poder usar variables de entorno (.env) en Nest
    ConfigModule.forRoot(),
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
    ProductsModule,
    CommonModule,
    SeedModule,
    FilesModule,
  ],
})
export class AppModule {}
