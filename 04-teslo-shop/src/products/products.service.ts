import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ErrorHandleService } from 'src/common/services/error-handle.service';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  // Usamos el servicio de manejo de errores
  private readonly errorHandler: ErrorHandleService = new ErrorHandleService(
    'ProductsService',
  );

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
    try {
      // Esto solo crea nuestra instancia de producto ya con un id. Todavía no hemos grabado en BD.
      const product = this.productRepository.create(createProductDto);
      // Para impactarlo en BD.
      await this.productRepository.save(product);
      // Regresamos el producto.
      return product;
    } catch (error) {
      // Tratando los errores de una mejor forma. Con logs centralizados en un servicio
      this.errorHandler.errorHandle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  // Vamos a buscar por uuid, por slug o por título.
  // Instalamos: yarn add uuid
  //             yarn add -D @types/uuid
  // porque no lo teníamos y viene con una función propia para evaluarlo llamada validate,
  // aunque también se puede evaluar con un regex.
  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // Para buscar por el título, es más complicado. Es más complejo de lo que los métodos por defecto permiten.
      // En este caso concreto se podría hacer con findOneBy y añadir un where, pero se va a explicar QueryBuilder.
      // Es una función que permite crear queries, pero con la seguridad de que se están escapando caracteres
      // especiales para evitar inyección SQL.
      const queryBuilder = this.productRepository.createQueryBuilder();
      // Los argumentos se indican en el where y se definen en el segundo parámetro.
      // Se indica getOne() porque puede que el término a buscar exista como título y como slug. De los 2
      // encontrados quiero que me devuelva solo uno.
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toLocaleUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }
}
