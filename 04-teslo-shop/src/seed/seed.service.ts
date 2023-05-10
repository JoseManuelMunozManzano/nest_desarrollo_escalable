import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class SeedService {
  // Inyectamos la dependencia
  constructor(
    private readonly productsService: ProductsService,
    // Para poder eliminar los usuarios
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();

    await this.insertNewProducts(adminUser);

    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    // Borrar en el orden correcto.

    // Como tenemos cascade en los productos va a borrar automáticamente las imágenes.
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    // Se podría hacer un arreglo de promesas, pero lo vamos a hacer de otra manera por motivos educativos.
    // Un insert multilinea.
    const users: User[] = [];

    // Se encripta la contraseña.
    seedUsers.forEach(({ password, ...user }) => {
      // Recordar que esto crea pero no salva en Base de Datos.
      users.push(
        this.userRepository.create({
          ...user, // Esta es la encriptación, con un salt de 10
          password: bcrypt.hashSync(password, 10),
        }),
      );
    });

    const dbUsers = await this.userRepository.save(users);

    // Se devuelve el primer usuario para que este insertUsers se pueda pasar como argumento en insertNewProducts.
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    // Necesitamos acceso a products.service.ts, método deleteAllProducts
    await this.productsService.deleteAllProducts();

    // Insertar de forma masiva.
    // La idea es ejecutarlo una vez con data controlada. No queremos que el seed tenga ninguna
    // conexión con el proyecto salvo esto.
    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
