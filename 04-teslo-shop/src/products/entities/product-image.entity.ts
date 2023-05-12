import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

// Importándolo del archivo de barril index.ts
import { Product } from './';

// Se recomienda el uso de snake_case
@Entity({ name: 'product_images' })
export class ProductImage {
  // Autoincremental.
  // Identificador único de las imágenes que se van subiendo.
  @ApiProperty({
    example: 1,
    description: 'ProductImage ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  // Tiene que venir el url y de tipo text
  @ApiProperty({
    example: '1740176-00-A_0_2000.jpg',
    description: 'ProductImage Url',
  })
  @Column('text')
  url: string;

  // Relación entre ProductImage y Product
  // No es una columna nueva, es una relación.
  // Muchas imágenes pueden pertenecer a un solo producto.
  //
  // Se indica eliminación en cascada.
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
