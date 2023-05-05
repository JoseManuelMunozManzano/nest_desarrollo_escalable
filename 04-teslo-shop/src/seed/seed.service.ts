import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  // Inyectamos la dependencia
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    // Necesitamos acceso a products.service.ts, método deleteAllProducts
    await this.productsService.deleteAllProducts();

    // Insertar de forma masiva.
    // La idea es ejecutarlo una vez con data controlada. No queremos que el seed tenga ninguna
    // conexión con el proyecto salvo esto.
    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
