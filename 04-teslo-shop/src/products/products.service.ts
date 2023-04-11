import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  // El patrón repositorio ya viene definido por defecto en Nest. Antes había que hacer una clase independiente.
  // Para inyectar un repositorio se usa el decorador @InjectRepository e inyectaremos aquí nuestra entidad entre
  // paréntesis.
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // No olvidar poner estos métodos con async await, ya que las interacciones con BD son asíncronas.
  async create(createProductDto: CreateProductDto) {
    // Cómo uso mi entidad?
    // La primera forma es crear un nuevo producto
    // const producto = new Product();
    // Pero no se aconseja hacerlo de esta manera.
    //
    // Hay que usar el patrón repositorio, donde el repositorio se encargará de hacer las interacciones con la BD.
    // Por qué? Porque el patrón repositorio nos ayuda con la interacción de varias inserciones, actualizaciones
    // a la vez en BD, con las transacciones.
    //
    // Usando ahora el patrón repositorio con un try catch para atrapar los posibles errores.
    // Nos falta tratar los errores, por ejemplo una clave duplicada nos da status 500.
    // También nos falta tratar el campo slug. Si viene lo usamos, pero si no (es opcional) tendremos que
    // generarlo porque para la entity es unique.
    try {
      // Esto solo crea nuestra instancia de producto ya con un id. Todavía no hemos grabado en BD.
      const product = this.productRepository.create(createProductDto);
      // Para impactarlo en BD.
      await this.productRepository.save(product);
      // Regresamos el producto.
      return product;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Ayuda');
    }
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
