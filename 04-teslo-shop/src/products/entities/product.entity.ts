// Esto es lo que va a buscar TypeORM para crear la referencia en la BD.
// Es una representación del objeto Producto en la BD. Al final es una tabla.
// Pero hay que decorarlo con @Entity
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Importándolo del archivo de barril index.ts
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';

// Como hay muchos productos, se cambia el nombre para que en BD el nombre de la tabla sea products y no product.
// Si borramos las tablas para partir de cero, tenemos que echar abajo la ejecución, ir a Docker y borrar el
// contenedor.
// Ejecutamos de nuevo :docker-compose up -d
// Y ejecutamos el proyecto: yarn start:dev
// Con esto se regeneran las tablas de nuevo.
// Y ejecutamos de nuevo la carga del SEED.
@Entity({ name: 'products' })
export class Product {
  // Vamos a usar 'uuid' que me da más control que un número incremental ('increment').
  //
  // Para indicar las propiedades en OpenAPI se usa @ApiProperty.
  // Falta indicar al usuario más información sobre los campos, para indicar que este id no es solo un string,
  // también es un uuid y que es único.
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Se pueden añadir configuraciones a @Column. En este ejemplo se ha indicado que title es un text y es unique.
  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  title: string;

  // Si no ponemos float no es numérico
  @ApiProperty()
  @Column('float', {
    // Valor por defecto
    default: 0,
  })
  price: number;

  @ApiProperty()
  @Column({
    // Otra forma de indicar el tipo del campo
    type: 'text',
    nullable: true,
  })
  description: string;

  // Para tener urls friendly y obtener el producto
  // unique crea índices de forma automática
  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  stock: number;

  // Ejemplo de arreglo
  @ApiProperty()
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  // Ejemplo de petición real de añadir un campo nuevo tags
  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // images
  // Estableciendo la relación.
  // Un producto puede tener muchas imágenes.
  // Se indica que regresa un ProductImage y como la otra tabla se relaciona con esta.
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    // Para en products.service.ts, método findOne() pueda cargar también las imágenes.
    // Sin esto no carga la relación.
    eager: true,
  })
  images?: ProductImage[];

  // Vamos a indicar que usuario creo el producto.
  // Muchos productos pueden ser creados por solo un usuario (Many to One)
  // Se va a crear una nueva columna.
  //
  // No indicar aquí @ApiProperty() porque nos daría un error porque no tenemos establecida la relación directamente.
  @ManyToOne(
    // Entidad con la que se relaciona
    () => User,
    // Instancia del usuario y como se relaciona con esta tabla.
    (user) => user.product,
    // Para ver que usuario creo el producto. Carga automáticamente la relación.
    { eager: true },
  )
  user: User;

  // Cada vez que vayamos a insertar, antes vamos a realizar estas acciones.
  // Sería como un trigger.
  @BeforeInsert()
  checkSlugInsert() {
    // Si no nos viene el slug en el dto (es optional) lo vamos a crear nosotros.
    // El slug va a ser lo mismo que el title, que es obligatorio.
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  // Uso de @BeforeUpdate
  @BeforeUpdate()
  checkSlugUpdate() {
    // Si nos viene a blancos le ponemos el título
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
