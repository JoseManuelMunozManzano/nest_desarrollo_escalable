import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  // Cargamos semilla de información (data)
  populateDB() {
    return 'SEED executeed';
  }
}
