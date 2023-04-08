// Módulo seed creado con el comando CLI:
// nest g res seed --no-spec
// Y luego se ha borrado lo que no se necesita: directorios dto, entities y
// verbos de seed.controller.ts y seed.service.ts
import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
