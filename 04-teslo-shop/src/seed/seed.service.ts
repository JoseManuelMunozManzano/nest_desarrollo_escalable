import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

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

    return true;
  }
}
