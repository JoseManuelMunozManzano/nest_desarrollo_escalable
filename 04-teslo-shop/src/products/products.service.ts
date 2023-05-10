import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ErrorHandleService } from '../common/services/error-handle.service';
import { ProductImage, Product } from './entities';
import { User } from '../auth/entities/user.entity';

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

    // Para crear instancias de las imágenes inyectamos ProductImage
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // Para el queryRunner, porque necesitamos saber la cadena de conexión que estamos usando, sabe el
    // usuario de BD que uso y tiene la misma configuración que nuestro repositorio.
    private readonly dataSource: DataSource,
  ) {}

  // No olvidar poner estos métodos con async await, ya que las interacciones con BD son asíncronas.
  async create(createProductDto: CreateProductDto, user: User) {
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
      const { images = [], ...productDetails } = createProductDto;

      // Esto solo crea nuestra instancia de producto ya con un id. Todavía no hemos grabado en BD.
      const product = this.productRepository.create({
        ...productDetails,
        // Como se está creando la imagen dentro de producto, el campo de relación, product, no hace
        // falta indicarlo, lo infiere TypeORM de forma automática.
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });

      // Para impactarlo en BD.
      // Salva tanto el producto como las imágenes.
      await this.productRepository.save(product);
      // Regresamos el producto.

      // Se indica así el return porque si no esto luce un poco diferente, se ve en Postman como un arreglo
      // con url e id, y de esta forma muestra solo la url, como se manda el Post en Postman, con el objetivo
      // de que el usuario que consuma la API no sepa como está construido.
      return { ...product, images };
    } catch (error) {
      // Tratando los errores de una mejor forma. Con logs centralizados en un servicio
      this.errorHandler.errorHandle(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,

      // Para mostrar las relaciones. En este caso images a true para que las muestre.
      relations: {
        images: true,
      },
    });

    // Aplanando las images para mostrar solo la url, no el objeto con el id.
    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
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
      //
      // Se indica el alias prod para trabajar con el en leftJoindAndSelect
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      // Los argumentos se indican en el where y se definen en el segundo parámetro.
      // Se indica getOne() porque puede que el término a buscar exista como título y como slug. De los 2
      // encontrados quiero que me devuelva solo uno.
      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toLocaleUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        // Para obtener las imágenes de la relación usando un QueryBuilder.
        // Se indica el campo y un alias por si se quisiera seguir haciendo joins.
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  // Método para aplanar
  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  // En la actualización todos los campos son opcionales pero hay ciertas restricciones.
  // Vamos a recibir como id un uuid.
  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    // toUpdate es la data que se va a actulizar sin las imágenes.
    const { images, ...toUpdate } = updateProductDto;

    // preload indica lo siguiente: Busca un producto por id y además carga todas las propiedades que estén
    // en updateProductDto.
    // Esto no actualiza, prepara para la actualización.
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    // Al actualizar, la parte de las imágenes realmente son dos consultas, la eliminación y la actualización
    // del producto, y ambas tienen que salir bien. Si alguna falla queremos revertir los cambios y mandar
    // un error al usuario indicándole que pasó.
    // Estas dos interacciones con la BD la vamos a hacer con el Query Runner.
    // https://orkhan.gitbook.io/typeorm/docs/insert-query-builder
    // Con Query Runner creamos transacciones.
    // Indicamos una serie de consultas. Si todas salen bien indicaremos que se impacte en BD.
    // Si una sale mal se puede hacer Rollback.
    // Luego desechamos el queryRunner.

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Ahora si se actualiza el producto.
    // PROBLEMA: Si cambio el título a uno existente dará error 500 por clave duplicada. Para ello se indica
    //   el try catch.
    //   Para el slug vamos a usar BeforeUpdate en product.entity.ts
    try {
      // Lo que se hace en este if no impacta en la BD hasta que no hagamos commit.
      if (images) {
        // Si hay imágenes las borramos.
        // El product que aparece es el Entity Target.
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        // Insertamos las nuevas imágenes
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      } else {
        // Si no hay imágenes que actualizar recuperamos las que tenga.
        // Notar que el return sería: return product;
        // Faltaría luego formatear las imágenes recupearadas.
        //
        // product.images = await this.productImageRepository.findBy({
        //   product: { id },
        // });
      }

      product.user = user;
      // Sigue sin ser commit. No se impacta todavía en BD
      await queryRunner.manager.save(product);

      // Ahora si impacta en BD
      await queryRunner.commitTransaction();

      // Desechando el queryRunner
      await queryRunner.release();

      return this.findOnePlain(id);
      //return product;
    } catch (error) {
      // Rollback
      // Notar que se creó el queryRunner fuera del try catch para poder usar el rollback aquí.
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.errorHandler.errorHandle(error);
    }
  }

  // Tal y como está el delete provoca un error de violación de foreign_key sobre product_image.
  // Para evitar el error y a la vez evitar tocar este método (queremos que quede así) podemos hacer 2 cosas:
  //  1. Crear una transacción, borrar las imágenes y borrar el producto. Con esta opción tenemos un gran
  //     control.
  //  2. Pero como product_image es una tabla simple, podemos hacer un delete en cascada. Cuando se borra
  //     el producto, también se borrará de forma automática las imágenes relacionadas de product_image.
  //     Ver product-image.entity.ts
  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
  }

  // Procedimiento destructivo para cuando estamos creando nuestra semilla de inserción.
  // Lo suyo es ejecutarlo solo en desarrollo y cuando aplique.
  // También se elimina en cascada la tabla product_image.
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      // Borramos todos los registros
      return await query.delete().where({}).execute();
    } catch (error) {
      this.errorHandler.errorHandle(error);
    }
  }
}
