import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// Importándolo del archivo de barril index.ts
import { Product } from './';

@Entity()
export class ProductImage {
  // Autoincremental.
  // Identificador único de las imágenes que se van subiendo.
  @PrimaryGeneratedColumn()
  id: number;

  // Tiene que venir el url y de tipo text
  @Column('text')
  url: string;

  // Relación entre ProductImage y Product
  // No es una columna nueva, es una relación.
  // Muchas imágenes pueden pertenecer a un solo producto.
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
