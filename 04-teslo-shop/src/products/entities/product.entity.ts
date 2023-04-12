// Esto es lo que va a buscar TypeORM para crear la referencia en la BD.
// Es una representación del objeto Producto en la BD. Al final es una tabla.
// Pero hay que decorarlo con @Entity
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  // Vamos a usar 'uuid' que me da más control que un número incremental ('increment').
  @PrimaryGeneratedColumn('uuid')
  id: number;

  // Se pueden añadir configuraciones a @Column. En este ejemplo se ha indicado que title es un text y es unique.
  @Column('text', {
    unique: true,
  })
  title: string;

  // Si no ponemos float no es numérico
  @Column('float', {
    // Valor por defecto
    default: 0,
  })
  price: number;

  @Column({
    // Otra forma de indicar el tipo del campo
    type: 'text',
    nullable: true,
  })
  description: string;

  // Para tener urls friendly y obtener el producto
  // unique crea índices de forma automática
  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  // Ejemplo de arreglo
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  // Falta campo tags
  // Falta campo images

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

  // @BeforeUpdate()
}
